import React from 'react';
import { Text, View, FlatList, Modal, TextInput, Switch, TouchableOpacity, Alert} from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style'
import moment from 'moment';
import _ from 'lodash'
import uuid from 'uuid/v4';

import Patient, { HospitalizationStatusEnum, StatusVisitEnum, FinalizationErrorEnum } from '../../../model/Patient';
import { TrackingEndModeEnum } from '../../../model/Tracking';
import { Card, Button, Paragraph, List } from 'react-native-paper';

export default class Visitas extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			patient: this.props.patient,
			modalVisible: false,
			isEditable: this.props.isEditable,
			visit: {
				uuid: null,
				observation: '',
				alert: false,
				observationDate: '',
				endTracking: false,
				medicalRelease: false,
				removedAt: '',
			},
			update: false
		}
	}

	save = _ => {
		const newVisit = this.state.visit;
		let hasErrors = false;
		if(newVisit.observation.length === 0 ){
			Alert.alert('Atenção', 'O campo observação é obrigatório!',
							[{text: 'OK', onPress: () => {}},],
							{cancelable: false});
		} else {
			if(this.state.update){
				this.state.patient.observationList.forEach( element => {
				   if(this.isaSameVisit(newVisit, element)){
					   this.remove(element)
					} 
			  	}); 
			} else {
			   this.state.patient.observationList.forEach( element => {
				   if(this.isToday(element.observationDate)){
						hasErrors = true;
					} 
				}); 
			}
			
			if(!hasErrors){
				this.state.patient.observationList.push(newVisit)
				this.props.updatePatient(this.state.patient);
				this.toggleModal()
			} else {
				Alert.alert('Atenção', 'Visita já cadastrada!',
							[{text: 'OK', onPress: () => {}},],
							{cancelable: false});
			}
		}
		
	}

	alertToRemove = patient => {
		Alert.alert(
			'Atenção',
			'Deseja remover o item selecionado?',
			[{ text: 'Cancel',onPress: () => console.log('Cancel Pressed'), style: 'cancel'  },
			  {text: 'OK', onPress: () => {
				this.remove(patient);
			  }},
			],
			{cancelable: false},
		  );
	}

	showVisit = patient =>{
		this.toggleModal()
		this.state.visit = patient;
		this.state.update = true
	}

	toggleSwitch = alert => {
		this.setState({
			visit:{
				...this.state.visit,
				alert
			} 
		})
	}

	addObservation = observation => {
		this.setState({
			visit:{
				...this.state.visit,
				observation
			} 
		})
	}

	toggleModal = _ => {
	    this.setState({modalVisible: !this.state.modalVisible})
	}

 	appoint = _ => {
		 this.setState({ 
		 modalVisible: true,
		 update: false, 
		 visit: {
			uuid: uuid(),
			observation: '',
			alert: false,
			observationDate: moment().format(),
			endTracking: false,
			medicalRelease: false,
			removedAt: '',
			}
		})
	}

	finalize = () => {
		const patient = new Patient(this.state.patient);
		const errors = patient.validateFinalization();
		if (!errors.length) {
			Alert.alert('...', 'Em desenvolvimento.', [{text: 'OK'}], {cancelable: false})
		} else {
			let fields = FINALIZE_ERROR_FIELDS[errors[0]];
			let msg = '';
			if (errors.length === 1) {
				msg = 'O campo ' + fields + ' precisa ser preenchido.';
			} else {
				const lastIndex = errors.length - 1;
				for (let i = 1; i < lastIndex; i++) {
					fields += ', ' + FINALIZE_ERROR_FIELDS[errors[i]];
				}
				fields += ' e ' +  FINALIZE_ERROR_FIELDS[errors[lastIndex]];
				msg = 'Os campos ' + fields + ' precisam ser preenchidos.';
			}
			Alert.alert('Atenção', msg, [{text: 'OK'}], {cancelable: false});
		}
	}
	
	showModal = _ => {
		this.setState({modalVisible: false});
	}

	isToday(date) {
		const today = moment()
		let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
		let diffDays = today.diff(dateFormatted, 'days')
		return diffDays === 0 ? true : false
	}

	renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={_=>this.showVisit(item)}
			onLongPress={_=>this.alertToRemove(item)} >
			
			<List.Section style={{backgroundColor: '#F8F8FF'}} title={this.isToday(item.observationDate) ? 'Hoje' : 	moment(item.observationDate).format('DD/MM/YYYY')}>
				<List.Accordion title={item.observation}>
					<Paragraph>{item.observation}</Paragraph>
				</List.Accordion>
				 <Card.Actions>

				<Button>Editar</Button>

			    <Button>Excluir</Button>

                </Card.Actions>
			   </List.Section>

		</TouchableOpacity>
	);

	remove(patient) {
		const item = this.state.patient.observationList.filter(item => item.uuid !== patient.uuid);
		this.state.patient.observationList = item;
		this.props.updatePatient(this.state.patient);
	}

	isaSameVisit(newVisit, oldVisit) {
		return newVisit.uuid === oldVisit.uuid;
	}

	showButton = () => {
		const patient = new Patient(this.state.patient);
		switch (patient.getHospitalizationStatusEnum()) {
			case HospitalizationStatusEnum.Open:
				return (patient.getStatusVisitEnum() === StatusVisitEnum.Visited)
					? <VisitedButton/>
					: <VisitButton onPress={this.appoint}/>;

			case HospitalizationStatusEnum.CanBeClosed:
				const lastTracking = patient.getLastTracking();
				if (lastTracking && lastTracking.endMode === TrackingEndModeEnum.AdminDischarge) {
					return <FinalizeButton onPress={this.finalize}/>;
				}
				if (lastTracking && lastTracking.json.endDate) {
					return (patient.getStatusVisitEnum() === StatusVisitEnum.VisitedEndTracking)
						? <EndTrackingButtonDisabled/>
						: <EndTrackingButtonEnabled/>;
				}
			case HospitalizationStatusEnum.Closed:
				console.warn('Visitas: finalizado não é exibido.', patient);
				return null;
		}
		console.warn('Visitas: tipo de botão não mapeado.', patient);
		return null;
	}
	
	render() {
		let listOfOrderedObservationDate =[]
		if(this.props.patient.observationList){
			listOfOrderedObservationDate = _.orderBy(this.props.patient.observationList, ['observationDate'], ['desc'])
		}
		console.log("listOfOrderedObservationDate", listOfOrderedObservationDate)
		return (
			<View style={ styles.container }>



				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() =>{ console.log("Modal has been closed.") } }>
						<View style={styles.overlay}>
							<View style={{backgroundColor: '#F8F8FF', borderRadius: 4, flexDirection: "row", flexWrap: 'wrap', height: '60%', marginTop: '25%', padding: 10}}>
							
								<View style={{flexDirection: "row", width: '100%', justifyContent: 'space-between', backgroundColor: "#005cd1", alignItems: 'center'}}>
										<Button backgroundColor={'#005cd1'} onPress={this.toggleModal}>
											<Icon type="AntDesign" name="close" style={{color: 'white', fontSize: 18, marginTop: 1, marginBottom: 1, marginLeft: '5%'}} />
										</Button>
										<Text style={{fontWeight: "bold", fontSize: 18, color: 'white'}}>Visita</Text>
										<Button backgroundColor={'#005cd1'} onPress={this.save}>
											<Icon type="AntDesign" name="save" style={{color: 'white', fontSize: 18, marginTop: 1, marginBottom: 1, marginRight: '5%'}} />
										</Button>
								</View>

								<View style={{flexDirection: "row", width: '100%', flexWrap: 'wrap', alignItems:'center', paddingTop: '10%'}}>
									<View style={{order: 1 , width:'10%', paddingLeft: 2}} >
										<Icon type="Feather" name="alert-circle" style={{color: 'red', fontSize: 25}} />
									</View>
									<View style={{order: 2, width:'70%'}}>
										<Text style={{fontSize: 19, fontWeight: "bold"}}>Alerta</Text>
									</View>
									<View style={{order: 3, width:'20%', paddingLeft: 2}}>
										<Switch onValueChange={this.toggleSwitch} value={this.state.visit.alert} style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 } ]}}/>
									</View>	
								</View>

								<View style={{flexDirection: "row", width: '100%', flexWrap: 'wrap', paddingTop: '15%'}}>
									<Text style={{fontWeight: "bold", width: '100%', fontSize: 17}}>Observação:</Text>
									<TextInput multiline={true}	
									numberOfLines={5} maxHeight={'70%'} style={styles.textArea} value={this.state.visit.observation} onChangeText = {observation => this.addObservation(observation)} />
								</View>
							</View>
						</View>
					</Modal>	

				<FlatList
					data={listOfOrderedObservationDate}
					keyExtractor={item => item.uuid}
					extraData={this.props}
					renderItem={this.renderItem}/>

				{this.showButton()}
			</View>
		);
	}
}

const FINALIZE_ERROR_FIELDS = [];
FINALIZE_ERROR_FIELDS[FinalizationErrorEnum.HeightAndWeightMissing] = 'Altura / Peso';
FINALIZE_ERROR_FIELDS[FinalizationErrorEnum.AttendanceTypeMissing] = 'Atendimento';
FINALIZE_ERROR_FIELDS[FinalizationErrorEnum.HospitalizationTypeMissing] = 'Tipo';
FINALIZE_ERROR_FIELDS[FinalizationErrorEnum.PrimaryCidMissing] = 'CID Primário';
FINALIZE_ERROR_FIELDS[FinalizationErrorEnum.CrmMissing] = 'CRM do Responsável';

const COLORS_ENABLED = ['#035fcc', '#023066'];
const COLORS_DISABLED = ['#808080', '#696969'];

const GradientButton = (props) => (
	<View style={ styles.rowButtonCircle }>
		<LinearGradient colors={ props.colors } style={ [styles.circle, styles.borderCircle ]} >
			<Icon type="FontAwesome5" name={ props.iconName } style={ styles.iconCircle } onPress={ props.onPress }/>
			<Text style={ styles.textCircle } >{ props.children }</Text>
		</LinearGradient>
	</View>
);

const VisitButton = (props) =>
	<GradientButton colors={COLORS_ENABLED} iconName="id-badge" onPress={props.onPress}>VISITAR</GradientButton>;

const VisitedButton = (props) =>
	<GradientButton colors={COLORS_DISABLED} iconName="id-badge">VISITADO</GradientButton>;

const FinalizeButton = (props) =>
	<GradientButton colors={COLORS_ENABLED} iconName="id-badge" onPress={props.onPress}>FINALIZAR</GradientButton>;

const EndTrackingButtonEnabled = (props) =>
	<GradientButton colors={COLORS_ENABLED} iconName="id-badge" onPress={props.onPress}>FIM DO MONITORAMENTO</GradientButton>;

const EndTrackingButtonDisabled = (props) =>
	<GradientButton colors={COLORS_DISABLED} iconName="id-badge">FIM DO MONITORAMENTO</GradientButton>;

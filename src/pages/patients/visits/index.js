import React from 'react';
import { Dimensions, View, FlatList, TextInput, Alert } from 'react-native';
import baseStyles from '../../../styles'
import styles from './style'
import moment from 'moment';
import _ from 'lodash'
import uuid from 'uuid/v4';

import Patient, { HospitalizationStatusEnum, StatusVisitEnum, FinalizationErrorEnum } from '../../../model/Patient';
import { TrackingEndModeEnum } from '../../../model/Tracking';
import TabEnum from '../PatientDetailTabEnum';

import { Card, CardItem, Text, Body, Right, Left } from "native-base";
import { Button, Switch, Divider, Portal, Dialog } from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Visitas extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			patient: this.props.patient,
			modalVisible: false,
			hospitalId: this.props.hospitalId,
			isEditable: this.props.isEditable,
			visit: {
				uuid: null,
				observation: '',
				alert: false,
				observationDate: '',
			},
			update: false
		}
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		const hospitalId = this.props.hospitalId;
		this.setState({hospitalId});
	});

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
				this.props.handleUpdatePatient("observationList", this.state.patient.observationList)
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
			'Deseja remover esta visita?',
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
			}
		})
	}

	finalize = () => {
		const patient = new Patient(this.state.patient);
		const errors = patient.validateFinalization();

		if (!errors.length) {
			this.props.navigation.navigate('Finalize', { patientId: patient.json.id, handleUpdatePatient: this.props.handleUpdatePatient, hospitalId: this.state.hospitalId });
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
			this.props.selectTab(TabEnum.Profile);
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

		<View style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: baseStyles.container.backgroundColor}}>
				<Card>
					<CardItem header bordered style={{ flex: 1, backgroundColor: '#cce5ff', height: 60}}>
						<Left>
							<Text style={{ fontSize: 16, fontWeight: 'bold'}}>VISITA</Text>
						</Left>
						<Right>
							<Text>{this.isToday(item.observationDate) ? 'Hoje' : 	moment(item.observationDate).format('DD/MM/YYYY')}</Text>
						</Right>
					</CardItem>
				    
		            <CardItem bordered>
						<Body>
							<Text>
								{item.observation}
							</Text>
						</Body>
		            </CardItem>

					<CardItem footer bordered style={{ alignItems: 'center', justifyContent: 'center', height: 40}}>							
						<View>
							<Button color='#00dda2' style={{color: '#00dda2'}} icon="add" onPress={_=>this.showVisit(item)}>Editar</Button>
						</View>
						<View  style={{borderRightColor: '#ffffff', borderWidth: 1, height: '80%', borderBottomColor: '#ffffff', borderTopColor: '#ffffff', borderLeftColor: '#ebeff2'}}></View>
						<View>
							<Button color='#f73655' style={{color: '#f73655'}} icon="remove" onPress={_=>this.alertToRemove(item)}>Excluir</Button>
						</View>
					</CardItem>

				</Card>
			</View>

		);
	
	remove(patient) {
		const visits = this.state.patient.observationList.filter(item => item.uuid !== patient.uuid);
		this.state.patient.observationList = visits;
		this.props.handleUpdatePatient("observationList", this.state.patient.observationList);
	}

	isaSameVisit(newVisit, oldVisit) {
		return newVisit.uuid === oldVisit.uuid;
	}

	showButton = () => {
		
		const patient = new Patient(this.state.patient);

		console.log(patient);

		if (this.state.isEditable) {

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
		}

		console.warn('Visitas: tipo de botão não mapeado.', patient);
		return null;
	}
	
	renderModal() {
		return(
			<Portal>
				<Dialog visible={this.state.modalVisible} onDismiss={ () => { this.toggleModal() } }>
					<Dialog.Title>Visita</Dialog.Title>
					<Dialog.Content>
						<View style={styles.alertInformation}>
							<View style={{order: 1 , width:'10%', paddingLeft: 2}} >
								<Icon name="exclamation" style={{color: 'red', fontSize: 25}} />
							</View>
							<View style={{order: 2, width:'70%'}}>
								<Text style={{fontSize: 19, fontWeight: "bold"}}>Alerta</Text>
							</View>
							<View style={{order: 3, width:'20%', paddingLeft: 2}}>
								<Switch value={this.state.visit.alert} onValueChange={this.toggleSwitch} />
							</View>	
						</View>
						<View style={styles.observation}>
							<Text style={styles.textObservation}>Observação</Text>
							<TextInput multiline={true}	 numberOfLines={3} style={styles.textArea} value={this.state.visit.observation} onChangeText = {observation => this.addObservation(observation)} />
						</View>	
					</Dialog.Content>

					<Divider />
					
					<Dialog.Actions>
						<Button onPress={ () => { this.toggleModal() } }>Fechar</Button>
						<Button onPress={ () => { this.save() } }>Salvar</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		);
	}

	render() {
		let listOfOrderedObservationDate =[]
		if (this.props.patient.observationList){
			listOfOrderedObservationDate = _.orderBy(this.props.patient.observationList, ['observationDate'], ['desc'])
		}
		return (

			<View style={{ ...baseStyles.container, height: Math.round(Dimensions.get('window').height - 110) }}>	
				{ this.renderModal() }
				<FlatList
					data={listOfOrderedObservationDate}
					keyExtractor={item => item.uuid}
					extraData={this.props}
					renderItem={this.renderItem}/>
				{ this.showButton() }
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
	<View style={{marginTop:10, marginBottom: 10, marginLeft: 10, marginRight: 10}}>
		<Button mode="contained" onPress={ props.onPress }> { props.children } </Button>
		{/* <LinearGradient colors={ props.colors } style={ [styles.circle, styles.borderCircle ]} >
				<Icon type="FontAwesome5" name={ props.iconName } style={ styles.iconCircle } onPress={ props.onPress }/>
				<Text style={ styles.textCircle } >{ props.children }</Text>
			</LinearGradient>  */}
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

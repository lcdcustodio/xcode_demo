import React from 'react';
import { ScrollView, View, FlatList, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { toJsonDate } from '../../../components/rededor-base';
import baseStyles from '../../../styles'
import styles from './style'
import moment from 'moment';
import _ from 'lodash'
import uuid from 'uuid/v4';
import { Card, CardItem, Text, Body, Right, Left } from "native-base";
import { Button, Switch, Divider, Portal, Dialog, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { RdIf } from '../../../components/rededor-base'
import Patient, { FinalizationErrorEnum } from '../../../model/Patient';
import TabEnum from '../PatientDetailTabEnum';

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
				observationDate: toJsonDate(),
			},
			update: false,
			keyboardSpace: 0
		}
		
		Keyboard.addListener('keyboardDidShow',(frames)=>{
            if (!frames.endCoordinates) return;
            this.setState({
				keyboardSpace: frames.endCoordinates.height
			});
		});
		
        Keyboard.addListener('keyboardDidHide',(frames)=>{
            this.setState({keyboardSpace:0});
        });
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		const hospitalId = this.props.hospitalId;
		this.setState({hospitalId});
	});

	save = _ => {
		const newVisit = this.state.visit;

		if (!this.hasObservation) {
			Alert.alert('Atenção', 'O campo observação é obrigatório!',
				[{text: 'OK', onPress: () => {}},], {cancelable: false}
			);
		} else {

			if (this.state.update) {
				this.state.patient.observationList.forEach( element => {
					if (this.isaSameVisit(newVisit, element)) {
						element.observation = newVisit.observation;
						element.alert = newVisit.alert;
						element.uuid = newVisit.uuid;
						element.observationDate = toJsonDate();
					}
				});
			} else {
				if (!this.hasObservationToday()) {
					let observationList = this.state.patient.observationList;
					observationList.push(newVisit)
					this.setState({ 
						patient: {
							...this.state.patient,
							observationList 
						}
					});
				}
			}

			this.props.handleUpdatePatient("observationList", this.state.patient.observationList)
			this.toggleModal();
		}
	}

	hasObservation(visit) {
		let result = true;
		if(visit.observation.length === 0 ){
			result = false;
		}
		return result;
	}

	showIconEdit(show) {

		if (show) {
			return <Icon name="edit" style={{color: '#333', fontSize: 20}} />;
		}

		return;
	}

	hasObservationToday() {
		let result = false;
		if(this.state.patient.observationList) {
			this.state.patient.observationList.forEach( element => {
				if (this.isToday(element.observationDate)) {
					result = true;
				}
			});
		}
		return result;
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

	showVisit = visit => {

		if (!this.isToday(visit.observationDate)) {
			return;
		}

		this.toggleModal()
		this.setState({
			visit,
			update: true
		});
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
				observationDate: toJsonDate(),
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

	getParamnDate(date) {

		if (date == null) {
			return '';
		}

		return moment(date).format('DD/MM/YYYY');
	}

	renderItem = ({ item, index }) => {
		const { patient } = this.state;
		const observations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);
		const lastObservation = observations.length ? observations[0] : null;
		const hasMedicalRelease = (lastObservation && lastObservation.medicalRelease);
		const isEdit = this.state.isEditable && !hasMedicalRelease;
		const onPress =  isEdit ? (_=>this.showVisit(item)) : null;
		if(item.uuid) {

			if (index <= 29) {
				return (	
					<TouchableWithoutFeedback onPress={onPress}>
	
						<View style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: baseStyles.container.backgroundColor}}>
							<Card>
								<CardItem header bordered style={{ flex: 1, backgroundColor: '#cce5ff', height: 60}}>
									<Left>
										<Text style={{ fontSize: 16, fontWeight: 'bold'}}>Visita {isEdit && this.showIconEdit(this.isToday(item.observationDate))}</Text>
									</Left>
									<Right>
										<Text>{this.isToday(item.observationDate) ? 'Hoje' : this.getParamnDate(item.observationDate)}</Text>
									</Right>
								</CardItem>
								
								<CardItem bordered>
									<Body>
										<Text>
											{item.observation}
										</Text>
									</Body>
								</CardItem>
							</Card>
						</View>
	
					</TouchableWithoutFeedback>
				);
			}
		} else return null;
	};
	
	remove(patient) {
		const newObservationList = this.state.patient.observationList.filter(item => item.uuid !== patient.uuid);
		this.setState({
			patient: {
				...this.state.patient,
				observationList: newObservationList
			}
		});
		this.props.handleUpdatePatient("observationList", this.state.patient.observationList);
	}

	isaSameVisit(newVisit, oldVisit) {
		return newVisit.uuid === oldVisit.uuid;
	}

	showButton = () => {
		const { patient } = this.state;
		const observations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);
		const lastObservation = observations.length ? observations[0] : null;
		if (lastObservation && lastObservation.medicalRelease) {
			return <FinalizedButton/>;
		}
		if (patient.exitDate != null) {
			return <FinalizeButton onPress={this.finalize}/>;
		}
		if (lastObservation) {
            const today = moment();
            const lastVisit = moment(moment(lastObservation.observationDate).format('YYYY-MM-DD'));
			if (today.diff(lastVisit, 'days') === 0) {
				return <VisitedButton/>;
			}
		}
		return <VisitButton onPress={this.appoint}/>;
	}

	/*showButton = () => {
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
				console.log('Visitas: finalizado não é exibido.', patient);
				return null;
		}
		console.log('Visitas: tipo de botão não mapeado.', patient);
		return null;
	}*/
	
	renderModal() {
		return(
			<Portal>
				<Dialog style={{top: this.state.keyboardSpace ? -(this.state.keyboardSpace * .47) : 0}} visible={this.state.modalVisible} onDismiss={ () => { this.toggleModal() } }>
					<Dialog.Title>Visita</Dialog.Title>
					<Dialog.Content>
						<View style={{backgroundColor: 'white'}}>
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
							<View>
							<Dialog.ScrollArea>
							<ScrollView style={ styles.dialogScrollView } keyboardShouldPersistTaps='always'>
								<View style={{height: 160}}>
									<TextInput style={ styles.textObservation } multiline={true} numberOfLines={5} placeholder='Observação' value={this.state.visit.observation} onChangeText = {observation => this.addObservation(observation)} />
								</View>
							</ScrollView>
							</Dialog.ScrollArea>
							</View>	
						</View>
					</Dialog.Content>

					<Divider/>
					
					<Dialog.Actions >
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

		console.log(listOfOrderedObservationDate);

		return (
			<View style={ styles.container }>
				{ this.renderModal() }
				<FlatList
					data={listOfOrderedObservationDate}
					keyExtractor={item => item.uuid}
					extraData={this.props}
					renderItem={this.renderItem}/>
				{ this.state.isEditable && this.showButton() }
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

const VisitsButton = (props) => (
	<View style={{ marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
		<Button mode="contained" onPress={ props.onPress }> { props.children } </Button>
    </View>
);

const VisitButton = (props) =>
	<VisitsButton colors={COLORS_ENABLED} iconName="id-badge" onPress={props.onPress}>VISITAR</VisitsButton>;

const VisitedButton = (props) =>
	<VisitsButton colors={COLORS_DISABLED} iconName="id-badge">VISITADO</VisitsButton>;

const FinalizeButton = (props) =>
	<VisitsButton colors={COLORS_ENABLED} iconName="id-badge" onPress={props.onPress}>FINALIZAR</VisitsButton>;

const FinalizedButton = (props) =>
	<VisitsButton colors={COLORS_DISABLED} iconName="id-badge">FINALIZADO</VisitsButton>;

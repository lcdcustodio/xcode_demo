import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Body, Right, Left } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Timeline from '../../../components/Timeline';
import TimelineEvent, { TimelineEventEnum, TimelineEventEvaluation, timelineEventSorter } from '../../../util/TimelineEvent'
import { List, Button} from 'react-native-paper';


export default class Events extends Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			eventos: this._loadEvents(),
			isEditable: this.props.isEditable
		};
	}
		
	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		this.setState({
			eventos: this._loadEvents() 
		});
	});

	render() {
		return (
			<View style={styles.container}>
				
				<FlatList 
					data={this.state.eventos}
					/*renderEvent={this._renderEvent}
					lineColor={'#b1b1b1'} 
					circleColor={'#005cd1'} 
					innerCircle={'dot'} 
					circleSize={20}
					renderFullLine={true} 
					lineWidth={4} 
					timeStyle={styles.date}   */
					renderItem={this._renderEvent}  />

				<View style={{marginTop:10, marginBottom: 10, marginLeft: 10, marginRight: 10}}>

				<Button mode="contained" onPress={this._create}> APONTAR </Button>

{/* 					<LinearGradient colors={['#035fcc', '#023066']} style={ [styles.circle, styles.borderCircle ]} >
						<Icon type='Entypo' name='sound-mix' style={ styles.iconCircle } onPress={this._create} />
						<Text style={ styles.textCircle }>APONTAR</Text>
					</LinearGradient> */}

				</View>

			</View>
		);
	}

	_loadEvents = () => {
		const patient = this.props.patient;
		let events = [];
		this._pushEvent(events, patient.recommendationWelcomeHomeIndication, this._createRecommendation);
		this._pushEvent(events, patient.recommendationMedicineReintegration, this._createRecommendation);
		this._pushEvent(events, patient.recommendationClinicalIndication, this._createRecommendation);
		this._pushEvents(events, patient.examRequestList, this._createExamRequest);
		this._pushEvents(events, patient.furtherOpinionList, this._createFurtherOpinion);
		this._pushEvents(events, patient.medicalProceduresList, this._createMedicalProcedure);
		this._pushEvents(events, patient.medicineUsageList, this._createMedicineUsage);
		events.sort(timelineEventSorter);
		return events;
	}

	_pushEvents = (destination, source, formatter) => {
		source.forEach((jsonItem) => { destination.push(formatter(jsonItem)) });
	}

	_pushEvent = (destination, source, formatter) => {
		if (source) {
			destination.push(formatter(source));
		}
	}

	_createRecommendation = (json) => new TimelineEvent(
		TimelineEventEnum.Recommendation,
		json,
		new Date(json.performedAt),
		'Recomendação para alta',
		json.observation,
		json.specialty ? json.specialty: null,
		null,
		null,
	);

	_createExamRequest = (json) => new TimelineEvent(
		TimelineEventEnum.ExamRequest,
		json,
		new Date(json.performedAt),
		'Exame',
		json.examDisplayName,
		(json.examHighCost ? 'Alto Custo' : null),
		this._createEvaluation(json.costEvaluation),
		this._createEvaluation(json.qualityEvaluation),
	);

	_createFurtherOpinion = (json) => new TimelineEvent(
		TimelineEventEnum.FurtherOpinion,
		json,
		new Date(json.performedAt),
		'Parecer',
		json.specialtyDisplayName,
		null,
		this._createEvaluation(json.costEvaluation),
		this._createEvaluation(json.qualityEvaluation),
	);
	
	_createMedicalProcedure = (json) => new TimelineEvent(
		TimelineEventEnum.MedicalProcedure,
		json,
		new Date(json.performedAt),
		'Procedimento',
		json.tussDisplayName,
		null,
		this._createEvaluation(json.costEvaluation),
		this._createEvaluation(json.qualityEvaluation),
	);

	_createMedicineUsage = (json) => new TimelineEvent(
		TimelineEventEnum.MedicineUsage,
		json,
		new Date(json.performedAt),
		'Medicamento',
		json.medicineDisplayName,
		null,
		this._createEvaluation(json.costEvaluation),
		this._createEvaluation(json.qualityEvaluation),
	);
	
	_createEvaluation = (json) => (json 
		? new TimelineEventEvaluation(json.satisfactory, json.observation)
		: null);

	_create = () => {
		this.props.navigation.navigate('Recommendation', {	patient: this.props.patient, update: false });
	}

	isaRecommendation = typeEnum => typeEnum === 4;
	
	isaPatientWithDischarge = _ =>  this.props.patient.iconNumber === 1; 
	
	_read = (event) => {
		console.log("event", event)
		const {patient, hospital, baseDataSync} = this.props.parent.state;
		if(this.isaRecommendation(event.typeEnum)){
			if(this.isaPatientWithDischarge()){
				Alert.alert('Atenção', "Paciente já está de alta",[{text: 'OK', onPress: () => {}}],{cancelable: false});
			} else {
				this.recommendationSelected(event, patient);
				this.props.parent.props.navigation.navigate('Recommendation', {patient, update: true});
			}
		} else {
			this.props.parent.props.navigation.navigate('EventDetail', {
				event,
				patient,
				hospital,
				baseDataSync,
			});
		}
	}

	_delete = (event) => {

		if(this.isaRecommendation(event.typeEnum)){
			
			if(this.isaPatientWithDischarge()){
				Alert.alert('Atenção', "Não é permitido excluir a recomendação selecioanada!",[{text: 'OK', onPress: () => {}}],{cancelable: false});
			} else {
				let uuid = event.data.uuid;
				if(this.props.patient.recommendationClinicalIndication && uuid === this.props.patient.recommendationClinicalIndication.uuid)	{
					this.props.patient.recommendationClinicalIndication = null;
				} else 
				if(this.props.patient.recommendationMedicineReintegration && uuid === this.props.patient.recommendationMedicineReintegration.uuid) { 
						this.props.patient.recommendationMedicineReintegration = null;
				} else 
				if(this.props.patient.recommendationWelcomeHomeIndication && uuid === this.props.patient.recommendationWelcomeHomeIndication.uuid) {
					this.props.patient.recommendationWelcomeHomeIndication = null;
				}
				
				this.setState({
					eventos: this._loadEvents() 
				});
			}
		} else {
			this._read(event); 
		}
		
	}

	_renderEvent = (event, index) => {
		console.log("event", event)
		return (
		<View key={index} style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: '#fefefe'}}>
		<Card>
			<CardItem header bordered style={{ flex: 1, backgroundColor: '#cce5ff', height: 40}}>
				<Left>
					<Text style={{ fontSize: 16, fontWeight: 'bold'}}>{event.name}</Text>
				</Left>
				<Right>
					<Text>01/01/2018</Text>
				</Right>
			</CardItem>
			
			<CardItem bordered>
				<Body>
					<Text>
						uma oobservacao aqui
					</Text>
				</Body>
			</CardItem>

			<CardItem footer bordered style={{ alignItems: 'center', justifyContent: 'center', height: 40}}>							
				<View>
					<Button color='#00dda2' icon="add" onPress={_=>this.showVisit(item)}>Editar</Button>
				</View>
				<View  style={{borderRightColor: '#ffffff', borderWidth: 1, height: '80%', borderBottomColor: '#ffffff', borderTopColor: '#ffffff', borderLeftColor: '#ebeff2'}}></View>
				<View>
					<Button color='#f73655' icon="remove" onPress={_=>this.alertToRemove(item)}>Excluir</Button>
				</View>
			</CardItem>

		</Card>
		</View>
	);
}

	recommendationSelected(event, patient) {
		let uuid = event.data.uuid;
		if (patient.recommendationClinicalIndication && uuid === patient.recommendationClinicalIndication.uuid) {
			patient.recommendationType = 'INDICACAO_AMBULATORIO';
			patient.recommendation = patient.recommendationClinicalIndication;
		}
		else if (patient.recommendationMedicineReintegration && uuid === patient.recommendationMedicineReintegration.uuid) {
			patient.recommendationType = 'RECOMENDACAO_MEDICAMENTOSA';
			patient.recommendation = patient.recommendationMedicineReintegration;
		}
		else if (patient.recommendationWelcomeHomeIndication && uuid === patient.recommendationWelcomeHomeIndication.uuid) {
			patient.recommendationType = 'WELCOME_HOME';
			patient.recommendation = patient.recommendationWelcomeHomeIndication;
		}
	}
}

const styles = StyleSheet.create({
	container: {
		height: Math.round(Dimensions.get('window').height - 130 ),
	},
	date: {
		fontFamily:'Segoe UI', 
		fontWeight:'400', 
		fontStyle:'normal', 
		color:'#9d9d9d',
	},
	description: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontFamily:'Segoe UI', 
		fontSize:18, 
		fontWeight:'300', 
		fontStyle:'normal', 
		lineHeight:19, 
		letterSpacing:0, 
		color:'#000000',
	},
	highlight: {
		width: '35%',
		height: '140%',
		padding: '3%',
		paddingLeft: '5%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily:'Segoe UI', 
		fontWeight:'400', 
		fontSize:13, 
		fontStyle:'normal', 
		lineHeight:13,
		color: '#bfcc4d',
		backgroundColor: '#cf175c',
	},
	rowButtonCircle: {
		marginTop: '5%',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	circle: {
		paddingTop: '4%',
		width: 80,
		height: 80,
		borderRadius: 80/2,
		flexDirection: 'column',
		alignItems: 'center'
	},
	borderCircle: {
		borderColor: '#707070',
		borderStyle: 'solid',
		borderWidth: 1,
	},
	iconCircle: {
		color: 'white'
	},
	textCircle: {
		fontFamily: 'Gotham Rounded', 
		fontSize:12, 
		fontWeight: 'normal', 
		fontStyle: 'normal', 
		letterSpacing: 0, 
		color: 'white' 
	}
});

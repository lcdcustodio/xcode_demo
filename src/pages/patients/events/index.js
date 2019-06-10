import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Timeline from '../../../components/Timeline';
import TimelineEvent, { TimelineEventEnum, TimelineEventEvaluation, timelineEventSorter } from '../../../model/TimelineEvent'

export default class Events extends Component {
	
	constructor(props) {
		super(props);
		this.state = { eventos: this._loadEvents() };
	}
	
	render() {
		return (
			<View style={styles.container}>
				<Timeline 
					data={this.state.eventos}
					renderEvent={this._renderEvent}
					lineColor={'#b1b1b1'} 
					circleColor={'#005cd1'} 
					innerCircle={'dot'} 
					circleSize={20}
					renderFullLine={true} 
					lineWidth={4}
					timeStyle={styles.date}
					renderDetail={this._renderEvent} />
				<View style={ styles.rowButtonCircle }>
					<LinearGradient colors={['#035fcc', '#023066']} style={ [styles.circle, styles.borderCircle ]} >
						<Icon type='Entypo' name='sound-mix' style={ styles.iconCircle } onPress={this._create} />
						<Text style={ styles.textCircle }>APONTAR</Text>
					</LinearGradient>
				</View>
			</View>
		);
	}

	_loadEvents = () => {
		const patient = this.props.patient;
		let events = [];
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
		this.props.navigation.navigate('Recommendation', {	patient: this.props.patient });
	}

	_read = (event) => {
		console.log ("READ");
		const {patient, hospital, baseDataSync} = this.props.parent.state;
		this.props.parent.props.navigation.navigate('EventDetail', {
			event: event,
			patient: patient,
			hospital: hospital,
			baseDataSync: baseDataSync,
		});
	}

	_delete = (event) => {
		console.log('DELETE');
		this._read(event); // NÃO ESTÁ RESPONDENDO AO PRESS SEM SER LONG
	}

	_renderEvent = (event) => {
		const renderHighCost = (event.typeEnum === TimelineEventEnum.ExamRequest && event.data.examHighCost);
		return (
			<TouchableWithoutFeedback onPress={()=>this._read(event)} onLongPress={()=>this._delete(event)}>
				<View style={styles.description}>
					<Text style={styles.title}>{event.name}</Text>
					{ renderHighCost && 
						<Text style={styles.highlight}>Alto Custo</Text>
					}
				</View>
			</TouchableWithoutFeedback>
		);
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

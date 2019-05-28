import React, { Component } from "react"
import styles from './style'
import { Container, Content, Header, Left, Right, Body, Icon, Title, Text } from 'native-base'
import { View, FlatList, TouchableOpacity, Image } from "react-native"
import moment from 'moment'
import _ from 'lodash'

export default class Patients extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			patients: [],
		}
	}

	willFocus = this.props.navigation.addListener('willFocus', (payload) => {
		let patients = []

		if(payload.state.params.hospital.hospitalizationList.length === 0) {
			alert("Desculpe, não foi possível exibir a lista de pacientes. Tente novamente mais tarde :|")
			this.props.navigation.navigate({ routeName: 'Hospitals' })
		} else {
			payload.state.params.hospital.hospitalizationList.forEach( patient => {
				if(!patient.externalPatient && (patient.exitDate === null || this.exitDateBelow24Hours(patient.exitDate)) ) {
					patient.totalDaysOfHospitalization = this.calculateDaysOfHospitalization(patient)
					patient.statusColorName = this.getStatusColorName(patient)
					patient.lastVisit = this.getLastVisit(patient)
					patient.logoStatusVisit = this.getStatusLogoVisit(patient)
					patients.push(patient)
				}
			});
			console.log('Patients => ', patients )
			this.setState({patients})
		}
	})
	
	exitDateBelow24Hours(date) {
		const today = moment()
		let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
		let total = today.diff(dateFormatted, 'days')
		return total < 3 ? true : false
	}

	calculateDaysOfHospitalization(patient) {
		const today = moment()
		let admissionDate = moment(moment(patient.admissionDate).format('YYYY-MM-DD'))
		let totalHospitalizationDays = today.diff(admissionDate, 'days')
		return totalHospitalizationDays;
	}

	getStatusColorName(patient) {
		if(patient.locationType === 'UTI' || patient.locationType === 'CTI') {
			return 'red'
		} else if(patient.locationType === 'SEMI') {
			return 'yellow'
		} else {
			return 'black'
		}
	}

	getLastVisit(patient) {
		let listOfOrderedPatientVisits = _.orderBy(patient.trackingList, ['endDate'], ['desc'])
		if(patient.trackingList.length === 0 || listOfOrderedPatientVisits[0].endDate === null) {
			return 'SEM VISITAS'
		} else if(this.isToday(listOfOrderedPatientVisits[0].endDate)) {
			return 'HOJE'
		} else if(this.isYesterday(listOfOrderedPatientVisits[0].endDate)) {
			return 'ONTEM'
		} else {
			return this.totalDaysAgo(listOfOrderedPatientVisits[0].endDate)
		}
	}

	isToday(date) {
		const today = moment()
		let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
		let diffDays = today.diff(dateFormatted, 'days')
		return diffDays === 0 ? true : false
	}

	isYesterday(date) {
		const yesterday = moment().subtract(1, 'day');
		let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
		let diffDays = yesterday.diff(dateFormatted, 'days')
		return diffDays === 0 ? true : false
	}

	totalDaysAgo(date) {
		const today = moment()
		let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
		return today.diff(dateFormatted, 'days') + ' Dias'
	}

	exitDateIsEqualToLastVisit(patient) {
		const exitDate = moment(patient.exitDate)
		let listOfOrderedPatientVisits = _.orderBy(patient.trackingList, ['endDate'], ['desc'])
		let dateLastVisitFormatted = moment(moment(listOfOrderedPatientVisits[0].endDate).format('YYYY-MM-DD'))
		let diffDays = exitDate.diff(dateLastVisitFormatted, 'days')
		//return diffDays === 0 ? true : false
		diffDays === 0 ? console.log("Data de alta e ultima visita sao iguais") : console.log("Data de alta e ultima visita NAO sao iguais")
		return true
	}

	getStatusLogoVisit(patient) {
		let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
		if(patient.lastVisit !== 'HOJE' && listOfOrderedPatientObservations.length > 0 && !listOfOrderedPatientObservations[0].alert) {
			return require('../../images/ic_home_blue.png')
		} else if(patient.lastVisit !== 'HOJE' && listOfOrderedPatientObservations.length > 0 && listOfOrderedPatientObservations[0].alert) {
			return require('../../images/ic_home_red.png')
		} else if(patient.lastVisit !== 'HOJE' && listOfOrderedPatientObservations.length > 0 && listOfOrderedPatientObservations[0].endTranking) {
			return require('../../images/ic_home_orange.png')
		} else if(patient.lastVisit === 'HOJE' && listOfOrderedPatientObservations.length > 0 && !listOfOrderedPatientObservations[0].endTranking) {
			return require('../../images/ic_home_green.png')
		} else if(patient.lastVisit === 'HOJE' && listOfOrderedPatientObservations.length > 0 && listOfOrderedPatientObservations[0].endTranking) {
			return require('../../images/ic_home_black.png')
		} else if( (patient.exitDate !== null || patient.death) && this.exitDateIsEqualToLastVisit(patient)) {
			return require('../../images/ic_home_grey.png')
		}
	}

	renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => { this.props.navigation.navigate("PatientDetail", { hospital: this.props.navigation.getParam('hospital', null) }); }}>
			<View style={[styles.productContainer]}>
				<View>
					<Text style={[styles.patientTitle, {color: `${item.statusColorName}`} ]}> {item.patientName} </Text>
					<Text style={styles.hospitalizationDescription}> INTERNADO: {item.totalDaysOfHospitalization} Dias | SETOR: {item.locationSession} | LEITO: {item.locationBed} </Text>  
					<Text style={styles.lastVisit}> Última visita: {item.lastVisit} </Text>
				</View>
				<View >
					<Image source={item.logoStatusVisit} style={{width: 25, height: 25}} />
				</View>
			</View>
		</TouchableOpacity>
	);

	render(){
		return (
			<Container>
				<Header style={styles.headerMenu}>
					<Left style={{flex:1}} >
						<Icon name="md-menu" style={{ color: 'white' }} onPress={() => this.props.navigation.openDrawer() } />
					</Left>
					<Body style={{flex: 1, alignItems: 'center', alignSelf: 'center'}}>
						<Title>{this.props.navigation.getParam('hospital', null).name}</Title>
					</Body>
					<Right style={{flex: 1}} />
				</Header> 
				<Content>
					<View style={styles.container}>
						<FlatList
							contentContainerStyle={styles.list}
							data={this.state.patients}
							keyExtractor={item => `${item.id}`}
							renderItem={this.renderItem}
							onEndReached={this.loadMore}
							onEndReachedThreshold={0.1}
						/>
					</View>
				</Content>
			</Container>
		);
	}
}
import React, { Component } from "react";

import api from '../../services/api';

import { Container, Content, Header, Left, Right, Body, Icon, Title, Text, Thumbnail } from 'native-base';

import { View, FlatList, TouchableOpacity, Image } from "react-native";

import AsyncStorage from '@react-native-community/async-storage';

import styles from './style'

import moment from 'moment';

export default class Hospital extends Component {

	constructor(props) {
		super(props);
		this.state = {
			infos: {},
			hospitals: [],
			page: 1,
		}
	}
	
	componentDidMount() {
		this.loadHospitals();
	}

	loadHospitals = async (page = 1) => {
		try{
			let userData = JSON.parse(await AsyncStorage.getItem('userData'));
			
			console.log("userData => ", userData)
			let data = {"hospitalizationList":[]}

			api.post('/api/v2.0/sync', data, {
				headers: {
					"Content-Type": "application/json",
				  	"Accept": "application/json",
				  	"Token": userData.token, 
				}
			}).then(response => {
				if(response.status === 200) {
					let listHospital = []
					console.log("INFO: ", response.data.content.hospitalList)
					response.data.content.hospitalList.forEach( hospital => {
						if(this.isTheSameHospital(hospital, userData)){
							listHospital.push(hospital)
						}
					})

					this.setState({
						hospitals: [ ...listHospital], 
					});

					this.getInformationHospital()
				} else {
					console.log("Status [ " +response.status+"] ocorreu um problema ao listar hospitais.")
				}
			}).catch(error => {
				console.log("error=> ", error)
			});
        } catch(error) {
            console.log(error);
        }        		
	};

	isTheSameHospital = (hospital, userData) =>  {
		let hasHospitality = false
		userData.hospitals.forEach(element => {
			if(hospital.id === element.id) {
				hasHospitality = true
			}
		})

		return hasHospitality
	}

	getInformationHospital = () => {
		this.state.hospitals.forEach( hospital => {	
			hospital.logomarca = this.getLogomarca(hospital)
			hospital.totalPatientsVisitedToday = this.countTotalPatientsVisited(hospital.hospitalizationList)
			hospital.totalPatients = this.countTotalPatients(hospital.hospitalizationList)
			this.setLastVisit(hospital.hospitalizationList)
		}); 
	}

	getLogomarca(hospital) {
		if(hospital.id === 4) {
			return require('../../images/logo_hospital/copaDor.png');
		} else if(hospital.id === 5) {
			return require('../../images/logo_hospital/niteroiDor.png');
        }  else if(hospital.id === 7) {
			return require('../../images/logo_hospital/oesteDor.png');
        }  else if(hospital.id === 2) {
			return require('../../images/logo_hospital/barraDor.png');
        }  else if(hospital.id === 9) {
			return require('../../images/logo_hospital/riosDor.png');
        }  else if(hospital.id === 101) {
			return require('../../images/logo_hospital/badim.png');
        }  else if(hospital.id === 6) {
			return require('../../images/logo_hospital/norteDor.png');
        }  else if(hospital.id === 3) {
			return require('../../images/logo_hospital/caxiasDor.png');
        }  else if(hospital.id === 8) {
			return require('../../images/logo_hospital/quintaDor.png');
		} 
		
		return require('../../images/logo_hospital/redeDor.png');
	}

	countTotalPatientsVisited = patients => {
		let totalPatientsVisited = patients.reduce((patientsVisited, patient) => {
			
			if(patient.exitDate === null) {
				let attendanceToday = this.hasAttendanceToday(patient)
				if(attendanceToday) {
					return patientsVisited + 1
				} else {
					return patientsVisited
				}
			} else {
				return patientsVisited;
			}
		}, 0);
		return totalPatientsVisited;
	}	

	countTotalPatients = patients => {
		let totalPatients = patients.reduce((totalPatients, patient) => {
			
			if(patient.exitDate === null) {
				return totalPatients + 1;
			} else {
				return totalPatients;
			}
		}, 0);
		return totalPatients;
	}

	setLastVisit = patients => {

		patients.forEach(patient => {
			let lastVisit;
			patient.trackingList.forEach( item =>{
				if(item.endDate != null) {
					if(lastVisit == null) {
						lastVisit = new Date(item.endDate)
					} else {
						let visit = new Date(item.endDate)
						if(lastVisit < visit){
							lastVisit = visit
						}
					}
				}
			})
			patient.lastVisit = lastVisit
			console.log("Ultima visita de ", patient.patientName, " foi em ", patient.lastVisit)
		})
	
	}

	hasAttendanceToday(patient) {
		const today = moment().format('YYYY-MM-DD');
		let hasAttendance = patient.trackingList.find(visit => {
			let visitDate = moment(visit.startDate).format('YYYY-MM-DD')
			return visitDate === today
		});
		return hasAttendance 
	}
	
	loadMore = () => {
		const { page, infos } = this.state;
		if (page === 1) return;
		const pageNumber = page + 1;
		this.loadHospitals(pageNumber);
	}

	renderItem = ({ item }) => (
		
		<TouchableOpacity
			onPress={() => {
				this.props.navigation.navigate("Patients", { hospital: item });
			}}>
			
			<View style={[styles.container, {alignItems: 'center' }]}>
				<View>
					<Image source={item.logomarca} style={styles.hospitalIcon}  />
				</View>
				<View style={{flexDirection: "column", width: '53%'}}>
					<View>
						<Text style={[styles.title, styles.niceBlue]}> 
							{item.name} | 
							<Text style={[styles.description, styles.niceBlue]}> {item.lastVisit}</Text>
						</Text>
					</View>

					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="calendar" style={styles.calendarIcon} />
						<Text style={[styles.description]}>Internados: {item.totalPatients}</Text>
					</View>
					
					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="user" style={styles.userIcon}/>
						<Text style={[styles.description]}>Pendentes: {item.totalPatientsVisitedToday}</Text>
					</View>
				</View>
				<View style={[styles.sideButtonRight]}>
					<Icon type="AntDesign" name="right" style={{ color: 'white', fontSize: 20}} />
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
					<Body style={{flex: 1, alignItems: 'center',alignSelf: 'center'}}>
						<Title> Hospitais </Title>
					</Body>
					<Right style={{flex: 1}} />
				</Header>

				<Content>
					<View style={styles.container}>
						<FlatList
							contentContainerStyle={styles.list}
							data={this.state.hospitals}
							keyExtractor={item => item.id + '_'}
							renderItem={this.renderItem}
							onEndReached={this.loadMore}
							onEndReachedThreshold={0.1} />
					</View>
				</Content>
			</Container>
		);
	}
}
import React, { Component } from "react";

import api from '../../services/api';

import { Container, Content, Header, Left, Right, Body, Icon, Title, Text, Thumbnail } from 'native-base';

import { View, FlatList, TouchableOpacity, Image } from "react-native";

import AsyncStorage from '@react-native-community/async-storage';

import Spinner from 'react-native-loading-spinner-overlay';

import styles from './style'

import moment from 'moment';

export default class Hospital extends Component {

	constructor(props) {
		
		super(props);

		this.state = {
			infos: {},
			baseDataSync: {},
			hospitals: [],
			page: 1,
			loading: false
		}

		this.state.baseDataSync = this.props.navigation.getParam('baseDataSync');

		console.log(this.state.baseDataSync);

		console.log(this.props.navigation);
	}
	
	componentDidMount() {

		this.setState({ textContent: 'Carregando informações...' });

		this.setState({loading: true});

		this.loadHospitals();
	}

	loadHospitals = async (page = 1) => {
		
		try {

			AsyncStorage.getItem('userData', (err, res) => {
			
	            console.log(res);

	            let parse = JSON.parse(res);

	            let token = parse.token;
			
				let data = { "hospitalizationList": [] };
				
				api.post('/api/v2.0/sync', data, {
					headers: {
						"Content-Type": "application/json",
					  	"Accept": "application/json",
					  	"Token": token, 
					}
				}).then(response => {

					console.log(response);

					this.setState({loading: false});

					if(response.status === 200) {

						let listHospital = []
						
						response.data.content.hospitalList.forEach( hospital => {

							console.log(parse);

							if(this.isTheSameHospital(hospital, parse)){
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

					this.setState({loading: false});

					console.log("error=> ", error)
				});
			});

        } catch(error) {

        	this.setState({loading: false});

            console.log(error);
        }        		
	};

	isTheSameHospital = (hospital, userData) =>  {

		console.log(hospital, userData);

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
			hospital.lastVisit = this.setLastVisit(hospital.hospitalizationList)
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
		let lastVisit = null;
		patients.forEach(patient => {
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
		})
		
		return lastVisit != null ? moment(lastVisit).format('DD/MM/YYYY') : 'Sem visita'
	}

	hasAttendanceToday(patient) {
		const today = moment().format('YYYY-MM-DD');
		let hasAttendance = patient.trackingList.find(visit => {
			let visitDate = moment(visit.startDate).format('YYYY-MM-DD')
			return visitDate === today
		});
		return hasAttendance 
	}

	sincronizar = () => {
		console.log('ROTINA SINCRONIZAR');
	}

	renderItem = ({ item }) => (
		
		<TouchableOpacity
			onPress={() => {
				console.log(item);
				this.props.navigation.navigate("Patients", { hospital: item, baseDataSync: this.state.baseDataSync });
			}}>
			
			<View style={[styles.container, {alignItems: 'center'}]}>
				<View>
					<Image source={item.logomarca} style={styles.hospitalIcon}  />
				</View>
				<View style={{flexDirection: "column", width: '53%'}}>
					<View>
						<Text style={[styles.title, styles.niceBlue]}> 	{item.name}  </Text>
					</View>

					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="calendar" style={styles.calendarIcon} />
						<Text style={[styles.description]}>Última Visita: {item.lastVisit}</Text>
					</View>

					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="book" style={styles.calendarIcon} />
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

				<Spinner
		            visible={this.state.loading}
		            textContent={this.state.textContent}
		            textStyle={styles.spinnerTextStyle} />

				<Header style={styles.headerMenu}>
					<Left style={{flex:1}} >
						<Icon name="md-menu" style={{ color: 'white' }} onPress={() => this.props.navigation.openDrawer() } />
					</Left>
					<Body style={{flex:8, alignItems: 'stretch'}}>	
						<Title> Hospitais </Title>
					</Body>
				</Header>

				<Content>
					<View style={styles.container}>
						<FlatList
							contentContainerStyle={styles.list}
							data={this.state.hospitals}
							keyExtractor={item => item.id + '_'}
							renderItem={this.renderItem}
							onEndReached={this.sincronizar}
							onEndReachedThreshold={0.1} />
					</View>
				</Content>
			</Container>
		);
	}
}
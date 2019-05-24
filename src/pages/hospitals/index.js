import React, { Component } from "react";

import api from '../../services/api';

import { Container, Content, Header, Left, Right, Body, Icon, Title, Text, Thumbnail } from 'native-base';

import { View, FlatList, TouchableOpacity } from "react-native";

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

	displayData = async () => {
        try{
            let userData = await AsyncStorage.getItem('userData');
			const data = JSON.parse(userData);
            console.log("userData Hospitals: ", data.hospitals);
        } catch(error) {
            console.log(error);
        }                   
    }
	
	componentDidMount() {
		this.loadHospitals();
	}

	getTotalPatientsVisited() {
    	this.state.hospitals.forEach( hospital => {
			hospital.totalPatientsVisitedToday = this.countTotalPatientsVisited(hospital.hospitalizationList)
			hospital.totalPatients = this.countTotalPatients(hospital.hospitalizationList)
			hospital.logomarca = this.getLogomarca(hospital)
		});
		console.log(this.state.hospitals)
	}

	getLogomarca(hospital) {
        if(hospital.id === 61) {
            return 'https://rededor.wpengine.com/wp-content/uploads/sites/27/2018/12/Logo-Real.svg'
        } else if(hospital.id === 41) {
            return 'https://wallpaperplay.com/walls/full/1/6/3/329998.jpg'
        } else if(hospital.id === 21) {
            return 'https://wallpaperplay.com/walls/full/1/6/3/329998.jpg'
        } else if(hospital.id === 4) {
            return 'https://rededor.wpengine.com/wp-content/uploads/sites/15/2018/12/Logo-CopaDOr.svg'
        }  else if(hospital.id === 5) {
            return 'http://www.copador.com.br/images/logo/niteroiDor_logo.png'
        }  else if(hospital.id === 1) {
            return 'https://wallpaperplay.com/walls/full/1/6/3/329998.jpg'
        }  else if(hospital.id === 7) {
            return 'http://www.copador.com.br/images/logo/oesteDor_logo.png'
        }  else if(hospital.id === 2) {
            return 'http://www.copador.com.br/images/logo/barraDor_logo.png'
        }  else if(hospital.id === 9) {
            return 'http://www.copador.com.br/images/logo/riosDor_logo.png'
        }  else if(hospital.id === 101) {
            return 'http://www.copador.com.br/images/logo/badim_logo.png'
        }  else if(hospital.id === 6) {
            return 'http://www.copador.com.br/images/logo/norteDor_logo.png'
        }  else if(hospital.id === 3) {
            return 'http://www.copador.com.br/images/logo/caxiasDor_logo.png'
        }  else if(hospital.id === 8) {
            return 'http://www.copador.com.br/images/logo/quintaDor_logo.png'
        } 
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

	hasAttendanceToday(patient) {
		const today = moment().format('YYYY-MM-DD');
		let hasAttendance = patient.trackingList.find(visit => {
			let visitDate = moment(visit.startDate).format('YYYY-MM-DD')
			return visitDate === today
		});
		return hasAttendance 
	}
	
	loadHospitals = async (page = 1) => {
		try{
            let userData = JSON.parse(await AsyncStorage.getItem('userData'));
			let data = {"hospitalizationList":[]}

			api.post('/api/v2.0/sync', data, {
				headers: {
					"Content-Type": "application/json",
				  	"Accept": "application/json",
				  	"Token": userData.token,
				}
			}).then(response => {
				if(response.status === 200) {
					this.setState({
						hospitals: [ ...this.state.hospitals, ...response.data.content.hospitalList], 
					});
					this.getTotalPatientsVisited()
					//this.calculateTotalPatientsInterned()
					//chamar metodo que seta total de pacientes internados
					//chamar metodo que seta total de pacientes sem visitas
					//chamar metodo que seta data da ultima visita
				} else {
					alert("Status != 200")
				}
			}).catch(error => {
				console.log("error=> ", error)
			});
        } catch(error) {
            console.log(error);
        }        		
	};

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
					<Thumbnail square large source={{uri: item.logomarca}} style={styles.hospitalIcon} />
				</View>
				<View style={{flexDirection: "column", width: '53%'}}>
					<View>
						<Text style={[styles.title, styles.niceBlue]}> 
							{item.name} | 
							<Text style={[styles.description, styles.niceBlue]}> {item.date}</Text>
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
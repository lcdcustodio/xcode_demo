import React, { Component } from "react";
import api from '../../services/api';
import { Container, Content, Header, Left, Right, Body, Icon, Title, Text, Thumbnail } from 'native-base';
import { Alert, View, FlatList, TouchableOpacity, Image, BackHandler } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './style'
import Line from '../../components/Line'
import Timer from '../../components/Timer'
import moment from 'moment';
import Session from '../../Session';
import qs from "qs";
import _ from 'lodash'

export default class Hospital extends Component {

	constructor(props) {
		
		super(props);

		this.state = {
			infos: {},
			hospitals: null,
			isConnected: null,
			dateSync: null,
			page: 1,
			loading: false,
			errorSync: 0
		}
	}

	componentDidMount() {
		console.log('back press');
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		console.log('go back');
		this.props.navigation.navigate('Hospitals');
		return true;
	}
	
	didFocus = this.props.navigation.addListener('didFocus', (payload) => {

        this.setState({errorSync: 0});

        this.setState({user: Session.current.user});

		NetInfo.fetch().then(state => {

			this.setState({isConnected: state.isConnected});

			if (this.state.hospitals == null) {
				this.sincronizar();
			}

		});

		AsyncStorage.getItem('dateSync', (err, dateSync) => {
            this.setState({dateSync: dateSync});
        });
	});

	loadHospitals = async () => {
		
		try {

			this.setState({ textContent: 'Carregando informações...' });

			this.setState({loading: true});

			AsyncStorage.getItem('userData', (err, res) => {

				if (res == null) 
				{
					this.setState({loading: false});

					this.props.navigation.navigate("SignIn");
				}
				else
				{				
		            let parse = JSON.parse(res);

		            if (Session.current.user == null) {
		            	Session.current.user = parse;
		            }

					console.log(Session.current.user);

		            let token = parse.token;
				
					let data = { "hospitalizationList": [] };
					
					api.post('/api/v2.0/sync', data, 
					{
						headers: {
							"Content-Type": "application/json",
						  	"Accept": "application/json",
						  	"Token": token, 
						}

					}).then(response => {

						console.log(response);

						this.setState({loading: false});

						if(response.status === 200) {

							let hospitalListOrdered = _.orderBy(response.data.content.hospitalList, ['name'], ['asc']);
							
							let user = Session.current.user;

							let listHospital = []
							
							if (user.profile == 'CONSULTANT') {

								hospitalListOrdered.forEach( hospital => {
									if(this.isTheSameHospital(hospital, parse)){
										listHospital.push(hospital)
									}
								});
							
							} 
							else
							{
								listHospital = hospitalListOrdered;
							}

							this.getInformationHospital(listHospital).then(response => {

								this.setState({loading: false});
								
								const dateSync = moment().format('DD/MM/YYYY [às] HH:mm:ss');

								this.setState({dateSync: dateSync});

								AsyncStorage.setItem('dateSync', dateSync);

								AsyncStorage.setItem('hospitalList', JSON.stringify(listHospital));						
							});
						
						} else {

							Alert.alert(
								'Erro ao carregar informações',
								'Desculpe, recebemos um erro inesperado do servidor, por favor, faça login e tente novamente! ',
								[
									{
										text: 'OK', onPress: () => {
											this.props.navigation.navigate("SignIn");
										}
									},
								],
								{
									cancelable: false
								},
							);

							console.log(response);
						}
					
					}).catch(error => {

						this.setState({loading: false});

						this.setState({errorSync: (this.state.errorSync + 1) });

						if (this.state.errorSync <= 3) {

							AsyncStorage.getItem('auth', (err, auth) => {

								console.log(auth);
						            
					            data = JSON.parse(auth);

					            data = qs.stringify(data, { encode: false });

								api.post('/api/login',
									data
								)
								.then(response => {

									let content = response.data.content;
																	
									if(response.data.success) {
										AsyncStorage.setItem('userData', JSON.stringify(content), () => {
											this.sincronizar(true);
										});
									}

									console.log(response);
								});
					        });
						}
						else
						{
							Alert.alert(
								'Erro ao carregar informações',
								'Desculpe, recebemos um erro inesperado do servidor, por favor, faça login e tente novamente! ',
								[
									{
										text: 'OK', onPress: () => {
											this.props.navigation.navigate("SignIn");
										}
									},
								],
								{
									cancelable: false
								},
							);
						}

						console.log(error);

					});

				}
			});

        } catch(error) {

        	this.setState({loading: false});

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

	getInformationHospital = async (listHospital) => {

		listHospital.forEach( hospital => {
			hospital.logomarca = this.getLogomarca(hospital)
			hospital.totalPatientsVisitedToday = this.countTotalPatientsVisited(hospital.hospitalizationList)
			hospital.totalPatients = this.countTotalPatients(hospital.hospitalizationList)
			hospital.lastVisit = this.setLastVisit(hospital.hospitalizationList)
		}); 

		this.setState({
			hospitals: [ ...listHospital], 
		});
	}

	getLogomarca(hospital) {

		if(hospital.id === 61) {
			return require('../../images/logo_hospital/rj/realDor.png');
		} else if(hospital.id === 4) {
			return require('../../images/logo_hospital/rj/copaDor.png');
        }  else if(hospital.id === 5) {
			return require('../../images/logo_hospital/rj/niteroiDor.png');
        }  else if(hospital.id === 1) {
			return require('../../images/logo_hospital/rj/bangu.png');
        }  else if(hospital.id === 7) {
			return require('../../images/logo_hospital/rj/oesteDor.png');
        }  else if(hospital.id === 2) {
			return require('../../images/logo_hospital/rj/barraDor.png');
        }  else if(hospital.id === 9) {
			return require('../../images/logo_hospital/rj/riosDor.png');
        }  else if(hospital.id === 101) {
			return require('../../images/logo_hospital/rj/badim.png');
        }  else if(hospital.id === 6) {
			return require('../../images/logo_hospital/rj/norteDor.png');
		} else if(hospital.id === 3) {
			return require('../../images/logo_hospital/rj/caxiasDor.png');
        }  else if(hospital.id === 8) {
			return require('../../images/logo_hospital/rj/quintaDor.png');
        }  

		
		return null;
	}

	countTotalPatientsVisited = patients => {

		let totalPatientsVisited = 0;

		const today = moment().format('YYYY-MM-DD');

		patients.forEach(patient => {

			let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

			if (

				(patient.exitDate == null && listOfOrderedPatientObservations.length > 0 && !listOfOrderedPatientObservations[0].endTracking) || 

            	(patient.exitDate != null && listOfOrderedPatientObservations.length > 0 && !listOfOrderedPatientObservations[0].medicalRelease)
					
			) {

				patient.observationList.forEach( item =>{

					let observationDate = moment(item.observationDate).format('YYYY-MM-DD');

					if(today == observationDate)
		            {
		            	totalPatientsVisited = totalPatientsVisited + 1;
		            }

				});

			}
		});

		return totalPatientsVisited;
	}	

	countTotalPatients = patients => {

		let totalPatients = patients.reduce((totalPatients, patient) => {

			let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

            if(
                (patient.exitDate == null && listOfOrderedPatientObservations.length == 0) || 

                (patient.exitDate == null && listOfOrderedPatientObservations.length > 0 && !listOfOrderedPatientObservations[0].endTracking) || 

                (patient.exitDate != null && listOfOrderedPatientObservations.length > 0 && !listOfOrderedPatientObservations[0].medicalRelease)
            )
            {
            	return totalPatients + 1;
            }
            else
            {
            	return totalPatients;
            }

		}, 0);

		return totalPatients;
	}

	setLastVisit = patients => {
		
		let lastVisit = null;
		
		patients.forEach(patient => {

			let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

			if (listOfOrderedPatientObservations.length > 0) {

				patient.observationList.forEach( item => {

					if (lastVisit != null) {

						let visit = new Date(item.observationDate);

						if(lastVisit < visit){
							lastVisit = visit;
						}
					}
					else
					{
						lastVisit = new Date(item.observationDate)
					}
				});
			}
		});

		if (lastVisit == null) {
			lastVisit = 'Sem visita';
		}
		else
		{
			let visit = new Date()

			var day = (visit.getDay() < 10 ? '0' : '') + visit.getDay();

			var month = ((visit.getMonth() + 1) < 10 ? '0' : '') + (visit.getMonth() + 1);

			lastVisit = day + "/" + month + "/" + visit.getFullYear();
		}
		
		return lastVisit;
	}

	loadHospitalsStorage = async () => {

		this.setState({loading: true});

		AsyncStorage.getItem('hospitalList', (err, res) => {

			if (res == null) {

				Alert.alert(
					'Erro ao carregar informações',
					'Desculpe, não foi possível prosseguir offline, é necessário uma primeira sincronização conectado a internet!',
					[
						{
							text: 'OK', onPress: () => {
								this.props.navigation.navigate("SignIn");
							}
						},
					],
					{
						cancelable: false
					},
				);
			} 
			else 
			{
				let hospitalList = JSON.parse(res);

				this.getInformationHospital(hospitalList);
			}

			this.setState({loading: false});
		});
	}

	sincronizar = async (fromServer) => {

		const { isConnected } = this.state;

		console.log('isConnected', isConnected);

		if (fromServer) {

			if (isConnected) 
			{
				this.loadHospitals();
			}
			else
			{
				Alert.alert(
					'Sem conexão com a internet',
					'Desculpe, não identificamos uma conexão estável com a internet!',
					[
						{
							text: 'OK', onPress: () => {
								console.log('OK Pressed');
							}
						},
					],
					{
						cancelable: false
					},
				);
			}
			
		}
		else
		{
			if (isConnected) {

				AsyncStorage.getItem('hospitalList', (err, res) => {

					if (res == null) {
						this.sincronizar(true);
					}
					else
					{
						this.loadHospitalsStorage();
					}
				});
			}
			else
			{
				this.loadHospitalsStorage();
			}
		}
	}

	renderImageOrName(item) {

		if ( item.logomarca ) {
			return <Image source={item.logomarca} style={[styles.hospitalIcon, {width: 140, height: 60 }]}/>;
		}
		else
		{
			return <Text style={[styles.niceBlue, {paddingLeft: 10}]}>{item.name}</Text>;
		}
	}

	renderItem = ({ item }) => (
		
		<TouchableOpacity
			onPress={() => {

				console.log(item);

				if(item.hospitalizationList.length === 0) {

					Alert.alert(
						item.name,
						'Não há pacientes neste hospital',
						[
							{
								text: 'OK', onPress: () => console.log('OK Pressed')
							},
						],
						{
							cancelable: false
						},
					);

				}
				else
				{
					AsyncStorage.setItem('hospital', JSON.stringify(item), () => {
						this.props.navigation.navigate("Patients");
					});
				}
			}}>
			
			<View style={[styles.container, {alignItems: 'center', textAlign: 'center'}]}>

				<View style={{width: '43%', alignItems: 'center', textAlign: "center", justifyContent: 'center'}}>
					{ this.renderImageOrName(item) }
				</View>
			
				<View style={{flexDirection: "column", width: '53%'}}>
					
					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="calendar" style={styles.calendarIcon} />
						<Text style={[styles.description, styles.niceBlue]}>Última Visita: </Text><Text style={[styles.description]}>{item.lastVisit}</Text>
					</View>

					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="book" style={styles.calendarIcon} />
						<Text style={[styles.description, styles.niceBlue]}>Internados: </Text><Text style={[styles.description]}>{item.totalPatients}</Text>
					</View>
					
					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="user" style={styles.userIcon}/>
						<Text style={[styles.description, styles.niceBlue]}>Visitas: </Text><Text style={[styles.description]}>{item.totalPatientsVisitedToday}</Text>
					</View>
				</View>
				<View style={[styles.sideButtonRight]}>
					<Icon type="AntDesign" name="right" style={{ color: 'white', fontSize: 20}} />
				</View> 
				
			</View>
			
		</TouchableOpacity>
	);

	renderTimer(){
		if(this.state.hospitals)
			return <Timer dateSync={this.state.dateSync}/>;
		return null;
	}

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
						<Title style={{color: 'white'}}>HOSPITAIS</Title>
					</Body>
					<Right style={{flex:1}} >
						<Icon name="sync" style={{ color: 'white' }} onPress={() => this.sincronizar(true) } />
					</Right>
				</Header>

				<View>
		            { this.renderTimer() }
		        </View>				

				<Line size={1} />

				<Content>
					<View style={styles.container}>

						<FlatList
							contentContainerStyle={styles.list}
							data={this.state.hospitals}
							keyExtractor={item => item.id + '_'}
							renderItem={this.renderItem} />
					</View>
				</Content>
			</Container>
		);
	}
}
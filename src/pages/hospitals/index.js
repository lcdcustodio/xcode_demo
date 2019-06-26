import React, { Component } from "react";
import api from '../../services/api';
import { Container, Content, Header, Left, Right, Body, Title, Text, Thumbnail, Card, CardItem } from 'native-base';

import { Alert, View, FlatList, TouchableOpacity, Image, BackHandler } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Spinner from 'react-native-loading-spinner-overlay';
import baseStyles from '../../styles'
import styles from './style'
import Line from '../../components/Line'
import Timer from '../../components/Timer'
import moment from 'moment';
import Session from '../../Session';
import qs from "qs";
import _ from 'lodash'
import { Searchbar, List } from 'react-native-paper';
import TextValue from '../../components/TextValue';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Icon as IconNativeBase} from 'native-base';

export default class Hospital extends Component {

	constructor(props) {
		
		super(props);

		this.state = {
			infos: {},
			hospitals: null,
			isConnected: null,
			dateSync: null,
			page: 1,
			isEditable: true,
			loading: false,
			timerTextColor: "#005cd1",
			timerBackgroundColor: "#fff",
			errorSync: 0,
			allPatients: [],
			patientsFiltered: [],
			patientQuery: null
		}

	}
	
	didFocus = this.props.navigation.addListener('didFocus', (payload) => {

        this.setState({errorSync: 0});

        this.setState({user: Session.current.user});

		NetInfo.fetch().then(state => {

			this.setState({isConnected: state.isConnected});

			this.setState({hospitals: null});

			this.sincronizar();

		});

		AsyncStorage.getItem('dateSync', (err, res) => {
			
			if (res !== null) {

				let today =  moment().format('DD/MM/YYYY');

				let dateSync = res.substring(0, 10);

				if (today > dateSync) {
					this.setState({ timerTextColor: "#721c24", timerBackgroundColor: "#f8d7da" });
				}				
			}

            this.setState({dateSync: res});
        });

		AsyncStorage.getItem('require_sync_at', (err, res) => {
			if (res != null) {
				this.setRequireSyncTimer(res);
			}
		});

		this.setState({
			patientQuery: null,
			patientsFiltered: []
		});

		BackHandler.removeEventListener ('hardwareBackPress', () => {});
        
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Hospitals');
            return true;
        });

	});

	loadHospitals = async () => {
		
		try {

			this.setState({ textContent: 'Carregando informações...' });

			this.setState({ loading: true });

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

		            this.state.token = parse.token;

		            AsyncStorage.getItem('hospitalizationList', (err, res) => {
						
						let obj = [];

						if(res != null){

							let hospitalizationList = JSON.parse(res);

							for (var i = 0; i < hospitalizationList.length; i++) {
								
								console.log(hospitalizationList[i]);

								let array = {};
								array['id'] = hospitalizationList[i].idPatient;
								array[hospitalizationList[i].key] = hospitalizationList[i].value;

								console.log(array);

								obj.push(array);
							}

						}

						let data = { "hospitalizationList": obj };

						console.log(data);
					
						api.post('/api/v2.0/sync', data, 
						{
							headers: {
								"Content-Type": "application/json",
							  	"Accept": "application/json",
							  	"Token": this.state.token, 
							}

						}).then(response => {

							this.setRequireSyncTimer(null);

							this.setState({loading: false});

							console.log(response);

							if(response.status === 200) {

								AsyncStorage.setItem('hospitalizationList', JSON.stringify([]));
								AsyncStorage.setItem('morbidityComorbityList', JSON.stringify(response.data.content.morbidityComorbityList));

								let hospitalListOrdered = _.orderBy(response.data.content.hospitalList, ['name'], ['asc']);
								
								let user = Session.current.user;

								let listHospital = [];
								
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

								this.props.navigation.navigate("SignIn");

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
			hospital.totalPatients = this.countTotalPatients(hospital.hospitalizationList, hospital)
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

	        let lastVisit = null;

			let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
        	
            if(
                (listOfOrderedPatientObservations.length > 0) && 

                (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
            )
            {
	            
	            const today = moment();
	            
	            lastVisit = moment(moment(listOfOrderedPatientObservations[0].observationDate).format('YYYY-MM-DD'));

	            lastVisit = today.diff(lastVisit, 'days');
	        }

			if (lastVisit == 0) {
				++totalPatientsVisited;
			}
		});

		return totalPatientsVisited;
	}	

	countTotalPatients = (patients, hospital) => {

		let listPatients = this.state.allPatients;

		let totalPatients = patients.reduce((totalPatients, patient) => {
			
			patient.hospitalName = hospital.name;
			patient.hospitalId = hospital.id;

			let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

            if(
                (listOfOrderedPatientObservations.length == 0) || 

                (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
            )
            {
				listPatients.push(patient);
            	return totalPatients + 1;
            }
            else
            {
            	return totalPatients;
            }

		}, 0);

		this.setState({ allPatients: listPatients });

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

			lastVisit = day + "/" + month + "/" + (visit.getYear() - 100);
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
			return <Image source={item.logomarca} style={{width: 140, height: 60 }}/>;
		}
		else
		{
			return <Text style={[styles.niceBlue, {paddingLeft: 10}]}>{item.name}</Text>;
		}
	}

	renderItem = ({ item }) => (
		
		<TouchableOpacity
			onPress={() => {

				if(item.totalPatients === 0) {

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
					this.props.navigation.navigate("Patients", {hospitalId: item.id});

					this.setState({
						patientQuery: null,
						patientsFiltered: []
					});
				}
			}}>
			
            <View style={{ width: '100%', paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: baseStyles.container.backgroundColor}}>
                
                <Card>

                    <View style={{alignItems: 'center', textAlign: "center", justifyContent: 'center', height: 80}}>
                    	{ this.renderImageOrName(item) }
                    </View>
                    
                    <CardItem footer bordered style={{ justifyContent: 'center', height: 40, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0}}>                            
                        
                        <View style={{ width: '8%'}}>
                            <Text style={{paddingLeft: 5}}><Icon name="briefcase-medical" style={{color: '#666', fontSize: 17}} /></Text>
                        </View>

                        <View style={{ width: '25%', justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> {item.lastVisit} </Text>
                        </View>
                        
                        <View style={{ width: '8%', justifyContent: 'center'}}>
                            <Text style={{paddingLeft: 5}}><Icon name="bed" style={{color: '#666', fontSize: 17}} /></Text>
                        </View>
                        
                        <View style={{ width: '25%', justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> {item.totalPatients} Internados </Text>
                        </View>
                        
                        <View style={{ width: '8%', justifyContent: 'center'}}>
                            <Text style={{paddingLeft: 5}}><Icon name="chalkboard-teacher" style={{color: '#666', fontSize: 17}} /></Text>
                        </View>
                        
                        <View style={{ width: '25%', justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> {item.totalPatientsVisitedToday} Visitados </Text>
                        </View>
                        
                    
                    </CardItem>
                </Card>
            </View>
			
		</TouchableOpacity>
	);

	setRequireSyncTimer(timer){

		console.log(timer);

		let today =  moment().format('YYYY-MM-DD');

		if (timer == null) 
		{
			AsyncStorage.removeItem('require_sync_at');

			this.setState({ timerTextColor: "#005cd1", timerBackgroundColor: "#fff" });
		}
		else
		{
			let require_sync_at = JSON.parse(timer);
			
			if (require_sync_at == today) {
				this.setState({ timerTextColor: "#856404", timerBackgroundColor: "#fff3cd" });
			}

			if (require_sync_at < today) {
				this.setState({ timerTextColor: "#721c24", timerBackgroundColor: "#f8d7da" });
			}
		}

	}

	renderTimer(){
		return <Timer dateSync={this.state.dateSync} timerTextColor={this.state.timerTextColor} timerBackgroundColor={this.state.timerBackgroundColor}/>;

	}

	filterPatients = (patientQuery) => {

		if(patientQuery !== '') {

			const patientsFilteredNew = this.state.allPatients.filter(item => {
				return (
					item.patientName.toUpperCase().includes(patientQuery.toUpperCase())
				)
			});

			console.log(patientsFilteredNew);
	
			this.setState({
				patientsFiltered: _.uniqBy(patientsFilteredNew, 'id'),
				patientQuery
			});

		} else {
			this.setState({ 
				patientsFiltered: [],
				patientQuery: null
			});
		}
	}

	renderItemPatient = (element) => {

		console.log(element.item.id, element.item.patientName);

		return (
			<TouchableOpacity onPress={() => {
				this.goToProfilePage(element.item) 
			}}>
				<List.Item title={`${element.item.patientName}`} />
				<TextValue color={'#999'} size={13} marginLeft={4} marginTop={-6} value={element.item.hospitalName} />
			</TouchableOpacity>
		);
	}

	goToProfilePage(patient) {

		this.setState({
			patientQuery: null,
			patientsFiltered: []
		});
		
		console.log(patient.hospitalId);
		console.log(patient.id);
		console.log(patient);
		console.log(this.state.isEditable);

		this.props.navigation.navigate("PatientDetail", { hospitalId: patient.hospitalId, patientId: patient.id, patient: patient, isEditable: this.state.isEditable});

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
						<IconNativeBase ios='ios-menu' android="md-menu" style={{color: '#FFF', fontSize: 40}} onPress={() => this.props.navigation.openDrawer() } />
					</Left>
					<Body style={{flex: 7}}>
						<Title style={{color: 'white'}}>Hospitais</Title>
					</Body>
					<Right style={{flex:1}} >
						<IconNativeBase name="sync" style={{color: '#FFF', fontSize: 30}} onPress={() => this.sincronizar(true) } />
					</Right>
				</Header>

				{ this.renderTimer() }			

				<Line size={1} />

				<Searchbar placeholder="Buscar paciente" onChangeText={patientQuery => { this.filterPatients(patientQuery) }} value={this.state.patientQuery} />
				
				<List.Section style={styles.listItemPatient}>
					<FlatList
						data={this.state.patientsFiltered}
						keyExtractor={element => `${element.id}`}
						renderItem={this.renderItemPatient} />
				</List.Section>
				
				<Line size={1} />

				<Content>
					<View style={styles.container}>

						<FlatList
							contentContainerStyle={baseStyles.container}
							data={this.state.hospitals}
							keyExtractor={item => item.id + '_'}
							renderItem={this.renderItem} />
					</View>
				</Content>
			</Container>
		);
	}
}

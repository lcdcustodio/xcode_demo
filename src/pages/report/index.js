import React, { Component } from 'react';
import api from '../../services/api';
import { Container, Content, Header, Left, Right, Body, Title, Text, Card, CardItem } from 'native-base';

import { Alert, View, FlatList, TouchableOpacity, Image, BackHandler } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Spinner from 'react-native-loading-spinner-overlay';
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
import { DataTable } from 'react-native-paper';
import { RdHeader } from '../../components/rededor-base';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

export default class Report extends Component {

	constructor(props) {	

		super(props);

		this.state = {
			infos: {},
			hospitals: null,
			isConnected: null,
			dateSync: null,
			page: 1,
			loading: false,
			isEditable: true,
			loading: false,
			timerTextColor: "#005cd1",
			timerBackgroundColor: "#fff",
			errorSync: 0,
			allPatients: [],
			patientsFiltered: [],
			hospital_report: [],
			patientQuery: null,
			ICON: {
                OLHO_CINZA_COM_CHECK: 3,
                OLHO_AZUL: 1,
                OLHO_CINZA_COM_EXCLAMACAO: 0,
                CASA_AZUL: 2
            }
		}
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

		BackHandler.removeEventListener ('hardwareBackPress', () => {});
        
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Hospitals');
            return true;
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

		            this.state.token = parse.token;
					
					AsyncStorage.getItem('hospitalizationList', (err, res) => {
						
						let obj = [];

						if (res != null) {

							let hospitalizationList = JSON.parse(res);

							for (var i = 0; i < hospitalizationList.length; i++) {

								if (hospitalizationList[i].value instanceof Array) {

									for (var key = 0; key < hospitalizationList[i].value.length; key++) {
										if (hospitalizationList[i].value[key].beginDate) {
											delete hospitalizationList[i].value[key]['beginDate'];
										}
									}
									
								}

								let array = {};
								array['id'] = hospitalizationList[i].idPatient;
								array[hospitalizationList[i].key] = hospitalizationList[i].value;

								obj.push(array);
							}
						}

						let data = { "hospitalizationList": [] };

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

								this.report(listHospital);
							
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

	getIconNumber(patient) {

        let lastVisit = null;

        let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
        
        if (listOfOrderedPatientObservations.length > 0) {
            
            const today = moment();
            
            lastVisit = moment(moment(listOfOrderedPatientObservations[0].observationDate).format('YYYY-MM-DD'));

            lastVisit = today.diff(lastVisit, 'days');
        }

        if(patient.observationList.length > 0 && listOfOrderedPatientObservations[0].alert) // TEVE VISITA E COM ALERTA
        {
            return this.state.ICON.OLHO_CINZA_COM_EXCLAMACAO;
        }
        else if(lastVisit == 0 && patient.exitDate == null) // VISITADO HOJE E NÃO TEVE ALTA
        {
            return this.state.ICON.OLHO_CINZA_COM_CHECK;
        }

        else if(lastVisit > 0 && patient.exitDate == null) // NÃO TEVE VISITA HOJE E NÃO TEVE ALTA
        {
            return this.state.ICON.OLHO_AZUL;
        }

        else if(patient.observationList.length == 0 && patient.exitDate == null) // NÃO TEVE VISITA E NÃO TEVE ALTA
        {
            return this.state.ICON.OLHO_AZUL;
        }

        else if (patient.exitDate != null) // TEVE ALTA
        {
            return this.state.ICON.CASA_AZUL;
        }
    }

	countTotalPatients = (patients, hospitalName) => {
		
		let totalPatients = patients.reduce((totalPatients, patient) => {
			
			let iconNumber = this.getIconNumber(patient);

			let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

			if (

                (listOfOrderedPatientObservations.length == 0) || 

                (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
            ) {

				if (iconNumber == this.state.ICON.OLHO_CINZA_COM_EXCLAMACAO ||
					iconNumber == this.state.ICON.OLHO_AZUL ||
					iconNumber == this.state.ICON.OLHO_CINZA_COM_CHECK) {
					console.log(patient.patientName, hospitalName, iconNumber);
					return totalPatients + 1;
				}
				else
				{
					return totalPatients;
				}
            }
            else
            {
            	return totalPatients;
            }

		}, 0);

		return totalPatients;
	}

	calculateDaysOfHospitalization = async (patient) => {

        const today = moment();

        let admissionDate = moment(moment(patient.admissionDate).format('YYYY-MM-DD'));

        let totalHospitalizationHours = today.diff(admissionDate, 'hours');

        totalHospitalizationHours = Math.round((totalHospitalizationHours / 24));

        return totalHospitalizationHours;
    }

	report = async (hospitalList) => {

		let report = {
			'hospital_report': [],
			'patients': 0,
			'attendanceType_emergency': 0,
			'attendanceType_elective': 0,
			'attendanceType_other': 0,
			'attendanceType_time_until_five': 0,
			'attendanceType_time_between_five_and_fortynine': 0,
			'attendanceType_time_other': 0,
			'locationType_room_ctiuti': 0,
			'locationType_room_usi': 0,
			'locationType_room_other': 0
		};

		for (var i = 0; i < hospitalList.length; i++) {

			let countTotalPatients = this.countTotalPatients(hospitalList[i].hospitalizationList, hospitalList[i].name);
			
			let obj = {
				name: hospitalList[i].name,
				length: hospitalList[i].hospitalizationList.length,
				patients: countTotalPatients
			};

			report.hospital_report.push(obj);

			report.patients += countTotalPatients;

			if (hospitalList[i].hospitalizationList.length > 0) {

				for (var x = 0; x < hospitalList[i].hospitalizationList.length; x++) 
				{
					let patient = hospitalList[i].hospitalizationList[x];

					let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

		            if(
		                (listOfOrderedPatientObservations.length == 0) || 

		                (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
		            )
		            {
						if (patient.attendanceType == "EMERGENCY") 
						{
							report.attendanceType_emergency += 1;
						}
						else if (patient.attendanceType == "ELECTIVE") 
						{
							report.attendanceType_elective += 1;
						}
						else 
						{
							report.attendanceType_other += 1;
						}

						if (patient.locationType == "CTI" || patient.locationType == "UTI") 
						{
							report.locationType_room_ctiuti += 1;
						}
						else if (patient.locationType == "USI") 
						{
							report.locationType_room_usi += 1;
						}
						else 
						{
							report.locationType_room_other += 1;
						}

						let days = await this.calculateDaysOfHospitalization(patient);

						if (days <= 5) 
						{
							report.attendanceType_time_until_five += 1;
						}
						else if (days > 5 && days <= 49) 
						{
							report.attendanceType_time_between_five_and_fortynine += 1;
						}
						else 
						{
							report.attendanceType_time_other += 1;
						}

					}
				}

			}
		}

		this.setState({hospital_report: report});

		console.log(this.state.hospital_report);
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
				this.report(JSON.parse(res));
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

	render() {

		return (

			<Container>

				<Spinner
		            visible={this.state.loading}
		            textContent={this.state.textContent}
		            textStyle={{color: '#FFF'}} />

				<Header style={{backgroundColor: "#005cd1"}}>
					<Left style={{flex:1}} >
						<IconNativeBase ios='ios-menu' android="md-menu" style={{color: '#FFF', fontSize: 40}} onPress={() => this.props.navigation.openDrawer() } />
					</Left>
					<Body style={{flex: 7}}>
						<Title style={{color: 'white'}}> Relatório Consolidado</Title>
					</Body>
					<Right style={{flex:1}} >
						<IconNativeBase name="sync" style={{color: '#FFF', fontSize: 30}} onPress={() => this.sincronizar(true) } />
					</Right>
				</Header>

				{ this.renderTimer() }			

				<Line size={1} />

				<Content style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, marginBottom: 20}}>
		        
		         <Card>
					
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Pacientes Internados</Text>
						</Left>
					</CardItem>

					<DataTable>
						
						{this.state.hospital_report.hospital_report && this.state.hospital_report.hospital_report.map((prop) => {
							return ( 
								<DataTable.Row key={prop.name} style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
									<DataTable.Cell style={{width: '90%'}}>{prop.name}</DataTable.Cell>
									<DataTable.Cell numeric style={{width: '10%'}}>{prop.patients}</DataTable.Cell>
								</DataTable.Row> 
							)
						})}

					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Tipo de Internação</Text>
						</Left>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Eletivo</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_elective}</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Urgência</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_emergency}</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Sem Informação</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_other}</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Tempo de Internação</Text>
						</Left>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Até 5 dias internado</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_time_until_five}</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Entre 5 e 49 dias internado</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_time_between_five_and_fortynine}</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Com 50 ou mais dias internado</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_time_other}</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Tipo Acomodação</Text>
						</Left>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>CTI/UTI</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.locationType_room_ctiuti}</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>USI</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.locationType_room_usi}</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Quarto/Enfermaria</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.locationType_room_other}</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				</Content>
			</Container>
		);
	}
}

	
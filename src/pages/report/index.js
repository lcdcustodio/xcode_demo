import React, { Component } from 'react';
import api from '../../services/api';
import { Container, Content, Text, Card, CardItem } from 'native-base';
import { Alert, View, BackHandler, Picker } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Spinner from 'react-native-loading-spinner-overlay';
import Line from '../../components/Line'
import Timer from '../../components/Timer'
import moment from 'moment';
import Session from '../../Session';
import qs from "qs";
import _ from 'lodash'
import { DataTable } from 'react-native-paper';
import { RdRootHeader } from '../../components/rededor-base';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import Patient from '../../model/Patient';

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
            },
            REGIONAL_RJ: [101, 1, 2, 3, 4, 5, 6, 7, 8, 61, 9, 41, 21],
			REGIONAL_SP: [],
			REGIONAL_PE: [142, 141, 143, 144],
			selectedRegionalHospital: '',
			hospitalList: null
		}

		this.setUser();
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {

        this.setState({errorSync: 0});

        this.setUser();

        this.setState({ timerTextColor: "#005cd1", timerBackgroundColor: "#fff" });

		NetInfo.fetch().then(state => {

			this.setState({isConnected: state.isConnected});

			this.setState({hospitals: null, filteredHospitals: null, selectedRegionalHospital: ''});

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
						
						console.log(res);

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

							if (response == undefined) {

								Alert.alert(
									'Erro ao carregar informações',
									'Desculpe, recebemos um erro inesperado do servidor, por favor, faça login e tente novamente! [REF 001]',
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

									const dateSync = moment().format('DD/MM/YYYY [às] HH:mm:ss');

									this.setState({dateSync: dateSync});

									AsyncStorage.setItem('dateSync', dateSync);

									AsyncStorage.setItem('hospitalList', JSON.stringify(listHospital));

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

	countTotalPatients = (patients, hospitalName) => {
		
		let totalPatients = patients.reduce((totalPatients, patient) => {
			
			const patientClass = new Patient(patient);

			let iconNumber = patientClass.getIconNumber();

			let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

			if (

                (listOfOrderedPatientObservations.length == 0) || 

                (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
            ) {

				if (iconNumber == this.state.ICON.OLHO_CINZA_COM_EXCLAMACAO ||
					iconNumber == this.state.ICON.OLHO_AZUL ||
					iconNumber == this.state.ICON.OLHO_CINZA_COM_CHECK) {
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

    setRegional(hospitalId) {

		if (this.state.REGIONAL_RJ.includes(hospitalId)) {
			return 'RJ'
		}

		if (this.state.REGIONAL_SP.includes(hospitalId)) {
			return 'SP'
		}

		if (this.state.REGIONAL_PE.includes(hospitalId)) {
			return 'PE'
		}
	}

	filterHospitals(regionalHospital) {

		this.state.selectedRegionalHospital  = regionalHospital;
		
		this.report(this.state.hospitalList);
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
			'locationType_room_other': 0,
			'hospitalizationType_room_clinical': 0,
			'hospitalizationType_room_surgical': 0,
			'hospitalizationType_room_other': 0
		};

		for (var i = 0; i < hospitalList.length; i++) {

			if (this.state.selectedRegionalHospital != '' && this.state.selectedRegionalHospital != 'ALL' && this.setRegional(hospitalList[i].id) != this.state.selectedRegionalHospital) {
				continue;
			}

			let countTotalPatients = this.countTotalPatients(hospitalList[i].hospitalizationList, hospitalList[i].name);
			
			let agregationPlan = this.countTotalHospitalizationByPlan(hospitalList[i].hospitalizationList);
			
			let obj = {
				name: hospitalList[i].name,
				length: hospitalList[i].hospitalizationList.length,
				patients: countTotalPatients,
				agregationPlan
			};

			this.setState({[hospitalList[i].name]: false });

			report.hospital_report.push(obj);

			report.patients += countTotalPatients;

			if (hospitalList[i].hospitalizationList.length > 0) {

				for (var x = 0; x < hospitalList[i].hospitalizationList.length; x++) 
				{
					let patient = hospitalList[i].hospitalizationList[x];

					const patientClass = new Patient(patient);

					let iconNumber = patientClass.getIconNumber();

					let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);
					
					if (

		                (listOfOrderedPatientObservations.length == 0) || 

		                (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
		            ) 
		            {

						if (iconNumber == this.state.ICON.OLHO_CINZA_COM_EXCLAMACAO ||
							iconNumber == this.state.ICON.OLHO_AZUL ||
							iconNumber == this.state.ICON.OLHO_CINZA_COM_CHECK) {

				            if(
				                (listOfOrderedPatientObservations.length == 0) || 

				                (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
				            )
				            {

				            	if (patient.hospitalizationType == "CLINICAL") 
								{
									report.hospitalizationType_room_clinical += 1;
								}
								else if (patient.hospitalizationType == "SURGICAL") 
								{
									report.hospitalizationType_room_surgical += 1;
								}
								else 
								{
									report.hospitalizationType_room_other += 1;
								}

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
								else if (days > 5 && days <= 15)
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
			}
		}

		this.setState({hospital_report: report});

		this.setState({hospitalList: hospitalList});
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

	setUser() {
		AsyncStorage.getItem('userData', (err, res) => {
			if(res) {
				let parse = JSON.parse(res);
				Session.current.user = parse;
			}
		});	
	}

	renderFilterHospital() {
		if (Session.current.user && Session.current.user.profile !== 'CONSULTANT') {
			return (
				<Picker selectedValue={this.state.selectedRegionalHospital} mode="dropdown" onValueChange={regional => { this.filterHospitals(regional) }}> 
					<Picker.Item label="Todas as regionais" value="ALL" />
					<Picker.Item label="Rio de Janeiro" value="RJ" />
					<Picker.Item label="Pernambuco" value="PE" />
				</Picker>
			);
		}
	}

	patientIsValid(patient) {
		const patientClass = new Patient(patient);
		let iconNumber = patientClass.getIconNumber();
		let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

		if ( (listOfOrderedPatientObservations.length == 0) || (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease) ) {

			if (iconNumber == this.state.ICON.OLHO_CINZA_COM_EXCLAMACAO ||
				iconNumber == this.state.ICON.OLHO_AZUL ||
				iconNumber == this.state.ICON.OLHO_CINZA_COM_CHECK) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	hasPlan(plans, plan) {
		let result = false;
		plans.map(item => {
			if (item.plan === plan) {
				result = true;
			}
		});
		return result;
	}

	updatePlan(plans, plan) {
		plans.map(item => {
			if (item.plan === plan) {
				item.total += 1;
			}
		});
	}

	countTotalHospitalizationByPlan(patients) {
		let total = [];

		patients.map(patient => {
			if (this.patientIsValid(patient)) {
				if (this.hasPlan(total, patient.plane)) {
					this.updatePlan(total, patient.plane);
				} else {
					let hospitlization = {
						plan: patient.plane === "" ? 'Sem Informação' : patient.plane,
						total: 1
					}
					total.push(hospitlization);
				}
			}
		});

		return total;
	}

	toogle(item) {
		this.setState({
			[item.name]: !this.state[item.name]
		})
	}

	render() {

		return (

			<Container>

				<Spinner
		            visible={this.state.loading}
		            textContent={this.state.textContent}
		            textStyle={{color: '#FFF'}} />

				<RdRootHeader
					title='Relatório Consolidado'
					menu={ () => this.props.navigation.openDrawer() }
					sync={ () => this.sincronizar(true) }/>

				{ this.renderTimer() }			

				<Line size={1} />
				
				{ this.renderFilterHospital() }

				<Line size={1} />

				<Content style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, marginBottom: 20}}>
		        
		         <Card>
					
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<View>
							<Text>Pacientes Internados</Text>
						</View>
					</CardItem>

					<DataTable>
						{
							this.state.hospital_report.hospital_report && this.state.hospital_report.hospital_report.map((prop, index) => {
								let background = (index % 2) === 0 ? '#ffffff' : '#ededed';
								return ( 
									<DataTable.Row key={prop.name} style={{color:'blue', backgroundColor: `${background}`, minHeight: 32, paddingTop: '1.7%'}}>
										<View style={{flexDirection: 'row', width: '100%', flexWrap: 'wrap'}}>
											<View style={{alignItems: 'flex-start', width: '90%'}}>
												<DataTable.Cell onPress={ () => { this.toogle(prop) }}>{prop.name}</DataTable.Cell>
											</View>
											<View style={{alignItems: 'flex-end', width: '10%'}}>
												<DataTable.Cell>{prop.patients}</DataTable.Cell>
											</View>
											{
												this.state[prop.name] && prop.agregationPlan.length > 0 ?
													<View style={{alignItems: 'flex-start', marginLeft: '-5%', paddingLeft: '10%', paddingRight: '5%', marginTop: '1.8%' , width: '110%', backgroundColor: '#CCE5FF'}}>
														{
															prop.agregationPlan.map((item, index) => {
																return (
																	<View key={index} style={{flexDirection: 'row', width: '100%', minHeight: 32, borderBottomColor: 'white', borderBottomWidth: 1, marginBottom: 5 }}>
																		<View style={{width: '90%', alignItems: 'flex-start'}}>
																			<DataTable.Cell>{item.plan}</DataTable.Cell>
																		</View>
																		<View style={{width: '10%', alignItems: 'flex-end'}}>
																			<DataTable.Cell>{item.total}</DataTable.Cell>
																		</View>
																	</View>
																)
															})
														}
													</View>
												:
													null
											}
										</View>
									</DataTable.Row> 
								)
							})
						}

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Total</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.patients}</DataTable.Cell>
						</DataTable.Row>

					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<View>
							<Text>Caráter da internação</Text>
						</View>
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
						<View>
							<Text>Tipo da internação</Text>
						</View>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Clínico</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.hospitalizationType_room_clinical}</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Cirúrgico</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.hospitalizationType_room_surgical}</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Sem Informação</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.hospitalizationType_room_other}</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<View>
							<Text>Tempo de Internação</Text>
						</View>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Até 5 dias</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_time_until_five}</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Entre 5 e 15 dias</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_time_between_five_and_fortynine}</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Com mais de 15 dias</DataTable.Cell>
							<DataTable.Cell numeric>{this.state.hospital_report.attendanceType_time_other}</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<View>
							<Text>Tipo Acomodação</Text>
						</View>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>CTI</DataTable.Cell>
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

	
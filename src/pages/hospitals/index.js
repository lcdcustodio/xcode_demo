import React, { Component } from "react";
import { Container, Content, Text, Card, CardItem } from 'native-base';
import { Alert, View, FlatList, TouchableOpacity, Image, BackHandler, Picker, Platform, StyleSheet } from "react-native";
import { Searchbar, List } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import qs from "qs";
import _ from 'lodash';
import { RdRootHeader } from "../../components/rededor-base";
import api from '../../services/api';
import Line from '../../components/Line'
import Timer from '../../components/Timer'
import Session from '../../Session';
import TextValue from '../../components/TextValue';
import baseStyles from '../../styles';
import styles from './style';
import Patient from '../../model/Patient';
import RNPickerSelect, { inputIOS } from 'react-native-picker-select';

export default class Hospital extends Component {

	constructor(props) {
		
		super(props);

		this.state = {
			infos: {},
			hospitals: null,
			filteredHospitals: null,
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
			regions: [
				{
				  label: 'Rio de Janeiro',
				  value: 'RJ',
				},
				{
				  label: 'Pernambuco',
				  value: 'PE',
				},
			]
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
			
			res = JSON.parse(res);

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

	countTotalPatients = (patients, hospital) => {

		let listPatients = this.state.allPatients;
		
		let totalPatients = patients.reduce((totalPatients, patient) => {
			
			patient.hospitalName = hospital.name;

			patient.hospitalId = hospital.id;

			listPatients.push(patient);

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

		this.setState({ allPatients: listPatients });

		return totalPatients;
	}

	getPatient(id) {
		let patient = null;
		this.state.allPatients.map((item) => {
			if(item.id === id) {
				patient = item;
			}
		});
		return patient;
	}

	parseObject(json) {

		let parse = {};

		for (var i = 0; i < json.length; i++) {

			for (var attrname in json[i])
			{	
				if (parse.hasOwnProperty(json[i].id)) {
					
					if (attrname == 'id') continue;


					parse[json[i].id][attrname] = json[i][attrname];
				}
				else
				{
					parse[json[i].id] = json[i];
					parse.patient = this.getPatient(json[i].id);
				}
			}
		}
		
		var result = Object.keys(parse).map(function(key) {
			let aux = parse[key];

			if (!aux.hasOwnProperty('diagnosticHypothesisList')) {
				aux.diagnosticHypothesisList = null;
			}

			if (!aux.hasOwnProperty('secondaryCIDList')) {
				aux.secondaryCIDList = null;
			}

			if (!aux.hasOwnProperty('recommendationClinicalIndication')) {
				aux.recommendationClinicalIndication = parse.patient.recommendationClinicalIndication;
			}

			if (!aux.hasOwnProperty('recommendationMedicineReintegration')) {
				aux.recommendationMedicineReintegration = parse.patient.recommendationMedicineReintegration;
			}

			if (!aux.hasOwnProperty('recommendationWelcomeHomeIndication')) {
				aux.recommendationWelcomeHomeIndication = parse.patient.recommendationWelcomeHomeIndication;
			}

			if (aux.hasOwnProperty('patientHeight')) {
				if (aux.patientHeight != null) {
					aux.patientHeight = aux.patientHeight.toString().replace(',', '.');
				}
			}

			return aux;
		});


		return result;
	}

	loadHospitals = async () => {
		
		try {

			let conn = await NetInfo.fetch().then(state => {
				return state.isConnected;
			});
			
			if (!conn) {
				
				Alert.alert(
					'Sua conexão parece estar inativa',
					'Por favor verifique sua conexão e tente novamente',
					[
						{
							text: 'OK', onPress: () => {}
						},
					],
					{
						cancelable: false
					},
				);

				return false;
			}

			this.setState({ textContent: 'Carregando informações...' });

			this.setState({ loading: true });

			let timer = setTimeout(() => {

				if (this.state.loading) {

					this.setState({ loading: false });

					Alert.alert(
						'Servidor lento ou indisponível',
						'O servidor não retornou um resultado dentro do período de 2 minutos, por favor tente novamente ou entre em contato com o suporte',
						[
							{
								text: 'OK', onPress: () => {}
							},
						],
						{
							cancelable: false
						},
					);
					
				}

		    }, 120000);

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

		            this.state.token = Session.current.user.token;

		            AsyncStorage.getItem('hospitalizationList', (err, res) => {
										
						let obj = [];

						if (res != null) {

							let hospitalizationList = JSON.parse(res);

							for (var i = 0; i < hospitalizationList.length; i++) {

								let array = {};
								array['id'] = hospitalizationList[i].idPatient;
								array[hospitalizationList[i].key] = hospitalizationList[i].value;

								obj.push(array);
							}
						}

						let parseObj = this.parseObject(obj);

						let data = { "hospitalizationList": parseObj };
						
						api.post('/api/v2.0/sync', data, 
						{
							headers: {
								"Content-Type": "application/json",
							  	"Accept": "application/json",
							  	"Token": this.state.token, 
							}

						}).then(response => {

							clearTimeout(timer);

							this.setState({loading: false});

							if(response && response.status === 200) {

								this.setRequireSyncTimer(null);

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

									AsyncStorage.setItem('dateSync', JSON.stringify(dateSync));

									AsyncStorage.setItem('hospitalList', JSON.stringify(listHospital));						
								});
							
							} else {

								Alert.alert(
									'Erro ao carregar informações',
									response,
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
						
						}).catch(error => {

							clearTimeout(timer);

							this.setState({loading: false});

							Alert.alert(
								'Erro ao carregar informações',
								error.message,
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
						});

					});
				}
			});

        } catch(error) {

        	console.log(error);
        	
        	this.setState({loading: false});

			Alert.alert(
				'Erro ao carregar informações',
				error,
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
			hospital.regional = this.setRegional(hospital.id)
		}); 

		this.setState({
			hospitals: [ ...listHospital], 
			filteredHospitals: [ ...listHospital]
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
        } else if(hospital.id === 144) {
			return require('../../images/logo_hospital/pe/saoMarcos.png');
        } else if(hospital.id === 143) {
			return require('../../images/logo_hospital/pe/saoJose.png');
        } else if(hospital.id === 142) {
			return require('../../images/logo_hospital/pe/esperancaOlinda.png');
        } else if(hospital.id === 141) {
			return require('../../images/logo_hospital/pe/esperancaRecife.png');
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

	setLastVisit = patients => {
		
		let lastVisit = null;
		
		patients.forEach(patient => {

			let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

			if(
                (listOfOrderedPatientObservations.length > 0) && 

                (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
            )
            {

				patient.observationList.forEach( item => {

					if (lastVisit != null) {

						let visit = new Date(item.observationDate);

						if(lastVisit < visit){
							lastVisit = visit;
						}
					}
					else
					{
						if (item.observationDate != null) {

		            		lastVisit = moment(item.observationDate).format('YYYY-MM-DD');

		            		lastVisit = new Date(lastVisit);
						}

					}
				});
			}
		});

		if (lastVisit == null) {
			lastVisit = 'Sem visita';
		}
		else
		{
			let visit = lastVisit;

			var day = (visit.getDay() < 10 ? '0' : '') + visit.getDay();

			var month = ((visit.getMonth() + 1) < 10 ? '0' : '') + (visit.getMonth() + 1);

			lastVisit = day + "/" + month + "/" + (visit.getFullYear());
		}
		
		return lastVisit;
	}

	loadHospitalsStorage = async () => {

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
		});
	}

	sincronizar = async (fromServer) => {

		const { isConnected } = this.state;

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
							text: 'OK', onPress: () => {}
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
								text: 'OK', onPress: () => {}
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
                    
                    <CardItem footer bordered style={{ justifyContent: 'center', height: 50, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0}}>                            
                        
                        <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> Última visita </Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}> {item.lastVisit} </Text>
                        </View>
                        
                        <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> Internados </Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}> {item.totalPatients} </Text>
                        </View>
                        
                        <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> Visitados </Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}> {item.totalPatientsVisitedToday} </Text>
                        </View>
                        
                    
                    </CardItem>
                </Card>
            </View>
			
		</TouchableOpacity>
	);

	setRequireSyncTimer(timer){

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
	
		this.props.navigation.navigate("PatientDetail", { hospitalId: patient.hospitalId, patientId: patient.id, patient: patient, isEditable: this.state.isEditable});

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
		let hospitals = [];
		this.state.hospitals.map(item => {
			if (regionalHospital === 'ALL' || regionalHospital === item.regional) {
				hospitals.push(item)
			}
		});

		this.setState({
			selectedRegionalHospital: regionalHospital,
			filteredHospitals: hospitals
		})
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
		const pickerStyle = {
			inputIOS: {
				paddingTop: 15,
				paddingHorizontal: 10,
				paddingBottom: 15,
			},
			underline: { borderTopWidth: 0 }
		};

		if (Session.current.user && Session.current.user.profile !== 'CONSULTANT') {
			return (
				<RNPickerSelect
					items={this.state.regions}
					doneText="OK"
					InputAccessoryView={() => null}
					placeholder={{label: 'Todas as Regionais', value: 'ALL'}}
					onValueChange={regional => { this.filterHospitals(regional) }}
					value={this.state.selectedRegionalHospital}
					style={pickerStyle}
				/>
			);
		}
	}

	render(){
		return (
			<Container>

				<Spinner
		            visible={this.state.loading}
		            textContent={this.state.textContent}
		            textStyle={styles.spinnerTextStyle} />

				<RdRootHeader
					title='Hospitais'
					menu={ () => this.props.navigation.openDrawer() }
					sync={ () => this.sincronizar(true) }/>

				{ this.renderTimer() }			

				<Line size={1} />

				<Searchbar placeholder="Buscar paciente" onChangeText={patientQuery => { this.filterPatients(patientQuery) }} value={this.state.patientQuery} />
				
					<List.Section style={styles.listItemPatient}>
						<FlatList
							data={this.state.patientsFiltered}
							keyExtractor={element => `${element.id}`}
							renderItem={this.renderItemPatient} 
							keyboardShouldPersistTaps="always" /> 
					</List.Section>
				
				<Line size={1} />

				{ this.renderFilterHospital() }

				<Content>
					<View style={styles.container}>

						<FlatList
							contentContainerStyle={baseStyles.container}
							data={this.state.filteredHospitals}
							keyExtractor={item => item.id + '_'}
							renderItem={this.renderItem} />
					</View>
				</Content>
			</Container>
		);
	}
}	
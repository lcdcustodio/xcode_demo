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
			baseDataSync: {},
			hospitals: null,
			isConnected: null,
			dateSync: null,
			page: 1,
			loading: false,
			errorSync: 0
		}

		this.state.baseDataSync = this.props.navigation.getParam('baseDataSync');
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

		console.log(this.state.baseDataSync);

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

					console.log(res);
				
		            let parse = JSON.parse(res);

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

						this.setState({loading: false});

						if(response.status === 200) {

							let hospitalListOrdered = _.orderBy(response.data.content.hospitalList, ['name'], ['asc']);

							console.log(hospitalListOrdered);
							
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

						console.log(this.state.errorSync);

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
		
		return null;
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
		});
		
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
			return <Image source={item.logomarca} style={styles.hospitalIcon}  />;
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
					this.props.navigation.navigate("Patients", { hospital: item, baseDataSync: this.state.baseDataSync });
				}
			}}>
			
			<View style={[styles.container, {alignItems: 'center'}]}>

				<View style={{width: '43%'}}>
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
					<Body style={{flex:8, alignItems: 'stretch', color: 'white'}}>
						<Title>HOSPITAIS</Title>
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
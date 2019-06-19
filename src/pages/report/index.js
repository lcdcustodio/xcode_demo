import React, { Component } from 'react';
import api from '../../services/api';
import { Container, Content, Header, Left, Right, Body, Title, Text, Card, CardItem } from 'native-base';

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
import { Searchbar, List } from 'react-native-paper';
import TextValue from '../../components/TextValue';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
			isEditable: true,
			loading: false,
			timerTextColor: "#005cd1",
			timerBackgroundColor: "#fff",
			errorSync: 0,
			allPatients: [],
			patientsFiltered: [],
			patientQuery: null
		}

		console.log('Ok');

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

		AsyncStorage.getItem('require_sync_at', (err, res) => {

			console.log('require_sync_at', res);

			this.setRequireSyncTimer(res);
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

						this.setRequireSyncTimer(null);

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
			hospital.totalPatients = this.countTotalPatients(hospital.hospitalizationList, hospital)
			hospital.lastVisit = this.setLastVisit(hospital.hospitalizationList)
		}); 

		this.setState({
			hospitals: [ ...listHospital], 
		});
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
				{/* <RdHeader title='Relatório Consolidado' goBack={() => {console.log("BACK")}}/>  */}
					<Header style={styles.headerMenu}>
						<Left style={{flex:1}} >
							<Icon name="bars" style={{color: '#FFF', fontSize: 30}} onPress={() => this.props.navigation.openDrawer() } />
						</Left>
						<Body style={{flex: 7}}>
							<Title style={{color: 'white'}}> Relatório Consolidado</Title>
						</Body>
						<Right style={{flex:1}} >
							<Icon name="sync" style={{color: '#FFF', fontSize: 25}} onPress={() => this.sincronizar(true) } />
						</Right>
					</Header>

				{ this.renderTimer() }			

					<Line size={1} />

				<Content style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
		         <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Pacientes Internados</Text>
						</Left>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Bangu</DataTable.Cell>
							<DataTable.Cell numeric>1</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Barra D'or</DataTable.Cell>
							<DataTable.Cell numeric>3</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Caxias D'or</DataTable.Cell>
							<DataTable.Cell numeric>10</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Copa D'or</DataTable.Cell>
							<DataTable.Cell numeric>0</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Niterói D'or</DataTable.Cell>
							<DataTable.Cell numeric>3</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Norte D'or</DataTable.Cell>
							<DataTable.Cell numeric>5</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Oeste D'or</DataTable.Cell>
							<DataTable.Cell numeric>1</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Quinta D'or</DataTable.Cell>
							<DataTable.Cell numeric>9</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Rios D'or</DataTable.Cell>
							<DataTable.Cell numeric>4</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Real D'or</DataTable.Cell>
							<DataTable.Cell numeric>1</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#cfd7e4', minHeight: 20, height: 40}}>
							<DataTable.Cell>Total de Pacientes</DataTable.Cell>
							<DataTable.Cell numeric>30</DataTable.Cell>
						</DataTable.Row>
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
							<DataTable.Cell numeric>0</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Urgência</DataTable.Cell>
							<DataTable.Cell numeric>17</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Sem Informação</DataTable.Cell>
							<DataTable.Cell numeric>20</DataTable.Cell>
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
							<DataTable.Cell numeric>0</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Entre 5 e 49 dias internado</DataTable.Cell>
							<DataTable.Cell numeric>20</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Com 50 ou mais dias internado</DataTable.Cell>
							<DataTable.Cell numeric>2</DataTable.Cell>
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
							<DataTable.Cell numeric>10</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>USI</DataTable.Cell>
							<DataTable.Cell numeric>2</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Quarto/Enfermaria</DataTable.Cell>
							<DataTable.Cell numeric>25</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				</Content>
			</Container>
		);
	}
}

	
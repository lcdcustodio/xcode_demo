import React, { Component } from 'react';
import { Alert, StatusBar, Text, StyleSheet, ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import qs from "qs";

import Session from '../../Session';
import User from '../../model/User'
import api from '../../services/api';
import {Container, Logo, Input, ErrorMessage, Button, ButtonText} from './styles';

export default class SignIn extends Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			lastDateSync: '2010-01-10T18:46:19-0700',
			email: 'consult.radix',
			password: '*ru8u!uBus2A',
			error: '',
			textContent: '',
			loading: false
		}
	}

	handleEmailChange = (email) => {
		this.setState({ error: '' }, () => false);
		this.setState({ email });
	};

	handlePasswordChange = (password) => {
		this.setState({ error: '' }, () => false);
		this.setState({ password });
	};

	handleSignInPress = async () => {
		// let item = {"trackingList":[{"endDate":"2019-02-19T17:50:00+0000","startDate":"2019-02-18T17:40:00+0000","trackingId":6668,"hospitalizationId":6812,"startMode":"HOSPITALIZATIION_ENTRANCE","endMode":"ADMIN_DISCHARGE_EXIT"},{"endDate":"2019-05-28T01:10:00+0000","startDate":"2019-05-23T01:10:00+0000","trackingId":7264,"hospitalizationId":6812,"startMode":"HOSPITALIZATIION_ENTRANCE","endMode":"ADMIN_DISCHARGE_EXIT"},{"endDate":"2019-05-28T14:10:00+0000","startDate":"2019-05-28T03:10:00+0000","trackingId":7265,"hospitalizationId":6812,"startMode":"HOSPITALIZATIION_ENTRANCE","endMode":"ADMIN_DISCHARGE_EXIT"}],"recommendationClinicalIndication":null,"recommendationWelcomeHomeIndication":null,"recommendationMedicineReintegration":null,"previousHospitalizations":[],"id":6812,"patientName":"SHIRLEY AMBROSIO DE SOUZA","patientBornDate":"1984-11-23","patientHeight":1.8,"patientWeight":127,"admissionDate":"2019-02-18T17:40:00+0000","exitDate":null,"death":false,"barCode":"1102214","externalPatient":false,"medicalExitDate":"2019-02-19T17:14:00+0000","exitDescription":"ALTA MELHORADO","plane":"Saude Rio Enfermaria","agreement":"Bradesco Funcio","locationType":"NORMAL","locationSession":"UC","locationBed":"432UC","locationDateFrom":null,"attendanceType":"EMERGENCY","hospitalizationType":"CLINICAL","medicalRecordsNumber":"005526517","mainProcedureTUSSId":null,"mainProcedureTUSSDisplayName":null,"mainProcedureCRM":null,"diagnosticHypothesisList":[{"uuid":"23746E80-D3E8-4472-B681-AFA3F63BE8E9","cidDisplayName":"R073 - Outra dor torácica","cidId":8015,"beginDate":"2019-02-19T13:50:28+0000","endDate":null}],"secondaryCIDList":[],"observationList":[{"uuid":"A58C946B-E165-4B1D-9D02-B233269334D5","observationDate":"2019-02-19T13:57:43+0000","alert":false,"medicalRelease":false,"endTracking":false,"observation":"Em prontuário: paciente feminina, 34 anos, atendida primariamente na emergência do Copa D’Or com dor torácica . \nHipertensão arterial e História Familiar para Doença Coronária \nDor tipo C , com troponinas negativas . \n\nRefere sintomatologia há 02 meses e que a dor é em queimação e associada a plenitude pós prandial \n\nFez EDA recente que mostrou Doença de Refluxo Gastro Esofágico !!!\n\nEletrocardiograma normal \nEcocardiograma normal \n\nFará Eco estresse hoje \n\nObs: paciente entrou direto para a UCI, sem passar pela emergência do Quinta. Solicitei a Jessica ( internação) que passasse pela emergência para reavaliação antes de internar ","removedAt":null}],"examRequestList":[{"performedAt":"2019-02-19T15:23:00+0000","removedAt":null,"requestAt":"2019-02-19T15:23:00+0000","uuid":"3660e81f-6b88-4330-a70b-03d0f481542d","examId":3840,"examDisplayName":"40901076 - Ecodopplercardiograma com estresse farmacológico","examHighCost":true,"costEvaluation":null,"qualityEvaluation":null}],"furtherOpinionList":[],"medicalProceduresList":[{"performedAt":"2019-02-18T21:46:00+0000","removedAt":null,"uuid":"2346df6e-f761-450b-b2f2-48b4f5c58db9","tussDisplayName":"10104020 - ATENDIMENTO MEDICO DO INTENSIVISTA EM UTI GERAL OU PEDIATRICA (PLANTAO DE 12 HORAS - POR PACIENTE)","complication":false,"complicationDescription":null,"costEvaluation":null,"qualityEvaluation":null,"tussId":4357}],"medicineUsageList":[],"timeDependentMedicineUsageList":[],"morbidityComorbityList":[],"clinicalIndication":null,"medicineReintegration":null,"welcomeHomeIndication":null,"complementaryInfoHospitalizationAPI":{"id":2813,"hemoglobin":0,"isNotHemoglobin":false,"isNotSerumSodium":false,"serumSodium":0,"isPancreateColectomyHepatic":false,"isUrgentEmergHospitatization":false,"isHospitatizationFiveDays":false,"hospitalizationsInTwelveMonths":null,"isHighOncologicalServiceOrProcedure":false,"result":null},"lastLocalModification":null,"removedItemList":null,"totalDaysOfHospitalization":101,"statusColorName":"black","lastVisit":"2 Dias","logoStatusVisit":15}
		// this.props.navigation.navigate("PatientDetail", { patient: item })

		if (this.state.email.length === 0 || this.state.password.length === 0) {
			this.setState({ error: 'Por favor, preencha todos os campos' }, () => false);
		} else {
			this.setState({ textContent: 'Aguarde...' });
			this.setState({loading: true});
			const params = {
				username: this.state.email,
				password: this.state.password
			};
			const data = qs.stringify(params, { encode: false });
			api.post('/api/login',
				data
			)
			.then(response => {
				let content = response.data.content;
				Session.current.user = new User(content.name, content.profile);
				AsyncStorage.setItem('userData', JSON.stringify(content), () => {
		            if(response.data.success) {
						this.setState({ textContent: 'Sincronizando...' });
						api.get('/api/basedata/baseDataSync?lastDateSync=' + this.state.lastDateSync).then(res => {
							this.setState({loading: false});
							this.props.navigation.navigate("Hospitals", { baseDataSync: res.data.content.data });
						}).catch(err => {
							this.setState({loading: false});
						    console.log(err);

						});
					} else {
						console.log(response);
						this.setState({loading: false});
					}
		        });			
			}).catch(error => {
				this.setState({loading: false});
				console.log(error);
				if(error.response.status == 401) {
					this.setState({ error: 'Usuário e senha não coincidem' }, () => false);
				} else if(error.response.status == 500) {
					this.setState({ error: 'Falha na comunicação com o servidor de aplicação' }, () => false);
				}
			});
		}
	};

	render() {
		return (
			<ImageBackground source={require('../../images/doctor-background.png')} style={ styles.imgBackground }>
				<Container>
						<Spinner
							visible={this.state.loading}
							textContent={this.state.textContent}
							textStyle={styles.spinnerTextStyle} />
						<StatusBar hidden />
						<Logo source={require('../../images/logo-medico-consultor-branca.png')} resizeMode="contain" /> 
						<Text style={styles.titulo}>ACESSAR MÉDICO CONSULTOR</Text>
						<Input
							placeholder="Endereço de E-mail"
							value={this.state.email}
							onChangeText={this.handleEmailChange}
							autoCapitalize="none"
							autoCorrect={false}
              placeholderTextColor="#FFFFFF"
							textAlign="auto"
						/>
						<Input
							placeholder="Senha"
							value={this.state.password}
							onChangeText={this.handlePasswordChange}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry
							placeholderTextColor="#FFFFFF"
							textAlign="auto"
						/>
						{this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
						<Button onPress={this.handleSignInPress}>
							<ButtonText>ENTRAR</ButtonText>
						</Button>
				</Container>
			</ImageBackground>
		)
	}
}

const styles = StyleSheet.create({
	titulo: {
		color: "#FFF",
		fontSize: 18,
		fontStyle: "normal",
		lineHeight: 20,
		letterSpacing: 1.44,
		textAlign: "center",
		width: 300,
		height: 20,
	},
	imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1 
	},
	spinnerTextStyle: {
	    color: '#FFF'
	},
});

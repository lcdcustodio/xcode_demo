import React, { Component } from 'react';
import { Container, Content, ListItem, Text, Right, Body } from 'native-base';
import { Button, Card, TextInput, Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert, StyleSheet, View } from 'react-native';
import moment from 'moment';
import uuidv4 from'uuid/v4';
import _ from 'lodash'

import RecommendationCardToggle from '../../../components/RecommendationCardToggle';
import { RdIf, RdHeader } from '../../../components/rededor-base';
import TextValue from '../../../components/TextValue';
import FormItem from '../../../components/FormItem';
import Modal from '../../../components/Modal';
import data from '../../../../data.json';
import baseStyles from '../../../styles';

const PEDIATRIC_PATIENT = 'Pediátrica';
const GENERAL_PATIENT = 'Geral';
const SENIORS_PATIENT = 'Idoso';

export default class Finalize extends Component {

	constructor(props) {
		super(props);
		this.state = { 
			patient: null,
			cid: data.cid,
			specialty: data.specialty,
			modalExitCID: false,
			modalSpecialty: false,
			accordionComplementaryInfoHospitalizationAPI: false,
			accordionMorbidityComorbityList: false,
			accordionRecommendationWelcomeHomeIndication: false,
			accordionRecommendationMedicineReintegration: false,
			accordionRecommendationClinicalIndication: false,
			morbidityComorbityList: null
		};

		this.handleUpdatePatient = this.props.navigation.getParam('handleUpdatePatient');
	}

	didFocus = this.props.navigation.addListener('didFocus', async (payload) => {
		let hospitalId = payload.state.params.hospitalId;
		let patientId = payload.state.params.patientId;
		await this.getPatient(patientId, hospitalId);
		let patientStorage = this.state.patient;
		let morbidityComorbityStorage = await AsyncStorage.getItem('morbidityComorbityList');
		let morbidityComorbityList = JSON.parse(morbidityComorbityStorage);

		if (patientStorage) {
			//patientStorage.patientBornDate = '1948/04/13'
			//patientStorage.death = true;
			patientStorage.complementaryInfoHospitalizationAPI.isUrgentEmergHospitatization = patientStorage.attendanceType === 'EMERGENCY' ? true : false;
			patientStorage.complementaryInfoHospitalizationAPI.isNotHemoglobin = this.getStatusHemoglobin(patientStorage.complementaryInfoHospitalizationAPI.hemoglobin);
			patientStorage.complementaryInfoHospitalizationAPI.isNotSerumSodium = this.getStatusSodium(patientStorage.complementaryInfoHospitalizationAPI.serumSodium);
			patientStorage.complementaryInfoHospitalizationAPI.isHospitalizationMoreFiveDays = this.isHospitalizationMoreFiveDays(patientStorage);
			patientStorage.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths = this.getTotalHospitalizationLastTwelveMonth(patientStorage);
			patientStorage.complementaryInfoHospitalizationAPI.result = this.calculateRehospitalizationRisk(patientStorage);
			patientStorage.typePatient = this.getTypePatient(patientStorage.patientBornDate);
			patientStorage.brittlenessIndex = this.calculateBrittlenessIndex(patientStorage);
			patientStorage.labelAccordionMorbidityComorbity = this.getLabelAccordionMorbidityComorbity(patientStorage);
			patientStorage.exitCID = patientStorage.diagnosticHypothesisList[0];

			await this.setClinicalIndication(patientStorage);
			await this.setMedicineReintegration(patientStorage);
			await this.setWelcomeHomeIndication(patientStorage);

			this.setState({
				...this.state,
				patient: patientStorage,
				morbidityComorbityList
			});
		}
		this.handleUpdatePatient = payload.action.params.handleUpdatePatient;
	});

	getPatient = async (patientID, hospitalId) => {
		let self = this;
		let hospitalList = JSON.parse(await AsyncStorage.getItem('hospitalList'));
		
		hospitalList.map(hospital => {
			if (hospital.id === hospitalId) {
				hospital.hospitalizationList.map(patient => {
					if (patient.id === patientID) {
						this.setState({patient});
					}
				});
			}
		});
	}

	saveValidate = () => {
		const { patient } = this.state;
		if (!patient.exitCID) {
			Alert.alert('Atenção', "É necessário selecionar um CID de Saída.", [{text:'OK',onPress:()=>{}}],{cancelable:false});
			return;
		}
		if (patient.recommendationClinicalIndication && !patient.specialty) {
			Alert.alert('Atenção', "É necessário selecionar uma especialidade.", [{text:'OK',onPress:()=>{}}],{cancelable:false});
			return;
		}
		Alert.alert('Atenção', 'Você tem certeza que deseja finalizar o monitoramento deste paciente?', [
			{ text: 'Não', style: 'cancel' },
			{ text: 'Sim', onPress: () => this.save() },
		], {cancelable: false});
	}

	save = async () => {
		const { patient } = this.state;
		let showSpinner = false;

		await this.handleUpdatePatient('diagnosticHypothesisList', [patient.exitCID], showSpinner);
		await this.handleUpdatePatient('complementaryInfoHospitalizationAPI', patient.complementaryInfoHospitalizationAPI, showSpinner);
		await this.handleUpdatePatient('morbidityComorbityList', patient.morbidityComorbityList, showSpinner);
		await this.handleUpdatePatient('welcomeHomeIndication', patient.welcomeHomeIndication, showSpinner);
		await this.handleUpdatePatient('medicineReintegration', patient.medicineReintegration, showSpinner);
		await this.handleUpdatePatient('clinicalIndication', patient.clinicalIndication, showSpinner);

		let observationList;
		if (patient.observationList && patient.observationList.lenght > 0) {
			observationList = _.orderBy(patient.observationList, ['observationDate'], ['desc']);
			observationList[0].medicalRelease = true;
			observationList[0].observation = "Internação finalizada.";
		} else {
			observationList = [ {
				uuid: uuidv4(),
				observationDate: moment(),
				alert: null,
				medicalRelease: true,
				endTracking: null,
				observation: "Internação finalizada.",
				removedAt: null
			} ];
		}
		await this.handleUpdatePatient('observationList', observationList);
		Alert.alert('Finalizar', "Finalização realizada com sucesso.", [{ text: 'OK', onPress: ()=>this._goBack() }]);
	}

	_goBack = () => {
		this.props.navigation.navigate('PatientDetail');
	}
	
	toggleModal = (modalName) => {
		this.setState({
			...this.state,
			[modalName]: !this.state[modalName]
		})
	}

	toggleAccordion = (accordionName) => {
		this.setState({[accordionName]: !this.state[accordionName]})
	}

	handleExitCID = (cid) => {
		let newCID = {
			beginDate: moment(),
			cidDisplayName: `${cid.item.code} - ${cid.item.name}`,
			cidId: cid.item.id,
			uuid: uuidv4(),
		}

		let patient = this.state.patient;
		patient.exitCID = newCID;
		this.setState({
			...this.state,
			patient
		});
		this.toggleModal('modalExitCID');
	}

	handleComplementaryInfoHospitalizationAPI = (attribute, value) => {
		let patient = this.state.patient
		patient.complementaryInfoHospitalizationAPI[attribute] = value
		patient.complementaryInfoHospitalizationAPI.result = this.calculateRehospitalizationRisk(patient);
		
		this.setState({ patient });
	}

	handleMorbidityComorbity(morbidityComorbityItem) {
		let patient = this.state.patient;
		if (patient.morbidityComorbityList === null) {
			patient.morbidityComorbityList = [];	
		}

		let hasItem = _.includes(patient.morbidityComorbityList, morbidityComorbityItem);
		if (hasItem) {
			_.remove(patient.morbidityComorbityList, function(e) {  
				return e.morbidityComorbityId === morbidityComorbityItem.morbidityComorbityId;
			});
		} else {
			patient.morbidityComorbityList.push(morbidityComorbityItem);
		}

		patient.brittlenessIndex = this.calculateBrittlenessIndex(patient);
		patient.labelAccordionMorbidityComorbity = this.getLabelAccordionMorbidityComorbity(patient);
		this.setState({
			patient
		});
	}

	handleWelcomeHome(status) {
		this.setState({
			patient: {
				...this.state.patient,
				welcomeHomeIndication: {
					...this.state.patient.welcomeHomeIndication,
					indicated: status
				}
			}
		});
	}

	handleMedicineReintegration(status) {
		this.setState({
			patient: {
				...this.state.patient,
				medicineReintegration: {
					...this.state.patient.medicineReintegration,
					indicated: status
				}
			}
		});
	}

	handleClinicalIndicationStatus(status) {
		this.setState({
			patient: {
				...this.state.patient,
				clinicalIndication: {
					...this.state.patient.clinicalIndication,
					indicated: status,
					specialtyId: status ? this.state.patient.clinicalIndication.specialtyId : null,
					specialtyDisplayName: status ? this.state.patient.clinicalIndication.specialtyDisplayName : null
				}
			}
		});
	}

	handleClinicalIndicationSpecialty(specialty) {
		let clinicalIndication = this.state.patient.clinicalIndication;
		clinicalIndication.specialtyId = specialty.item.id;
		clinicalIndication.specialtyDisplayName = specialty.item.name;

		this.setState({
			patient: {
				...this.state.patient,
				clinicalIndication
			}
		});
		
		this.toggleModal('modalSpecialty');
	}

	isHospitalizationMoreFiveDays(patient) {
		const today = moment();
        let admissionDate = moment(moment(patient.admissionDate).format('YYYY-MM-DD HH:mm'));
        let totalHospitalizationHours = today.diff(admissionDate, 'hours');
		totalHospitalizationHours = Math.round((totalHospitalizationHours / 24));
		if (totalHospitalizationHours > 5) {
			return true;
		}
		return false;
	}

	isLastTwelveMonths(hospitalizationDateExit) {
		const today = moment();
		let exitDate = moment(moment(hospitalizationDateExit).format('YYYY-MM-DD HH:mm'));
		let monthsAgo = today.diff(exitDate, 'months');
		if (monthsAgo <= 12) {
			return true
		}
		return false;
	}

	getTotalHospitalizationLastTwelveMonth(patient) {
		let hospitalizationsValid = [];
		let totalHospitalizations = patient.previousHospitalizations.reduce((totalHospitalizations, hospitalization) => {
			if (hospitalization.exitDate != null && this.isLastTwelveMonths(hospitalization.exitDate)) {
				hospitalizationsValid.push(hospitalization)
				return totalHospitalizations + 1;
			} else {
				return totalHospitalizations;
			}
		}, 0);

		let monthsAgoFromFirstHospitalization;
		if (totalHospitalizations > 0) {
			let listOfOrderedPatientVisits = _.orderBy(hospitalizationsValid, ['exitDate'], ['desc']);
			monthsAgoFromFirstHospitalization = this.getMonthsAgoFromFirstHospitalization(listOfOrderedPatientVisits[0].exitDate);
		}

		if (totalHospitalizations === 0) {
			return ''
		}

		if (totalHospitalizations === 1) {
			return `${totalHospitalizations} internação ${monthsAgoFromFirstHospitalization}`
		}
		
		return `${totalHospitalizations} internações ${monthsAgoFromFirstHospitalization}`
	}

	calculateRehospitalizationRisk(patient) {
		let totalRisk = 0;
		let risk = null;

		if (patient.complementaryInfoHospitalizationAPI.isNotHemoglobin && patient.complementaryInfoHospitalizationAPI.hemoglobin !== '' && patient.complementaryInfoHospitalizationAPI.hemoglobin !== null && patient.complementaryInfoHospitalizationAPI.hemoglobin < 12) {
			totalRisk += 1;
		}

		if (patient.complementaryInfoHospitalizationAPI.isNotSerumSodium && patient.complementaryInfoHospitalizationAPI.serumSodium !== '' && patient.complementaryInfoHospitalizationAPI.serumSodium !== null && patient.complementaryInfoHospitalizationAPI.serumSodium <= 135) {
			totalRisk += 1;
		}

		if (patient.complementaryInfoHospitalizationAPI.isHighOncologicalServiceOrProcedure !== null && patient.complementaryInfoHospitalizationAPI.isHighOncologicalServiceOrProcedure) {
			totalRisk += 2;
		}

		if (patient.complementaryInfoHospitalizationAPI.isPancreateColectomyHepatic !== null && patient.complementaryInfoHospitalizationAPI.isPancreateColectomyHepatic) {
			totalRisk += 1;
		}

		if (patient.complementaryInfoHospitalizationAPI.isUrgentEmergHospitatization !== null && patient.complementaryInfoHospitalizationAPI.isUrgentEmergHospitatization) {
			totalRisk += 1;
		}

		if (patient.complementaryInfoHospitalizationAPI.isHospitalizationMoreFiveDays !== null && patient.complementaryInfoHospitalizationAPI.isHospitalizationMoreFiveDays) {
			totalRisk += 2;
		}

		totalRisk += this.getRiskOfPreviousHospitalization(patient);

		if (totalRisk <= 4) {
			return risk = 'Risco baixo de reinternação';
		}

		if (totalRisk >= 5 && totalRisk <= 6) {
			return risk = 'Risco intermediário de reinternação';
		}

		return risk = 'Risco alto de reinternação';
		
	}

	getRiskOfPreviousHospitalization(patient) {
		if (patient.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths !== null && patient.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths > 5) {
			return 5
		}

		if (patient.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths !== null && 
			(patient.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths >= 2 && patient.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths <= 5) ) {
				console.log("entrou no 2 a 5 internacoes");
			return 2
		} 

		return 0
	}

	getStatusHemoglobin(hemoglobin) {
		if (hemoglobin !== null && hemoglobin !== '' && hemoglobin > 0) {
			return true;
		}
		return false;
	}

	getStatusSodium(serumSodium) {
		if (serumSodium !== null && serumSodium !== '' && serumSodium > 0) {
			return true;
		}
		return false;
	}

	getTypePatient(dateOfBirth) {
		const today = moment();
		let birth = moment(moment(dateOfBirth).format('YYYY-MM-DD'));
		let totalMonths = today.diff(birth, 'months');
		if (totalMonths <= 215) {
			return PEDIATRIC_PATIENT;
		}

		if (totalMonths > 215 && totalMonths <= 779) {
			return GENERAL_PATIENT;
		}

		return SENIORS_PATIENT;
	}

	getMonthsAgoFromFirstHospitalization(dateFirstHospitalization) {
		const today = moment();
		let dateHospitalization = moment(moment(dateFirstHospitalization).format('YYYY-MM-DD HH:mm'));
		let monthsAgo = today.diff(dateHospitalization, 'months');

		if(monthsAgo === 12) {
			return 	'';
		}

		if(monthsAgo === 1) {
			return 	`em ${monthsAgo} mes`;
		}
		
		return 	`em ${monthsAgo} meses`;
	}

	calculateBrittlenessIndex(patient) {
		let brittlenessIndex = '';
		if (patient.typePatient === SENIORS_PATIENT) {
			console.log("patient.morbidityComorbityList => ", patient.morbidityComorbityList);
			if (patient.morbidityComorbityList.length > 0 && patient.morbidityComorbityList.length <= 2) {
				brittlenessIndex = 'Pré-frágil'
			} else if(patient.morbidityComorbityList.length > 2) {
				brittlenessIndex = 'Frágil'
			}
		}

		return brittlenessIndex;
	}

	getLabelAccordionMorbidityComorbity(patient) {
		if(patient.brittlenessIndex !== '') {
			return `${patient.typePatient} - ${patient.brittlenessIndex}`;
		}
		return `${patient.typePatient}`
	}

	getValueMorbidityComorbity(morbidityComorbityItem) {
		if (this.state.patient.morbidityComorbityList === null) {
			return false;
		}

		let result = false;
		this.state.patient.morbidityComorbityList.map(item => {
			if (item.morbidityComorbityId === morbidityComorbityItem.morbidityComorbityId) {
				result = true;
			}
		});

		return result;
	}

	async setClinicalIndication(patient) {
		if (patient.clinicalIndication) {
			patient.clinicalIndication = {
				performedAt: patient.exitDate ? patient.exitDate : moment(),
				uuid: patient.clinicalIndication.uuid ? patient.clinicalIndication.uuid : uuidv4(),
				indicated: patient.clinicalIndication.indicated ? patient.clinicalIndication.indicated : false,
				costEvaluation: patient.clinicalIndication.costEvaluation ? patient.clinicalIndication.costEvaluation : null,
				qualityEvaluation: patient.clinicalIndication.qualityEvaluation ? patient.clinicalIndication.qualityEvaluation : null,
				specialtyId: patient.clinicalIndication.specialtyId ? patient.clinicalIndication.specialtyId : null,
				specialtyDisplayName: patient.clinicalIndication.specialtyDisplayName ? patient.clinicalIndication.specialtyDisplayName : null
			};
		} else {
			patient.clinicalIndication = {
				performedAt: moment(),
				uuid: uuidv4(),
				indicated: false,
				costEvaluation: null,
				qualityEvaluation: null,
				specialtyId: null,
				specialtyDisplayName: null
			};
		}
	}

	async setMedicineReintegration(patient) {
		if (patient.medicineReintegration) {
			patient.medicineReintegration = {
				performedAt: patient.exitDate ? patient.exitDate : moment(),
				uuid: patient.medicineReintegration.uuid ? patient.medicineReintegration.uuid : uuidv4(),
				indicated: patient.medicineReintegration.indicated ? patient.medicineReintegration.indicated : false,
				costEvaluation: patient.medicineReintegration.costEvaluation ? patient.medicineReintegration.costEvaluation : null,
				qualityEvaluation: patient.medicineReintegration.qualityEvaluation ? patient.medicineReintegration.qualityEvaluation : null,
			};
		} else {
			patient.medicineReintegration = {
				performedAt: moment(),
				uuid: uuidv4(),
				indicated: false,
				costEvaluation: null,
				qualityEvaluation: null,
			};
		}
	}

	async setWelcomeHomeIndication(patient) {
		if (patient.welcomeHomeIndication) {
			patient.welcomeHomeIndication = {
				performedAt: patient.exitDate ? patient.exitDate : moment(),
				uuid: patient.welcomeHomeIndication.uuid ? patient.welcomeHomeIndication.uuid : uuidv4(),
				indicated: patient.welcomeHomeIndication.indicated ? patient.welcomeHomeIndication.indicated : false,
				costEvaluation: patient.welcomeHomeIndication.costEvaluation ? patient.welcomeHomeIndication.costEvaluation : null,
				qualityEvaluation: patient.welcomeHomeIndication.qualityEvaluation ? patient.welcomeHomeIndication.qualityEvaluation : null,
			};
		} else {
			patient.welcomeHomeIndication = {
				performedAt: moment(),
				uuid: uuidv4(),
				indicated: false,
				costEvaluation: null,
				qualityEvaluation: null,
			};
		}
	}

	renderAccordionComplementaryInfoHospitalizationAPI() {
		console.log("paciente nulo? ", this.state.patient)
		return (
			<View style={{marginLeft: '-22%'}}>
				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Hemoglobina {"\n"} </Text>
						<View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderColor: '#000000' }}>
							<View style={{flexDirection: 'row', justifyContent: 'flex-start' }}>
								<Text>Não realizado</Text>
								<Switch value={this.state.patient.complementaryInfoHospitalizationAPI.isNotHemoglobin}
									onValueChange={() => {this.handleComplementaryInfoHospitalizationAPI('isNotHemoglobin', !this.state.patient.complementaryInfoHospitalizationAPI.isNotHemoglobin)}} />
							</View>

							<View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',}}>
									<TextInput mode='flat' style={{backgroundColor: 'white', width: '40%', height: 40, marginBottom: 20}} 
										keyboardType="numeric"
										value={this.state.patient.complementaryInfoHospitalizationAPI.hemoglobin ? `${this.state.patient.complementaryInfoHospitalizationAPI.hemoglobin}` : ''}
										onChangeText={text => {this.handleComplementaryInfoHospitalizationAPI('hemoglobin', text)}} />
								<Text>g/dL</Text>
							</View>
						</View>
					</Body>
				</ListItem>
				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Sódio sérico {"\n"} </Text>
						<View style={{flexDirection: 'row', alignItems: 'center' }}>
							<View style={{flexDirection: 'row', justifyContent: 'flex-start' }}>
								<Text>Não realizado</Text>
								<Switch value={this.state.patient.complementaryInfoHospitalizationAPI.isNotSerumSodium}
									onValueChange={() => {this.handleComplementaryInfoHospitalizationAPI('isNotSerumSodium', !this.state.patient.complementaryInfoHospitalizationAPI.isNotSerumSodium)}} />
							</View>

							<View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
									<TextInput mode='flat' style={{backgroundColor: 'white', width: '40%', height: 40, marginBottom: 20 }} 
										keyboardType="numeric"
										value={this.state.patient.complementaryInfoHospitalizationAPI.serumSodium ? `${this.state.patient.complementaryInfoHospitalizationAPI.serumSodium}` : ''}
										onChangeText={text => {this.handleComplementaryInfoHospitalizationAPI('serumSodium', text)}} />
								<Text>mEq/L</Text>
							</View>
						</View>
					</Body>
				</ListItem>
				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Alta de serviço ou por procedimento oncológico {"\n"} </Text>
						<View style={{justifyContent: 'flex-end' }}>
							<Switch value={this.state.patient.complementaryInfoHospitalizationAPI.isHighOncologicalServiceOrProcedure}
								onValueChange={() => {this.handleComplementaryInfoHospitalizationAPI('isHighOncologicalServiceOrProcedure', !this.state.patient.complementaryInfoHospitalizationAPI.isHighOncologicalServiceOrProcedure)}} />
						</View>
					</Body>
				</ListItem>
				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Pancreatectomia, colectomia e/ou ressecção hepática* {"\n"} </Text>
						<View style={{justifyContent: 'flex-end' }}>
							<Switch value={this.state.patient.complementaryInfoHospitalizationAPI.isPancreateColectomyHepatic}
								onValueChange={() => {this.handleComplementaryInfoHospitalizationAPI('isPancreateColectomyHepatic', !this.state.patient.complementaryInfoHospitalizationAPI.isPancreateColectomyHepatic)}} />
						</View>
					</Body>
				</ListItem>
				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold', color: 'grey'}}>Internação de urgência ou emergência {"\n"}</Text>
						<View style={{justifyContent: 'flex-end' }}>
							<Switch value={this.state.patient.complementaryInfoHospitalizationAPI.isUrgentEmergHospitatization} disabled={true} />
						</View>
					</Body>
				</ListItem>
				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold', color: 'grey'}}>Duração de internação >= 5 dias {"\n"} </Text>
						<View style={{justifyContent: 'flex-end' }}>
							<Switch value={this.state.patient.complementaryInfoHospitalizationAPI.isHospitalizationMoreFiveDays} disabled={true} />
						</View>
					</Body>
				</ListItem>
				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Quantidade de internação nos últimos 12 meses {"\n"} </Text>
						<View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
							<Text>
								{this.state.patient.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths ? this.state.patient.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths : 0}
							</Text>

							{/* <TextInput mode='flat' style={{backgroundColor: 'white', width: '65%', height: 40, marginBottom: 20 }} 
								keyboardType="numeric" editable={false}
								value={this.state.patient.complementaryInfoHospitalizationAPI.hospitalizationsInTwelveMonths}
								onChangeText={text => {this.handleComplementaryInfoHospitalizationAPI('hospitalizationsInTwelveMonths', text)}} /> */}
						</View>
					</Body>
				</ListItem>
			</View>
		);
	}

	renderMorbidityComorbityList(typePatient) {
		if (this.state.morbidityComorbityList) {
		return (
			this.state.morbidityComorbityList.map(item => {
				if(typePatient !== 'Idoso') {
					if (item.morbidityComorbityProfileName === typePatient) {
						return (
							<ListItem key={item.morbidityComorbityId}>
									<Body>
										<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
											<Text style={{fontWeight: 'bold', height: 20, width: '80%' ,borderWidth: 0, borderColor: '#000000' }}> {item.morbidityComorbityName} {"\n"} </Text>
											<Switch value={this.getValueMorbidityComorbity(item)}
												onValueChange={() => {this.handleMorbidityComorbity(item)}} />
										</View>
									</Body>
							</ListItem>
						);
					}
				} else {
					if (item.morbidityComorbityProfileName === typePatient || item.morbidityComorbityProfileName === 'Geral') {
						return (
							<ListItem key={item.morbidityComorbityId}>
									<Body>
										<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
											<Text style={{fontWeight: 'bold', height: 20, width: '80%' ,borderWidth: 0, borderColor: '#000000' }}> {item.morbidityComorbityName} {"\n"} </Text>
											<Switch value={this.getValueMorbidityComorbity(item)}
												onValueChange={() => {this.handleMorbidityComorbity(item)}} />
										</View>
									</Body>
							</ListItem>
						);
					}
				}
			})
		);
		}
	}

	renderWelcomeHome() {
		return (
			<View style={{marginLeft: '-22%'}}>
				<ListItem>
					<Body>
						<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
							<Text style={{fontWeight: 'bold', height: 20, width: '80%' ,borderWidth: 0, borderColor: '#000000' }}>Requisitado pelo médico {"\n"} </Text>
							<Switch value={this.state.patient.welcomeHomeIndication ? this.state.patient.welcomeHomeIndication.indicated : false}
								onValueChange={(status) => {this.handleWelcomeHome(status)}} />
						</View>
					</Body>
				</ListItem>
			</View>
		);
	}

	renderMedicineReintegration() {
		return (
			<View style={{marginLeft: '-22%'}}>
				<ListItem>
					<Body>
						<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
							<Text style={{fontWeight: 'bold', height: 20, width: '80%' ,borderWidth: 0, borderColor: '#000000' }}>Requisitado pelo médico {"\n"} </Text>
							<Switch value={this.state.patient.medicineReintegration ? this.state.patient.medicineReintegration.indicated : false}
								onValueChange={(status) => {this.handleMedicineReintegration(status)}} />
						</View>
					</Body>
				</ListItem>
			</View>
		);
	}
	
	renderClinicalIndication() {
		return (
			<View style={{marginLeft: '-22%'}}>
				<ListItem>
					<Body>
						<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
							<Text style={{fontWeight: 'bold', height: 20, width: '80%' ,borderWidth: 0, borderColor: '#000000' }}>Requisitado pelo médico {"\n"} </Text>
							<Switch value={this.state.patient.clinicalIndication ? this.state.patient.clinicalIndication.indicated : false}
								onValueChange={(status) => {this.handleClinicalIndicationStatus(status)}} />
						</View>
					</Body>
				</ListItem>
				{
					this.state.patient.clinicalIndication && this.state.patient.clinicalIndication.indicated ?
						<ListItem>
							<Body>
								<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
									<Text style={{fontWeight: 'bold', height: 20, width: '80%' ,borderWidth: 0, borderColor: '#000000' }}>Especialidade {"\n"} </Text>
								</View>
								<View style={{flexDirection: 'row', justifyContent: 'space-around'}} >
									<Text style={{fontWeight: 'bold', height: 20, width: '80%' ,borderWidth: 0, borderColor: '#000000', color:'#0000FF' }} onPress={ () => {this.toggleModal('modalSpecialty')} }>
										{this.state.patient.clinicalIndication && this.state.patient.clinicalIndication.specialtyDisplayName ? this.state.patient.clinicalIndication.specialtyDisplayName : 'ESCOLHER'}
										{"\n"} 
									</Text>
								</View>
							</Body>
						</ListItem>
					:
					null
				}
			</View>
		);
	}

	render() {
		const { patient } = this.state;

		if (!patient) return null;
		return (
			<Container>
				<RdHeader title={ patient.death ? 'Óbito' : 'Alta' } goBack={ this._goBack } style={ styles.header }/>
				<Modal title="CID de Saída" visible={this.state.modalExitCID} list={data.cid} onSelect={this.handleExitCID} close={() => {this.toggleModal('modalExitCID')} } />
				<Modal title="Especialidade" visible={this.state.modalSpecialty} list={data.specialty} onSelect={ (item) => { this.handleClinicalIndicationSpecialty(item) }} close={() => {this.toggleModal('modalSpecialty')} } />

				<Content padder style={ styles.body }>
					<Card elevation={10} style={ styles.card }>
						<Card.Content>
							<FormItem label='CID de Entrada' value={patient.diagnosticHypothesisList[0].cidDisplayName}/>
							<FormItem label='CID de Saída' value={this.state.patient.exitCID ? this.state.patient.exitCID.cidDisplayName : 'ESCOLHER'} onPress={ () => {this.toggleModal('modalExitCID')} }/>
						</Card.Content>
					</Card>

					<RdIf condition={!patient.death}>
						<RecommendationCardToggle 
							number='1' title='Risco de Reinternação' subtitle={patient.complementaryInfoHospitalizationAPI.result}
							visible={this.state.accordionComplementaryInfoHospitalizationAPI} 
							onPress={ () => {this.toggleAccordion('accordionComplementaryInfoHospitalizationAPI')} }> 
								{this.renderAccordionComplementaryInfoHospitalizationAPI()}
						</RecommendationCardToggle>

						<RecommendationCardToggle 
							number='2' title='Morbidades e Comorbidades' subtitle={patient.labelAccordionMorbidityComorbity}
							visible={this.state.accordionMorbidityComorbityList}
							onPress={ () => {this.toggleAccordion('accordionMorbidityComorbityList')} }> 
								<View style={{marginLeft: '-22%'}}>
									{this.renderMorbidityComorbityList(patient.typePatient)}
								</View>
						</RecommendationCardToggle>

						<RecommendationCardToggle 
							number='3' title='Welcome Home' subtitle=' '
							visible={this.state.accordionRecommendationWelcomeHomeIndication}
							onPress={ () => {this.toggleAccordion('accordionRecommendationWelcomeHomeIndication')} }> 
								{this.renderWelcomeHome()}
						</RecommendationCardToggle>

						<RecommendationCardToggle 
							number='5' title='Indicação para Ambulatório' subtitle=' '
							visible={this.state.accordionRecommendationClinicalIndication}
							onPress={ () => {this.toggleAccordion('accordionRecommendationClinicalIndication')} }> 
								{this.renderClinicalIndication()}
						</RecommendationCardToggle>

						<RecommendationCardToggle 
							number='4' title='Reconciliação Medicamentosa' subtitle=' '
							visible={this.state.accordionRecommendationMedicineReintegration}
							onPress={ () => {this.toggleAccordion('accordionRecommendationMedicineReintegration')} }> 
								{this.renderMedicineReintegration()}
						</RecommendationCardToggle>

					</RdIf>
					<View style={styles.button}>
						<Button  mode="contained" onPress={ () => this.saveValidate() }>Salvar</Button>
					</View>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		color: 'white',
		backgroundColor: '#005cd1',
	},
	card: {
		marginBottom: 10,
    },
	finalizeItemCircle: {
		width: 30,
		height: 30,
		borderRadius: 15,
		borderWidth: 1.5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	finalizeItemTitle: {
		fontWeight: 'bold',
		marginLeft: 10,
	},
	finalizeItemBody: {
		marginLeft: 5,
		marginTop: -10,
		paddingVertical: 0,
	},
	finalizeRequested: {
		width: '100%',
		flexDirection: 'row',
	},
	finalizeRequestedText: {
	},
	finalizeRequestedSwitch: {
		flex: 1,
	},
	button: {
		width: '100%',
	},
});

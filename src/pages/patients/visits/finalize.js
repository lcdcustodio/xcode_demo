import React, { Component } from 'react';
import { Container, Content } from 'native-base';
import { StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';
import moment from 'moment';
import uuidv4 from'uuid/v4';

import { RdIf, RdHeader } from '../../../components/rededor-base';
import Modal from '../../../components/Modal';
import FormItem from '../../../components/FormItem';
import RecommendationCard from '../../../components/RecommendationCard';
import RecommendationCardToggle from '../../../components/RecommendationCardToggle';
import data from '../../../../data.json';

const MEDICINE_REINTEGRATION_ACTION_STATE = 'complementaryInfoHospitalizationAPI';
const MORBITY_COMORBITY_ACTION_STATE = 'morbidityComorbityList';
const WELCOME_HOME_STATE = 'welcomeHomeIndication';
const MEDICINE_REINTEGRATION_STATE = 'medicineReintegration';
const CLINICAL_ACTION_STATE = 'clinicalIndication';

export default class Finalize extends Component {

	constructor(props) {
		super(props);
		this.state = { 
			patient: this.props.navigation.getParam('patient'),
			cid: data.cid,
			modalExitCID: false,
			exitCID: null,
			accordionComplementaryInfoHospitalizationAPI: false,
			accordionMorbidityComorbityList: false,
			accordionRecommendationWelcomeHomeIndication: false,
			accordionRecommendationMedicineReintegration: false,
			accordionRecommendationClinicalIndication: false,
		};

		handleUpdatePatient = this.props.navigation.getParam('handleUpdatePatient');
	}

	willFocus = this.props.navigation.addListener('willFocus', (payload) => {
		this.setState({ patient: payload.action.params.patient });
		handleUpdatePatient = payload.action.params.handleUpdatePatient;
	});

	_goBack = () => {
		this.props.navigation.navigate('PatientDetail');
	}
	
	toggleModal = (modalName) => {
		this.setState({[modalName]: !this.state[modalName]})
	}

	toggleAccordion = (accordionName) => {
		console.log("entrou");
		this.setState({[accordionName]: !this.state[accordionName]})
	}

	handleExitCID = (cid) => {
		let exitCID = {
			beginDate: moment(),
			cidDisplayName: `${cid.item.code} - ${cid.item.name}`,
			cidId: cid.item.id,
			uuid: uuidv4(),
		}

		this.setState({
			...this.state,
			exitCID
		})
		
		this.toggleModal('modalExitCID');
	}

	render() {
		const { patient } = this.state;
		return (
			<Container>
				<RdHeader title={ patient.death ? 'Óbito' : 'Alta' } goBack={ this._goBack } style={ styles.header }/>
				<Modal title="CID Primário" visible={this.state.modalExitCID} list={data.cid} onSelect={this.handleExitCID} close={() => {this.toggleModal('modalExitCID')} } />

				<Content padder style={ styles.body }>
					<Card elevation={10} style={ styles.card }>
						<Card.Content>
							<FormItem label='CID de Entrada' value={patient.diagnosticHypothesisList[0].cidDisplayName}/>
							<FormItem label='CID de Saída' value={this.state.exitCID ? this.state.exitCID.cidDisplayName : 'ESCOLHER'} onPress={ () => {this.toggleModal('modalExitCID')} }/>
						</Card.Content>
					</Card>

					<RdIf condition={!patient.death}>
						<RecommendationCardToggle 
							number='1' title='Risco de Reinternação' 
							visible={this.state.accordionComplementaryInfoHospitalizationAPI} 
							onPress={ () => {this.toggleAccordion('accordionComplementaryInfoHospitalizationAPI')} }> 
								<FormItem label='Risco de Reinternação' value='Teste 1' />
						</RecommendationCardToggle>

						<RecommendationCardToggle 
							number='2' title='Morbidades e Comorbidades' 
							visible={this.state.accordionMorbidityComorbityList}
							onPress={ () => {this.toggleAccordion('accordionMorbidityComorbityList')} }> 
								<FormItem label='Morbidades e Comorbidades' value='Teste 1' />
						</RecommendationCardToggle>

						<RecommendationCardToggle 
							number='3' title='Welcome Home' 
							visible={this.state.accordionRecommendationWelcomeHomeIndication}
							onPress={ () => {this.toggleAccordion('accordionRecommendationWelcomeHomeIndication')} }> 
								<FormItem label='Welcome Home' value='Teste 1' />
						</RecommendationCardToggle>
						
						<RecommendationCardToggle 
							number='4' title='Reconciliação Medicamentosa' 
							visible={this.state.accordionRecommendationMedicineReintegration}
							onPress={ () => {this.toggleAccordion('accordionRecommendationMedicineReintegration')} }> 
								<FormItem label='Reconciliação Medicamentosa' value='Teste 1' />
						</RecommendationCardToggle>

						<RecommendationCardToggle 
							number='5' title='Indicação para Ambulatório' 
							visible={this.state.accordionRecommendationClinicalIndication}
							onPress={ () => {this.toggleAccordion('accordionRecommendationClinicalIndication')} }> 
								<FormItem label='Indicação para Ambulatório' value='Teste 1' />
						</RecommendationCardToggle>
					</RdIf>
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
	body: {
		backgroundColor: '#eee',
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
	}
});

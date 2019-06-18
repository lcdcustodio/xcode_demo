import React, { Component } from 'react';
import { Container, Content } from 'native-base';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

import { RdIf, RdHeader } from '../../../components/rededor-base';
import Modal from '../../../components/Modal';
import FormItem from '../../../components/FormItem';
import RecommendationCard from '../../../components/RecommendationCard';
import RecommendationCardToggle from '../../../components/RecommendationCardToggle';

const WELCOME_HOME_STATE = 'welcomeHomeIndication';
const MEDICINE_REINTEGRATION_STATE = 'medicineReintegration';
const CLINICAL_ACTION_STATE = 'clinicalIndication';
const INPUT_CID_MODAL_VISIBLE_STATE = 'isInputCidModalVisible';

export default class Finalize extends Component {

	willFocus = this.props.navigation.addListener('willFocus', (payload) => {
		const { params } = payload.action;
		const patient = params && params.patient;
		if (patient) {
			this.setState(this._loadState(patient));
		}
	});
	
	_loadState = (patient) => {
		return {
			patient: patient,
			complementaryInfo: {},
			morbityComorbity: {},
			[WELCOME_HOME_STATE]: {
				isSet: !!patient.recommendationWelcomeHomeIndication,
			},
			[MEDICINE_REINTEGRATION_STATE]: {
				isSet: !!patient.recommendationMedicineReintegration,
			},
			[CLINICAL_ACTION_STATE]: {
				isSet: !!patient.recommendationClinicalIndication,
				specialty: 1,
			},
		}
	}

	_onToggleRecommendation = (stateName) => {
		const currentState = this.state[stateName];
		this.setState({
			[stateName]: {
				...currentState,
				isSet: !currentState.isSet	
			}
		});
	}

	_goBack = () => {
		this.props.navigation.navigate('PatientDetail');
	}

	render() {
		if (!this.state) return null;
		const { patient } = this.state;
		return (
			<Container>
				<RdHeader title={ patient.death ? 'Óbito' : 'Alta' } goBack={ this._goBack } style={ styles.header }/>
				<Modal stateName={INPUT_CID_MODAL_VISIBLE_STATE} stateHolder={this} onSelect={ (item) => { console.log("AKIIIIIIII", item) } }/>

				<Content padder style={ styles.body }>
					<Card elevation={10} style={ styles.card }>
						<Card.Content>
							<FormItem label='CID de Entrada' value='[a implementar]'/>
							<FormItem label='CID de Saída' value='[a implementar]' onPress={
								() => { this.setState({	[INPUT_CID_MODAL_VISIBLE_STATE]: true }) }
							}/>
						</Card.Content>
					</Card>
					<RdIf condition={!patient.death}>
						<RecommendationCard number='1' title='Risco de Reinternação' onPress={ () => this.props.navigation.navigate('PatientDetail', { patient: patient}) }/>
						<RecommendationCard number='2' title='Morbidades e Comorbidades' description='Adulto'/>
						<RecommendationCardToggle number='3' title='Welcome Home' stateName={WELCOME_HOME_STATE} stateHolder={this}/>
						<RecommendationCardToggle number='4' title='Reconciliação Medicamentosa' stateName={MEDICINE_REINTEGRATION_STATE} stateHolder={this}/>
						<RecommendationCardToggle number='5' title='Indicação para Ambulatório' stateName={CLINICAL_ACTION_STATE} stateHolder={this}>
							<FormItem label='Especialidade'/>
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

import React, { Component } from 'react';
import { Body, Container, Content, Header, Icon, Left, ListItem, Text, Title } from 'native-base';
import { StyleSheet } from 'react-native';
import { Avatar, Card, List } from 'react-native-paper';
import baseStyles from '../../../styles';
import { RdIf, RdHeader } from '../../../components/rededor-base';
import Modal from '../../../components/Modal';
import TextValue from '../../../components/TextValue';

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
	
	render() {
		if (!this.state) return null;
		const { patient } = this.state;
		return (
			<Container>
				<RdHeader title={ patient.death ? 'Óbito' : 'Alta' } goBack={ this._goBack } style={ styles.header }/>
				<Modal stateName={INPUT_CID_MODAL_VISIBLE_STATE} stateHolder={this} onSelect={ (item) => { console.log("AKIIIIIIII", item) } }/>

				<Content padder style={ baseStyles.container }>
					<Card elevation={10} style={ styles.card }>
						<Card.Content>
							<FormItem label='CID de Entrada'/>
							<FormItem label='CID de Saída' onPress={
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
}

const FormItem = (props) => (
	<ListItem>
		<Text style={{fontWeight: 'bold'}}>
			{ props.label + '\n'}
			<TextValue color={'#0000FF'} value='[a implementar...]' press={ props.onPress } />
		</Text>
	</ListItem>
);

const RecommendationCard = (props) => (
	<Card elevation={10} style={ styles.card } onPress={ props.onPress }>
		<List.Item
			title={ props.title }
			description={ props.description }
			left={ (innerProps) => (
				<Avatar.Text
					size={ 20 }
					style={{ marginTop: 10 }}
					label={ props.number }
				/>
			)}
		/>
	</Card>
);

class RecommendationCardToggle extends Component {

	_handlePress = () => {
		const { stateHolder, stateName } = this.props;
		const currentState = stateHolder.state[stateName];
		const newState = {};
		newState[stateName] = {
			...currentState,
			isSet: !currentState.isSet
		};
		stateHolder.setState(newState);
	}

	render() {
		const { stateHolder, stateName } = this.props;
		const currentState = stateHolder.state[stateName];
		const style = (currentState.isSet ? {} : styles.disabledCard);
		return (
			<Card elevation={10} style={ styles.card }>
				<List.Accordion
					title={ this.props.title }
					description='Requisitado pelo médico'
					left={ (innerProps) => (
						<Avatar.Text
							size={ 20 }
							label={ this.props.number }
							style={ style }
						/>
					)}
					expanded={currentState.isSet}
					onPress={this._handlePress}
				>
					{ this.props.children }
				</List.Accordion>
			</Card>
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
	disabledCard: {
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

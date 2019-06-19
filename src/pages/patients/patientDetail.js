import React, { Component } from "react";
import { Container, Content, Header, Left, Right, Button, Body, Title, Subtitle, Footer, FooterTab, Text } from 'native-base';
import { StyleSheet, BackHandler } from "react-native";
import _ from 'lodash';
import TabEnum from './PatientDetailTabEnum';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

//Pages
import Profile from "./profile";
import Events from "./events";
import Visits from "./visits";

import Session from '../../Session';

class PatientDetail extends Component {
    
	constructor(props) {
		super(props);

		this.state = {
			patient: this.props.navigation.getParam('patient'),
			selectedTab: TabEnum.Profile,
			isEditable: Session.current.user._profile === 'ADMIN' ? false : true
		}
	}

	componentDidMount() {
		console.log('back press');
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleUpdatePatient = async (attribute, value) => {
		console.log(attribute, value);

		this.setState({
			patient: {
				...this.state.patient,
				[attribute]: value
			}
		}, () => {
			AsyncStorage.setItem(this.state.patient.id.toString(), JSON.stringify(this.state.patient), () => {
				console.log(this.state.patient);
			});
		});

		console.log(this.state.patient);
		AsyncStorage.setItem('require_sync_at', JSON.stringify(moment().format('YYYY-MM-DD')));
	}
	
	renderSelectedTab = () => {
		switch (this.state.selectedTab) {
			case TabEnum.Profile:
				return <Profile patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} isEditable={this.state.isEditable} />;
			case TabEnum.Events:
				return <Events patient={this.state.patient} navigation={this.props.navigation} isEditable={this.state.isEditable} />;
			case TabEnum.Visits:
				return <Visits patient={this.state.patient} selectTab={this.selectTab} handleUpdatePatient={this.handleUpdatePatient} navigation={this.props.navigation} isEditable={this.state.isEditable} />;
		}
	}

	handleBackPress = () => {
		this.props.navigation.navigate('Patients');
		return true;
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		
		let selectedTab  = !this.props.navigation.getParam('selectedTab') ? 'profile' : this.props.navigation.getParam('selectedTab')

		let patient = this.props.navigation.getParam('patient');
		
		AsyncStorage.getItem(patient.id.toString(), (err, res) => {

			console.log(res);

			if (res == null) {

				this.setState({
					patient: patient,
					selectedTab: selectedTab,
					isEditable: Session.current.user._profile === 'ADMIN' ? false : true
				});

			}
			else
			{
				res = JSON.parse(res);

				this.setState({
					patient: res,
					selectedTab: selectedTab,
					isEditable: Session.current.user._profile === 'ADMIN' ? false : true
				});
			}


		});

		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	});

	isSelected = (tab) => {
		return (tab === this.state.selectedTab);
	}

	selectTab = (tab) => {
		this.setState({ selectedTab: tab });
	}

	render() {
		return (
			<Container>
				<Header style={ styles.header }>
					<Left style={{flex:1}} >
						<Icon name="angle-left" style={{color: '#FFF', fontSize: 40}} onPress={this._goBack} />

					</Left>
					<Body style={{flex: 7}}>
						<Title style={{color: 'white'}}> Detalhes do Paciente </Title>
					</Body>
				</Header>
				<Content>
					{ this.renderSelectedTab() }
				</Content>
				<Footer>
					<FooterTab>
						<Tab name={ TabEnum.Profile } displayName='Perfil' iconName='user' isSelected={this.isSelected} selectTab={this.selectTab} />
						<Tab name={ TabEnum.Events } displayName='Timeline' iconName='book' isSelected={this.isSelected} selectTab={this.selectTab} />
						<Tab name={ TabEnum.Visits } displayName='Visitas' iconName='calendar' isSelected={this.isSelected} selectTab={this.selectTab} />
					</FooterTab>
				</Footer>
			</Container>
		);
	}

	_goBack = () => {
		this.props.navigation.navigate('Patients',  {hospital: this.state.hospital});
	}
}

export default PatientDetail;

const backgroundColor = '#005cd1';

const Tab = (props) => (
	<Button backgroundColor={backgroundColor} vertical
			active={props.isSelected(props.name)}
			onPress={() => props.selectTab(props.name)}>
		<Icon name={props.iconName} style={{color: '#FFF', fontSize: 20}} />
		<Text>{props.displayName}</Text>
	</Button>
);

const styles = StyleSheet.create({
	header: {
		backgroundColor: backgroundColor
	},
	footer: {
		backgroundColor: backgroundColor
	},
	productContainer: {
		backgroundColor: "#FFF",
		borderBottomWidth: 1,
		borderBottomColor: "#DDD",
		padding: 20
	},
	productTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333"
	},
	productDescription: {
		fontSize: 16,
		color: "#999",
		marginTop: 5,
		lineHeight: 24
	},
	patientName: {
		marginTop: '17%',
		marginLeft: '5%',
		fontSize: 20,
		fontWeight: "400",
		fontStyle: "normal",
		lineHeight: 24,
		letterSpacing: 0,
		textAlign: "left",
		color: "rgb(25, 118, 159)"
	},
});

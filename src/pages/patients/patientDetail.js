import React, { Component } from "react";
import { Container, Content, Header, Left, Right, Button, Body, Icon, Title, Subtitle, Footer, FooterTab, Text } from 'native-base';
import { StyleSheet, BackHandler } from "react-native";
import _ from 'lodash';
import TabEnum from './PatientDetailTabEnum';
import Profile from "./profile";
import Events from "./events";
import Visits from "./visits";

class PatientDetail extends Component {
    
	constructor(props) {
		super(props);
		this.state = {
			patient: this.props.navigation.getParam('patient'),
			selectedTab: TabEnum.Profile
		}
	}

	handleUpdatePatient = async (attribute, value) => {
		this.setState({
			patient: {
				...this.state.patient,
				[attribute]: value
			}
		})
	}

	renderSelectedTab = () => {
		switch (this.state.selectedTab) {
			case TabEnum.Profile:
				return <Profile patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} />;
			case TabEnum.Events:
				return <Events patient={this.state.patient} parent={this} navigation={this.props.navigation} />;
			case TabEnum.Visits:
				return <Visits patient={this.state.patient} parent={this} navigation={this.props.navigation} />;
		}
	}

	updatePatient = patient =>{
		this.setState({patient})
	}

	handleBackPress = () => {
		this.props.navigation.navigate('Patients');
		return true;
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		this.setState({
			patient: this.props.navigation.getParam('patient'),
			selectedTab: TabEnum.Profile,
		});
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	});

	isSelected(tab) {
		return (tab === this.state.selectedTab);
	}

	selectTab(tab) {
		this.setState({ selectedTab: tab });
	}

	render() {
		return (
			<Container>
				<Header style={ styles.header }>
					<Left style={{flex:1}} >
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress={this._goBack} />
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
						<Tab name={ TabEnum.Profile } displayName='Perfil' iconName='person' parent={this} />
						<Tab name={ TabEnum.Events } displayName='Timeline' iconName='book' parent={this} />
						<Tab name={ TabEnum.Visits } displayName='Visitas' iconName='calendar' parent={this} />
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
			active={props.parent.isSelected(props.name)}
			onPress={() => props.parent.selectTab(props.name)}>
		<Icon name={props.iconName} />
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

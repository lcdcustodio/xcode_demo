import React, { Component } from "react";
import { Container, Content, Header, Left, Right, Button, Body, Icon, Title, Footer, FooterTab, Text } from 'native-base';
import { StyleSheet, BackHandler } from "react-native";
import _ from 'lodash';

//Pages
import Profile from "./profile";
import Events from "./events";
import Visits from "./visits";


class PatientDetail extends Component {
    
	constructor(props) {
		super(props);
		this.state = {
			patient: this.props.navigation.getParam('patient'),
			selectedTab: 'profile'
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
			case 'profile':
				return (<Profile patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} />);
			case 'events':
				return <Events patient={this.state.patient} parent={this} navigation={this.props.navigation} />;
			case 'visits':
				return (<Visits patient={this.state.patient} updatePatient={this.updatePatient} navigation={this.props.navigation} />);
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
			selectedTab: 'profile',
		});
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	});

	isSelected(screen) {
		return (screen === this.state.selectedTab);
	}

	selectScreen(screen) {
		this.setState({ selectedTab: screen });
	}

	render() {
		return (
			<Container>
				<Header style={ styles.header }>
					<Left style={{flex:1}} >
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress={this._goBack} />
					</Left>
					<Body style={{flex: 7, alignItems: 'stretch'}}>
						<Title style={{color: 'white'}}> DETALHES DO PACIENTE </Title>
					</Body>
				</Header>
				<Content padder>
					{ this.renderSelectedTab() }
				</Content>
				<Footer>
					<FooterTab>
						<Tab name='profile' displayName='Perfil' iconName='person' parent={this} />
						<Tab name='events' displayName='Timeline' iconName='book' parent={this} />
						<Tab name='visits' displayName='Visitas' iconName='calendar' parent={this} />
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
			onPress={() => props.parent.selectScreen(props.name)}>
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

import React, { Component } from "react";
import { Container, Content, Header, Left, Right, Button, Body, Icon, Title, Footer, FooterTab, Text } from 'native-base';
import { StyleSheet } from "react-native";

//Pages
import Profile from "./profile"
import Events from "./events"
import Visits from "./visits"

export default class PatientDetail extends Component {
    
	constructor(props) {
		super(props);
		this.state = {
			patient: null,
			hospital: null,
			baseDataSync: null,
			selectedTab: 'profile'
		};
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		this.setState({
			patient: this.props.navigation.getParam('patient'),
			hospital: this.props.navigation.getParam('hospital'),
			baseDataSync: this.props.navigation.getParam('baseDataSync'),
		});
	});

	renderSelectedTab() {
		let patient = this.props.navigation.state.params.patient;
		switch (this.state.selectedTab) {
			case 'profile':
				return (<Profile perfil={patient}/>);
				break;
			case 'events':
				return (<Events
					exames={patient.examRequestList}
					reconciliacaoMedicamentosa={patient.recommendationMedicineReintegration}
				/>);
				break;
			case 'visits':
				return (<Visits visitas={patient.observationList}/>);
				break;
			default:
		}
	}

	switchScreen(screen) {        
		this.setState({
			selectedTab: screen
		})
	}

	render(){
		return (
			<Container>
				<Header style={ styles.header }>
					<Left style={{flex:1}} >
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress={() => this.props.navigation.navigate('Patients',  { hospital: this.state.hospital } ) } />
					</Left>
					<Body style={{flex: 7, alignItems: 'stretch'}}>
						<Title> DETALHES DO PACIENTE </Title>
					</Body>
				</Header>
				<Content padder>
					{ this.renderSelectedTab() }
				</Content>
				<Footer>
					<FooterTab>
						<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'profile'} onPress={() => this.switchScreen('profile', 'Perfil')}>
							<Icon name="person" />
							<Text>Perfil</Text>
						</Button>
						<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'events'} onPress={() => this.switchScreen('events', 'Timeline')}>
							<Icon name="book" />
							<Text>Timeline</Text>
						</Button>
						<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'visits'} onPress={() => this.switchScreen('visits', 'Visitas')}>
							<Icon active name="calendar" />
							<Text>Visitas</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#005cd1"
	},
	footer: {
		backgroundColor: "#005cd1"
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
		fontFamily: "Gotham Rounded-Medium",
		fontSize: 20,
		fontWeight: "400",
		fontStyle: "normal",
		lineHeight: 24,
		letterSpacing: 0,
		textAlign: "left",
		color: "rgb(25, 118, 159)"
	},
});
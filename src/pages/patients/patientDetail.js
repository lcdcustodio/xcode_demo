import React, { Component } from "react";
import { Container, Content, Header, Left, Right, Button, Body, Icon, Title, Footer, FooterTab, Text } from 'native-base';
import { StyleSheet } from "react-native";

//Pages
import Profile from "./profile"
import Exams from "./exams"
import Visits from "./visits"

export default class PatientDetail extends Component {
    
	constructor(props) {
		super(props)
		this.state = {
			selectedTab: 'profile',
			selectedTabTitle: 'Perfil',
			patient: {
				name: 'Francielle da Silva',
				dateOfBirth: '09/10/1992',
				height: 1.82,
				weight: 86.0,
				medicalRecords: {
					number: '005474211',
					medicalAgreement: 'Bradesco',
					healthPlan: 'Saúde Rio',
				},
				attendance: {
					name: 'Emergencial',
					type: 'Cirúrgico',
					dateOfHospitalization: '13/05/2019 - D3 de internação',
					startDateOfMonitoring: '13/05/2019',
					mainProcedure: '30804132 - Toracostomia com drenagem pleural fechada',
					primaryCid: 'J930 - Pneumotórax de tensão, espontâneo',
					secondaryCid: ''
				},
				previousInformation: 'J930 - Pneumotórax de tensão, espontâneo',
			}
		}
	}
    
	renderSelectedTab() {
		switch (this.state.selectedTab) {
			case 'profile':
				return (<Profile data={this.state}/>);
				break;
			case 'exams':
				return (<Exams />);
				break;
			case 'visits':
				return (<Visits />);
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
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress={() => this.props.navigation.navigate({ routeName: 'Patients' }) } />
					</Left>
					<Body style={{flex: 1, alignItems: 'center',alignSelf: 'center'}}>
						<Title> {this.state.patient.name } </Title>
					</Body>
					<Right style={{flex: 1}} />
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
						<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'exams'} onPress={() => this.switchScreen('exams', 'Timeline')}>
							<Icon name="apps" />
							<Text>Timeline</Text>
						</Button>
						<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'visits'} onPress={() => this.switchScreen('visits', 'Visitas')}>
							<Icon active name="camera" />
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
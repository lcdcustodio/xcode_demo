import React, { Component } from "react";
import { Container, Content, Header, Left, Right, Button, Body, Icon, Title, Footer, FooterTab, Text } from 'native-base';
import { StyleSheet, BackHandler } from "react-native";
import { withNavigationFocus } from "react-navigation";
import moment from "moment"
import uuidv4 from'uuid/v4'
import _ from 'lodash'

//Pages
import Profile from "./profile"
import Events from "./events"
import Visits from "./visits"


class PatientDetail extends Component {
    
	constructor(props) {
		super(props);
		this.state = {
			patient: this.props.navigation.getParam('patient'),
			hospital: this.props.navigation.getParam('hospital'),
			baseDataSync: this.props.navigation.getParam('baseDataSync'),
			selectedTab: 'profile'
		}
		console.log("Executei o construtor")
	}
	
	handleAttendanceType = (attendanceType) => {
		this.setState({
			patient: {
				...this.state.patient,
				attendanceType
			}
		})
	}

	handleHospitalizationType = (hospitalizationType) => {
		this.setState({
			patient: {
				...this.state.patient,
				hospitalizationType
			}
		})
	}

	handleHeightAndWeight = (patientHeight, patientWeight) => {
		this.setState({
			patient: {
				...this.state.patient,
				patientHeight,
				patientWeight
			}
		})
	}

	handleCRM = (crm) => {
		this.setState({
			patient: {
				...this.state.patient,
				mainProcedureCRM: crm
			}
		})
	}

	handlePrimaryCID = (cid) => {
		let diagnosticHypothesisList = []
		let diagnosticHypothesis = {
			beginDate: moment(),
			cidDisplayName: `${cid.code} - ${cid.name}`,
			cidId: cid.id,
			uuid: uuidv4()
		}
		diagnosticHypothesisList.push(diagnosticHypothesis)
		
		this.setState({
			patient: {
				...this.state.patient,
				diagnosticHypothesisList
			}
		})
	}

	handleSecondaryCID = (cid) => {
		let secondaryCID = {
			beginDate: moment(),
			cidDisplayName: `${cid.code} - ${cid.name}`,
			cidId: cid.id,
			uuid: uuidv4()
		}
		if(this.state.patient.secondaryCIDList && this.state.patient.secondaryCIDList.length > 0) {
			let cidList = this.state.patient.secondaryCIDList
			cidList.push(secondaryCID)
			this.setState({
				patient: {
					...this.state.patient,
					secondaryCIDList: cidList
				}
			})
		} else {
			this.setState({
				patient: {
					...this.state.patient,
					secondaryCIDList: [secondaryCID]
				}
			})
		}
	}

	removeSecondaryCID = (cid) => {
		console.log('removeSecondaryCID')
	}

	renderSelectedTab = () => {
		console.log("Executei o renderSelectedTab")
		console.log("Base data sync", this.state.baseDataSync)
		
		switch (this.state.selectedTab) {
			case 'profile':
				return (<Profile perfil={this.state.patient} handleAttendanceType={this.handleAttendanceType} hospital={this.state.hospital} 
					baseDataSync={this.state.baseDataSync} handleHospitalizationType={this.handleHospitalizationType} 
					handleHeightAndWeight={this.handleHeightAndWeight} handleCRM={this.handleCRM} handlePrimaryCID={this.handlePrimaryCID}
					handleSecondaryCID={this.handleSecondaryCID} removeSecondaryCID={this.removeSecondaryCID} />);
				break;
			case 'exams':
				return (<Exams exames={this.props.navigation.state.params.patient.examRequestList} updateParentStatus={this.updateParentStatus} navigation={this.props.navigation} />);
				break;
			case 'visits':
				return (<Visits visitas={this.props.navigation.state.params.patient.observationList} updateParentStatus={this.updateParentStatus} navigation={this.props.navigation} />);
				break;
			default:
		}
	}

	updatePatient = patient =>{
		console.log("updatePatient = patient", patient)
		this.setState({patient})
	}

	switchScreen(screen) {        
		this.setState({
			selectedTab: screen
		})
	}

	componentDidMount() {
		console.log("Executei o DidMount")
		const { navigation } = this.props;
		this.focusListener = navigation.addListener("didFocus", () => {
			console.log("Atualizando o state de PatientDetail, para recuperar os dados que vieram da navegacao")
		  	this.setState({
				patient: this.props.navigation.getParam('patient'),
				hospital: this.props.navigation.getParam('hospital'),
				baseDataSync: this.props.navigation.getParam('baseDataSync'),
			})
		});

		console.log('back press');
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		console.log('go back');
		this.props.navigation.navigate('Patients',  { hospital: this.state.hospital } )
		return true;
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		
		this.setState({selectedTab: 'profile'});

		this.setState({
			patient: this.props.navigation.getParam('patient'),
			hospital: this.props.navigation.getParam('hospital'),
			baseDataSync: this.props.navigation.getParam('baseDataSync'),
		});
	});

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
export default withNavigationFocus(PatientDetail);


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
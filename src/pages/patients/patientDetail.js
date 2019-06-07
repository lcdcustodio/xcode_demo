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
		console.log(this.state.baseDataSync)
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
		let newCidList = this.state.patient.secondaryCIDList.filter(item => item.cidId !== cid.cidId)
		this.setState({
			patient: {
				...this.state.patient,
				secondaryCIDList: newCidList
			}
		})
	}

	renderSelectedTab = () => {
		console.log("Executei o renderSelectedTab")
		
		switch (this.state.selectedTab) {
			case 'profile':
				return (<Profile perfil={this.state.patient} handleAttendanceType={this.handleAttendanceType} hospital={this.state.hospital} 
					baseDataSync={this.state.baseDataSync} handleHospitalizationType={this.handleHospitalizationType} 
					handleHeightAndWeight={this.handleHeightAndWeight} handleCRM={this.handleCRM} handlePrimaryCID={this.handlePrimaryCID}
					handleSecondaryCID={this.handleSecondaryCID} removeSecondaryCID={this.removeSecondaryCID} handleMainProcedure={this.handleMainProcedure} />);
			case 'events':
				return <Events patient={this.state.patient} parent={this} updateParentStatus={this.updateParentStatus} navigation={this.props.navigation} />;
			case 'visits':
				return (<Visits patient={this.state.patient} updateParentStatus={this.updateParentStatus} updatePatient={this.updatePatient} navigation={this.props.navigation} />);
		}
	}

	updatePatient = patient =>{
		this.setState({patient})
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

	handleMainProcedure = (procedure) => {
		this.setState({
			patient: {
				...this.state.patient,
				mainProcedureTUSSDisplayName: `${procedure.code} - ${procedure.name}`,
				mainProcedureTUSSId: procedure.code
			}
		})
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		this.setState({
			patient: this.props.navigation.getParam('patient'),
			hospital: this.props.navigation.getParam('hospital'),
			baseDataSync: this.props.navigation.getParam('baseDataSync'),
			selectedTab: 'profile',
		});
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
						<Title> DETALHES DO PACIENTE </Title>
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

export default withNavigationFocus(PatientDetail);

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

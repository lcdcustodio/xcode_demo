import React, { Component } from "react";
import { Container, Content, Header, Left, Right, Button, Body, Title, Subtitle, Footer, FooterTab, Text } from 'native-base';
import { StyleSheet, BackHandler } from "react-native";
import _ from 'lodash';
import TabEnum from './PatientDetailTabEnum';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
			loading: false,
            timerTextColor: "#005cd1",
            timerBackgroundColor: "#fff",
			selectedTab: TabEnum.Profile,
			isEditable: Session.current.user._profile === 'ADMIN' ? false : true
		}
	}

	handleUpdatePatient = async (attribute, value) => {

		this.setState({loading: true});

		AsyncStorage.setItem('require_sync_at', JSON.stringify(moment().format('YYYY-MM-DD')));

		let patient = this.state.patient;

		patient[attribute] = value;

		this.setState({patient});

		AsyncStorage.getItem('hospitalList', (err, res) => {

			let hospitalList = JSON.parse(res);

			let hospital = [];

			for (var h = 0; h < hospitalList.length; h++) {
				
				if (patient.hospitalName == hospitalList[h].name) {

					hospital = hospitalList[h];

					for (var i = 0; i < hospitalList[h].hospitalizationList.length; i++) {
						if (hospitalList[h].hospitalizationList[i].id == patient.id) {
							hospitalList[h].hospitalizationList[i] = patient;
						}
					}
				}
			}

			AsyncStorage.setItem('hospitalList', JSON.stringify(hospitalList));

		});

		AsyncStorage.getItem('hospitalizationList', (err, res) => {

			let hospitalizationList = JSON.parse(res);

			let obj = [];

			obj.id = this.state.patient.id;

			obj[attribute] = value;

			hospitalizationList.push(obj);

			console.log(hospitalizationList);

			/*let hospitalizationList = JSON.parse(res);

			let obj = [];

			obj.id = this.state.patient.id;

			obj[attribute] = value;

			hospitalizationList.push(obj);

			console.log(hospitalizationList);

			AsyncStorage.setItem('hospitalizationList', JSON.stringify(hospitalizationList));*/

			AsyncStorage.setItem('hospitalizationList', JSON.stringify(hospitalizationList));

			this.setState({loading: false});

		});
	}
	
	renderSelectedTab = () => {
		switch (this.state.selectedTab) {
			case TabEnum.Profile:
				return <Profile patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} isEditable={this.state.isEditable} />;
			case TabEnum.Events:
				return <Events  patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} isEditable={this.state.isEditable} navigation={this.props.navigation} />;
			case TabEnum.Visits:
				return <Visits  patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} isEditable={this.state.isEditable} navigation={this.props.navigation} selectTab={this.selectTab} />;
		}
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		
		this.setState({loading: true});

		let admin = !(Session.current.user._profile === 'ADMIN');

		console.log(admin);

		this.setState({isEditable: admin});

		const hospitalId = this.props.navigation.getParam('hospitalId');

        const patientId = this.props.navigation.getParam('patientId');

        AsyncStorage.getItem('hospitalList', (err, res) => {

            let hospitalList = JSON.parse(res);

            for (var h = 0; h < hospitalList.length; h++) {
                
                if (hospitalId == hospitalList[h].id) {

                    let hospital = hospitalList[h];

                    for (var i = 0; i < hospital.hospitalizationList.length; i++) {
                    
                    	let patient = hospital.hospitalizationList[i];
                    
                        if (patient.id == patientId) {
                        	this.setState({patient: patient});
                        }
                    }
                }
            }

            this.setState({ loading: false });
        });

		BackHandler.removeEventListener ('hardwareBackPress', () => {});
        
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Patients');
            return true;
        });
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

				<Spinner
                    visible={this.state.loading}
                    textContent={this.state.textContent}
                    textStyle={styles.spinnerTextStyle} />

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
					<FooterTab style={{backgroundColor: '#005cd1'}}>
						<Tab name={ TabEnum.Profile } displayName='Perfil' iconName='user' isSelected={this.isSelected} selectTab={this.selectTab} />
						<Tab name={ TabEnum.Events } displayName='Timeline' iconName='book' isSelected={this.isSelected} selectTab={this.selectTab} />
						<Tab name={ TabEnum.Visits } displayName='Visitas' iconName='calendar' isSelected={this.isSelected} selectTab={this.selectTab} />
					</FooterTab>
				</Footer>
			</Container>
		);
	}

	_goBack = () => {
		console.log(this.state.patient.id, this.state.patient);
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

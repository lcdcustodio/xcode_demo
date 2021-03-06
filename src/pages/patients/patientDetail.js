import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Button, Body, Title, Subtitle, Footer, FooterTab, Text } from 'native-base';
import { StyleSheet, BackHandler, TouchableOpacity} from 'react-native';
import _ from 'lodash';
import TabEnum from './PatientDetailTabEnum';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Icon as IconNativeBase} from 'native-base';

import { RdHeader } from '../../components/rededor-base';
import Session from '../../Session';
import baseStyles from '../../styles';
import Profile from './profile';
import Events from './events';
import Visits from './visits';

class PatientDetail extends Component {
    
	constructor(props) {

		super(props);

		this.state = {
            hospital: {},
			hospitalId: this.props.navigation.getParam('hospitalId'),
			patientId: this.props.navigation.getParam('patientId'),
			patient: this.props.navigation.getParam('patient'),
			loading: false,
			setprofile: null,
            timerTextColor: "#005cd1",
            timerBackgroundColor: "#fff",
			selectedTab: TabEnum.Profile,
			isEditable: Session.current.user.profile == 'CONSULTANT'
		}
	}

	handleUpdatePatient = async (attribute, value, showSpinner = true) => {

		this.setState({loading: showSpinner});

		AsyncStorage.setItem('require_sync_at', JSON.stringify(moment().format('YYYY-MM-DD')));

		let patient = this.state.patient;

		patient[attribute] = value;

		this.setState({patient});

		await AsyncStorage.getItem('hospitalList', (err, res) => {

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

		await AsyncStorage.getItem('hospitalizationList', async (err, res) => {

			let hospitalizationList = JSON.parse(res);

			hospitalizationList.push({
				idPatient: this.state.patient.id,
				key: attribute,
				value: value
			});

			await AsyncStorage.setItem('hospitalizationList', JSON.stringify(hospitalizationList), () => {
				this.setState({loading: false});
			});

		});
	}
	
	renderSelectedTab = () => {
		switch (this.state.selectedTab) {
			case TabEnum.Profile:
				return <Profile patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} isEditable={this.state.isEditable} navigation={this.props.navigation} />;
			case TabEnum.Events:
				return <Events  patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} isEditable={this.state.isEditable} navigation={this.props.navigation} />;
			case TabEnum.Visits:
				return <Visits  patient={this.state.patient} handleUpdatePatient={this.handleUpdatePatient} isEditable={this.state.isEditable} navigation={this.props.navigation} selectTab={this.selectTab} hospitalId={this.state.hospitalId} />;
		}
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		
		this.setState({isEditable: Session.current.user._profile != 'ADMIN'});

		const patientId = this.props.navigation.getParam('patientId');

		const hospitalId = this.props.navigation.getParam('hospitalId');

		if (this.state.setprofile != patientId) {
			this.setState({ selectedTab: 'profile' });
			this.state.setprofile =  patientId;
		}

        AsyncStorage.getItem('hospitalList', (err, res) => {

            let hospitalList = JSON.parse(res);

            for (var h = 0; h < hospitalList.length; h++) {
                
                if (hospitalId == hospitalList[h].id) {

                    let hospital = hospitalList[h];

                    for (var i = 0; i < hospital.hospitalizationList.length; i++) {
                    
                    	let patient = hospital.hospitalizationList[i];
                    
                        if (patient.id == patientId) {

							this.setState({patient: patient});
							
							AsyncStorage.setItem(`${patientId}`, JSON.stringify(patient));
                        }
                    }

                    this.setState({hospital: hospital});
                }
            }
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
		const profileStyle = this.isSelected(TabEnum.Profile) ? styles.ativo : styles.inativo;
		const eventsStyle = this.isSelected(TabEnum.Events) ? styles.ativo : styles.inativo;
		const visitsStyle = this.isSelected(TabEnum.Visits) ? styles.ativo : styles.inativo;
		return (
			<Container>
				<Spinner
                    visible={this.state.loading}
                    textContent={this.state.textContent}
                    textStyle={styles.spinnerTextStyle} />
				<RdHeader
					title='Detalhes do Paciente'
					goBack={this._goBack}/>
				<Content contentContainerStyle={{ ...baseStyles.container, flex: 1 }}>
					{ this.renderSelectedTab() }
				</Content>
				<Footer>
					<FooterTab style={{ backgroundColor: '#005cd1', alignItems: 'center' }}>
						<Left style={{ ...styles.tab, ...profileStyle }}>
							<Tab name={ TabEnum.Profile }
								style={ profileStyle }
								displayName='Perfil'
								iconName='user'
								isSelected={ this.isSelected }
								selectTab={ this.selectTab }/>
						</Left>
						<Body style={{ ...styles.tab, ...eventsStyle }}>
							<Tab name={ TabEnum.Events }
								style={ eventsStyle }
								displayName='Timeline'
								iconName='book'
								isSelected={ this.isSelected }
								selectTab={ this.selectTab }/>
						</Body>
						<Right style={{ ...styles.tab, ...visitsStyle }}>
							<Tab name={ TabEnum.Visits }
								style={ visitsStyle }
								displayName='Visitas'
								iconName='calendar'
								isSelected={ this.isSelected }
								selectTab={ this.selectTab }/>
						</Right>
					</FooterTab>
				</Footer>
			</Container>
		);
	}

	_goBack = () => {
		this.props.navigation.navigate('Patients',  {hospitalId: this.state.hospital.id});
	}
}

export default PatientDetail;

const backgroundColor = '#005cd1';

const Tab = (props) => (
	<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
			onPress={() => props.selectTab(props.name)}>
		<Icon name={ props.iconName } style={{ ...props.style, fontSize: 20 }} />
		<Text style={ props.style }>{ props.displayName }</Text>
	</TouchableOpacity>
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
	tab: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
	},
	ativo: {
		color: 'white',
        backgroundColor: '#0065e6',
	},
	inativo: {
		color: '#00aaff',
        backgroundColor: backgroundColor,
    },
});

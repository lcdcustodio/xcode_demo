import React, { Component } from 'react';
import {createAppContainer, createDrawerNavigator} from 'react-navigation';

import Sidebar from './pages/sidebar'
import HospitalsScreen from './pages/hospitals';
import SignInScreen from './pages/signIn';
import PatientsScreen from './pages/patients';
import PatientDetailScreen from './pages/patients/patientDetail';
import EventDetailScreen from './pages/patients/events/detail';
import ReportScreen from './pages/report';
import FinalizeScreen from './pages/patients/visits/finalize';

export default class App extends Component {
    render() {
        return  <AppContainer ref={nav => this.navigator = nav}/>
    }
}

const AppNavigator = createDrawerNavigator(
	{
		SignIn: {
			screen: SignInScreen
		},
		Hospitals: {
			screen: HospitalsScreen
		},
		Patients: {
			screen: PatientsScreen
		},
		PatientDetail: {
			screen: PatientDetailScreen
		},
		EventDetail: {
			screen: EventDetailScreen
		},
		Report: {
			screen: ReportScreen
		},
		Finalize: {
			screen: FinalizeScreen
		},
	}, {
		contentComponent: Sidebar
	}
);

const AppContainer = createAppContainer(AppNavigator);

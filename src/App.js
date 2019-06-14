import React, { Component } from 'react';
import {createAppContainer, createDrawerNavigator} from 'react-navigation';

import Sidebar from './pages/sidebar'
import HospitalsScreen from './pages/hospitals';
import SignInScreen from './pages/signIn';
import PatientsScreen from './pages/patients';
import PatientDetailScreen from './pages/patients/patientDetail';
import EventDetailScreen from './pages/patients/events/detail';
<<<<<<< HEAD
import ReportScreen from './pages/report';
=======
import RecommendationScreen from './pages/patients/events/recommendation/';
>>>>>>> 521de306dd2dd215ca4a8414433e86ee928d8639
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
<<<<<<< HEAD
		Report: {
			screen: ReportScreen
=======
		Recommendation: {
			screen: RecommendationScreen
>>>>>>> 521de306dd2dd215ca4a8414433e86ee928d8639
		},
		Finalize: {
			screen: FinalizeScreen
		}
		
	}, {
		contentComponent: Sidebar
	}
);

const AppContainer = createAppContainer(AppNavigator);

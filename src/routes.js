import React, { Component } from "react";

import { createAppContainer, createDrawerNavigator } from "react-navigation";

import Sidebar from "./pages/sidebar"

import HospitalsScreen from "./pages/hospitals";
import SignInScreen from './pages/signIn';
import SettingsScreen from "./pages/settings"
import CommentsScreen from "./pages/comments"

import PatientsScreen from "./pages/patients";
import PatientScreen from './pages/patients/patient';

import PatientDetailScreen from './pages/patients/patientDetail';

const AppNavigator = createDrawerNavigator({
	
	SignIn: {
		screen: SignInScreen
	},
	Patient: {
		screen: PatientScreen
	},
	PatientDetail: {
		screen: PatientDetailScreen
	},
	Hospitals: {
		screen: HospitalsScreen
	},
	Patients: {
		screen: PatientsScreen
	},
	Comments: {
		screen: CommentsScreen
	},
	Settings: {
		screen: SettingsScreen
	},
},
{
  contentComponent: Sidebar
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component{
    render(){
        return  <AppContainer ref={nav =>  this.navigator = nav } />
    }
}

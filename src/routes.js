import { createAppContainer, createDrawerNavigator, createApp } from "react-navigation";
import { Dimensions } from 'react-native';

import Sidebar from "./pages/sidebar"

import HospitalsScreen from "./pages/hospitals";
import SignInScreen from './pages/signIn';
import SettingsScreen from "./pages/settings"
import CommentsScreen from "./pages/comments"

import PatientsScreen from "./pages/patients";
import PatientScreen from './pages/patients/patient';

const DrawerNavigatorMC = createDrawerNavigator({
	
	SignIn: {
		screen: SignInScreen,
		navigationOptions: {
			drawerLabel: 'SignIn',
		},
	},
	Patient: {
		screen: PatientScreen,
		navigationOptions: {
			drawerLabel: 'Paciente',
		},
	},
	Hospitals: {
		screen: HospitalsScreen,
		navigationOptions: {
			drawerLabel: 'Hospitals',
		},
	},
	Patients: {
		screen: PatientsScreen,
		navigationOptions: {
			drawerLabel: 'Patients',
		},
	},
	Comments: {
		screen: CommentsScreen,
		navigationOptions: {
			drawerLabel: 'Comments',
		},
	},
	Settings: {
		screen: SettingsScreen,
		navigationOptions: {
			headerLayoutPreset: 'center',
			drawerLabel: 'Configurações',
		},
	},
},
{
  contentComponent: Sidebar,
  headerLayoutPreset: 'center',
  drawerWidth: Dimensions.get('window').width - 130,
});

export default createAppContainer(DrawerNavigatorMC);

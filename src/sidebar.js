import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Icon } from 'native-base';

export default class Sidebar extends Component {
	
	constructor() {
		super();
		this.logoImage = '';
		this.items = [
			{
				navOptionThumb: 'home',
				navOptionName: 'HOSPITAIS',
				screenToNavigate: 'Hospitals',
			},
			{
				navOptionThumb: 'md-person',
				navOptionName: 'OBSERVAÇÕES',
				screenToNavigate: 'Comments',
			},
			{
				navOptionThumb: 'md-person',
				navOptionName: 'PACIENTE',
				screenToNavigate: 'Patient',
			},
			{
				navOptionThumb: 'md-person',
				navOptionName: 'PACIENTES',
				screenToNavigate: 'Patients',
			},
			{
				navOptionThumb: 'settings',
				navOptionName: 'CONFIGURAÇÕES',
				screenToNavigate: 'Settings',
			},
		];
	}

	render() {
		return (
			<View style={styles.sideMenuContainer}>

				<Image source={require('../images/rede-dor-sao-luiz.png')} style={styles.sideMenuLogoIcon} />

				<View style={styles.divider} />

				<View style={styles.containerMenu}>
					{this.items.map((item, key) => (
						<View key={key} style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff' }} >
							<View style={styles.itemIcon}>
								<Icon name={item.navOptionThumb} />
							</View>
							<Text style={{ fontSize: 15, color: global.currentScreenIndex === key ? 'red' : 'black' }} onPress={() => { global.currentScreenIndex = key; this.props.navigation.navigate(item.screenToNavigate); }} >
								{item.navOptionName}
							</Text>
						</View>
					))}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	
	sideMenuContainer: {
		width: '100%',
		height: '100%',
		backgroundColor: '#fff',
		alignItems: 'center',
		paddingTop: 20,
	},
	sideMenuLogoIcon: {
		resizeMode: 'center',
		width: 150,
		height: 150,
		marginTop: 20,

	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: '#e2e2e2',
		marginTop: 15,
	},
	containerMenu: {
		width: '100%',
	},
	itemIcon: {
		marginRight: 10,
		marginLeft: 20
	},
});
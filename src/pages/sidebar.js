import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, Button, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

import Session from '../Session';

export default class Sidebar extends Component {
	
	constructor(props) {
		super(props);
		this.items = [ {
			navOptionThumb: 'home',
			navOptionName: 'HOSPITAIS',
			screenToNavigate: 'Hospitals',
		}, {
			navOptionThumb: 'home',
			navOptionName: 'SAIR',
			screenToNavigate: 'SignIn',
		} ];
	}

	render() {
		let user = Session.current.user;
		if (!user) {
			return null;
		}
		return (
			<LinearGradient colors={['#005cd1', '#35d8a6']} style={styles.linearGradient}>

				<View style={styles.sideMenuContainer}>
					<Image source={require('../images/logo-mc-branca.png')} style={styles.sideMenuLogoIcon} />
					<Text style={{ fontSize: 14, color: '#FFF', fontWeight: "bold" }}>
						{user.name}
					</Text>
					<Text style={{ fontSize: 12, color: '#CFC', marginBottom: 20, }}>
						{user.profile}
					</Text>
					<View style={styles.divider} />
					<View style={styles.containerMenu}>
						{this.items.map((item, key) => (
							<TouchableWithoutFeedback onPress={() => { global.currentScreenIndex = key; this.props.navigation.closeDrawer(); this.props.navigation.navigate(item.screenToNavigate); }}>
								<View key={key} style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 2, paddingBottom: 2, backgroundColor:'transparent', borderBottomColor: '#fff', borderBottomWidth: 1}} >
									<View style={styles.itemIcon}>
										<View style={styles.sideButtonRight}>
											<Icon type="AntDesign" name="right" style={{ color: 'white', fontSize: 15}} />
										</View>
									</View>
									<Text style={{ fontSize: 15, color: '#FFF', fontWeight: "bold" }} >
										{item.navOptionName}
									</Text>
								</View>
							</TouchableWithoutFeedback>
						))}
					</View>
					<View style={styles.boxButton}>
						<Image source={require('../images/logo-rededor.png')} style={styles.sideMenuLogoIcon} />
						<Text style={{ fontSize: 15, bottom: 20, textAlign: 'right', color: '#FFF', fontWeight: "bold"}}> Versão 1.3.5 </Text>
					</View>
				</View>
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		position: 'absolute',
		left: 10,
		top: 10,
		width: 50
	},
  	sideMenuContainer: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		paddingTop: 20,
	},
	linearGradient: {
		flex: 1
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
	},
	containerMenu: {
		width: '100%',
	},
	itemIcon: {
		marginRight: 20,
	},
	sideButtonRight : {
		height: 50,
		width:5,
		backgroundColor: "#fff", 
		fontWeight: "bold"
	},
	boxButton: {
		position: 'absolute',
		alignItems: 'center',
		bottom:0
	},
	userName: {
		color: '#EFE'
	},
	userProfile: {
		color: '#CFC'
	},
});

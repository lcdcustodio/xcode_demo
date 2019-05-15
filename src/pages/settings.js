import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Left, Button, Icon, Body, Title } from 'native-base';

export default class Settings extends Component {

	render() {
		return (
			<Container>
				<Header>
					<Left style={styles.header}>
						<Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={styles.icon} />
					</Left>
				</Header>
				<Content>
					<View style={styles.container}>
						<Text style={styles.msgVersao}>Versão instalada 1.3.5</Text>
						<Text style={styles.msgSincronizacao}>Última sincronização 01/05/2019 às 18:30:05</Text>
						<TouchableOpacity 
						style={styles.productButton} 
						onPress={() => {
							console.log('Sincronizar');
						}}
						>
						<Text style={styles.productButtonText}>SINCRONIZAR AGORA</Text>
						</TouchableOpacity>
					</View>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	
	container: {
		backgroundColor: "#FFF",
		padding: 20,
		lineHeight: 2
	},

	msgVersao: {
		marginTop: 30,
		fontSize: 16,
		textAlign: 'center',
		margin: 10,
	},
	msgSincronizacao: {
		marginTop: 30,
		fontSize: 16,
		textAlign: 'center',
		margin: 10,
	},

	productButton: {
		height: 41,
		width: 318,
		borderRadius: 5,
		borderWidth: 2,
		borderColor: "#19769f",
		backgroundColor: "#19769f",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10
	},

	productButtonText: {
		fontSize: 16,
		color: "#f8f8f8",
		fontWeight: "bold"
	}
});
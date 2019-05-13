import React, { Component } from "react";

import api from '../../services/api';

import { Container, Content, Header, Left, Button, Icon, Body, Title, Footer, FooterTab, Text } from 'native-base';

import { View, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";

export default class Patients extends Component {
    
	state = {
		infos: {},
		patients: [],
		page: 1,
	};
	
	componentDidMount() {
		this.loadProduts();
	}

	loadProduts = async (page = 1) => {

		const response = await api.get();

		const { patients, ... infos } = response.data;

		this.setState({ 
			patients: [ ... this.state.patients, ... patients], 
			infos,
			page
		});
	};

	loadMore = () => {
		
		const { page, infos } = this.state;

		if (page === 1) return;

		const pageNumber = page + 1;

		this.loadProduts(pageNumber);
	}

	renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => {
				//this.props.navigation.navigate({ routeName: 'Hospitals' });

				global.currentScreenIndex = 3; 
				console.log(3); 
				this.props.navigation.navigate('Hospitals');

				console.log('ooook');
			}}>
				<View style={styles.productContainer}>
					<Text style={styles.productTitle}> {item.name} </Text>
					<Text style={styles.productDescription}> INTERNADO: {item.internship} | SETOR: {item.sector} | LEITO: {item.room} </Text>  
					<Text style={styles.productDescription}> Última visita: {item.last_visited} </Text>
				</View>

		</TouchableOpacity>
	);

	render(){
		return (

			<Container>
				<Header>
					<Left style={styles.header}>
						<Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={styles.icon} />
					</Left>
				</Header>
				<Content>
			<View style={styles.container}>
				<FlatList
					contentContainerStyle={styles.list}
					data={this.state.patients}
					keyExtractor={item => item._id}
					renderItem={this.renderItem}
					onEndReached={this.loadMore}
					onEndReachedThreshold={0.1}
					/>
			</View>
			</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	
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
		fontSize: 14,
		color: "#999",
		marginTop: 5,
		lineHeight: 24
	},
});



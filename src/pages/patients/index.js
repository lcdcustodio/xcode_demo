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
        console.log('oook');
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
		
			<Container>
				<Header>
					<Left style={styles.header}>
						<Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={styles.icon} />
					</Left>
				</Header>
				<Content>
				<TouchableOpacity
					onPress={() => {
						console.log(item);
					}}
					>
						<View style={styles.productContainer}>
						<Text style={styles.productTitle}>INTERNADO: {item.name} | <Text style={styles.productDescription}>SETOR: {item.internship}</Text> | <Text style={styles.productDescription}> SETOR: {item.sector}</Text> | <Text style={styles.productDescription}> LEITO: {item.sector}</Text>  </Text>
						<Text style={styles.productDescription}>Última visita: {item.last_visited}</Text>
					</View>

				</TouchableOpacity>

				</Content>
			</Container>

	);

	render(){
		return (
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
		);
	}
}

const styles = StyleSheet.create({
	
	productContainer: {
		backgroundColor: "#FFF",
		borderWidth: 1,
		borderColor: "#DDD",
		borderRadius: 5,
		padding: 20,
		marginBottom: 20
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
});



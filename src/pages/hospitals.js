import React, { Component } from "react";

import api from '../services/api';
import { Button, Container, Header, Body, Title, Left, Icon, H1, Content } from 'native-base';

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";

export default class Hospitals extends Component {

	state = {
		infos: {},
		hospitals: [],
		page: 1,
	};
	
	componentDidMount() {
		this.loadProduts();
	}

	loadProduts = async (page = 1) => {

		const response = await api.get();

		const { hospitals, ... infos } = response.data;

		this.setState({ 
			hospitals: [ ... this.state.hospitals, ... hospitals], 
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
				console.log(item);
				console.log(this.props);
				console.log(this.props.navigation);
			}}
			>
			<View style={styles.productContainer}>
				<Text style={styles.productTitle}>{item.title} <Text style={styles.productDescription}>{item.date}</Text></Text>
				<Text style={styles.productDescription}>Visitas {item.visited_patients}</Text>
				<Text style={styles.productDescription}>Pacientes {item.amount_patients}</Text>
				<Image source={{uri: item.image}} style={styles.sideMenuLogoIcon} />
			
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
				<View style={styles.container}>
					<FlatList
						contentContainerStyle={styles.list}
						data={this.state.hospitals}
						keyExtractor={item => item._id}
						renderItem={this.renderItem}
						onEndReached={this.loadMore}
						onEndReachedThreshold={0.1}
						/>
				</View>
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

	sideMenuLogoIcon: {
		resizeMode: 'center',
		width: 175,
		height: 86,
	},

	productDescription: {
		fontSize: 16,
		color: "#999",
		marginTop: 5,
		lineHeight: 24
	},

	productButton: {
		height: 42,
		borderRadius: 5,
		borderWidth: 2,
		borderColor: "#DA552F",
		backgroundColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10
	},

	productButtonText: {
		fontSize: 16,
		color: "#DA552F",
		fontWeight: "bold"
	}
});



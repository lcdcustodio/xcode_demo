import React, { Component } from "react";

import api from '../services/api';

import { Container, Content, Header, Left, Button, Icon, Body, Title, Footer, FooterTab, Text } from 'native-base';

import { View, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";

export default class Comments extends Component {
    
	state = {
		infos: {},
		comments: [],
		page: 1,
	};
	
	componentDidMount() {
		this.loadProduts();
	}

	loadProduts = async (page = 1) => {

		const response = await api.get();

		const { comments, ... infos } = response.data;

		this.setState({ 
			comments: [ ... this.state.comments, ... comments], 
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
				<Text style={styles.productTitle}>{item.username} </Text>
				<Text style={styles.productDescription}>{item.created_at} </Text>
				<Text style={styles.productDescription}>{item.comment}</Text>
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
						data={this.state.comments}
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
	
	productDescription: {
		fontSize: 16,
		color: "#999",
		marginTop: 5,
		lineHeight: 24
	},
});



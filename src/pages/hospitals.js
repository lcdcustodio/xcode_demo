import React, { Component } from "react";

import api from '../services/api';

import { Container, Content, Header, Left, Icon, Text } from 'native-base';

import { View, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";

export default class Hospital extends Component {

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
				this.props.navigation.navigate("Patients", { hospital: item });
			}}>
			<View style={styles.hospitalContainer}>
				<Text style={styles.hospitalTitle}>{item.title} <Text style={styles.hospitalDescription}>{item.date}</Text></Text>
				<Text style={styles.hospitalDescription}>Visitas {item.visited_patients}</Text>
				<Text style={styles.hospitalDescription}>Pacientes {item.amount_patients}</Text>
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
				<Content>
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
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	
	hospitalContainer: {
		backgroundColor: "#FFF",
		borderBottomWidth: 1,
		borderBottomColor: "#DDD",
		padding: 20
	},

	hospitalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333"
	},

	hospitalDescription: {
		fontSize: 16,
		color: "#999",
		marginTop: 5,
		lineHeight: 24
	},

	sideMenuLogoIcon: {
		resizeMode: 'center',
		width: 175,
		height: 86,
	},
	
});



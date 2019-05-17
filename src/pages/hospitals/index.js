import React, { Component } from "react";
import api from '../../services/api';

import { Container, Content, Header, Left, Right, Body, Icon, Title, Text, Thumbnail } from 'native-base';

import { View, FlatList, TouchableOpacity } from "react-native";

import styles from './style'

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
			
			<View style={[styles.container]}>
			<View style={{flexGrow: 1, alignSelf : 'flex-start'}}>
				<Thumbnail source={{uri: item.image}} style={styles.circleIcon} />
			</View>
				<View style={{flexGrow: 2, alignSelf : 'center'}}>
					<Text style={[styles.title, styles.niceBlue]}> 
						{item.title} | 
						<Text style={[styles.description, styles.niceBlue]}> {item.date}</Text>
					</Text>
					<Text style={[styles.description]}>Visitas: {item.visited_patients}</Text>
					<Text style={[styles.description]}>Pacientes: {item.amount_patients}</Text>
				</View>
				<View style={[styles.sideButtonRight, {flexGrow: 3}]}>
					<Icon type="AntDesign" name="right" />
				</View>
			</View>
		</TouchableOpacity>
	);

	render(){
		return (
			<Container>
			<Header>
					<Left style={{flex:1}} >
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} />
					</Left>
					<Body style={{flex: 1, alignItems: 'center', alignSelf: 'center'}}>
						<Title> Hospitais </Title>
					</Body>
					<Right style={{flex: 1}} />
				</Header> 
				<Content>
					<View style={styles.container}>
						<FlatList
							contentContainerStyle={styles.list}
							data={this.state.hospitals}
							keyExtractor={item => item._id}
							renderItem={this.renderItem}
							onEndReached={this.loadMore}
							onEndReachedThreshold={0.1} />
					</View>
				</Content>
			</Container>
		);
	}
}
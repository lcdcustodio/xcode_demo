import React, { Component } from "react";

import api from '../../services/api';

import AsyncStorage from '@react-native-community/async-storage';

import Spinner from 'react-native-loading-spinner-overlay';

import styles from './style'

import { Container, Content, Header, Left, Right, Body, Icon, Title, Text } from 'native-base';

import { View, FlatList, TouchableOpacity, Image } from "react-native";

export default class Patients extends Component {
	
	constructor(props) {
		
		super(props);
		
		this.state = {
			infos: {},
			patients: [],
			page: 1,
		}
	}

	componentDidMount() {
		this.loadPatients();
	}

	loadPatients = async (page = 1) => {

		const response = await api.get(api.defaults.mockService);

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

		this.loadPatients(pageNumber);
	}

	renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => {
				this.props.navigation.navigate("PatientDetail", { patient: this.state.patientMockServer });
			}}>
			<View style={[styles.productContainer]}>
				<View>
					<Text style={[styles.patientTitle, styles.niceBlue]}> {item.name} </Text>
					<Text style={styles.hospitalizationDescription}> INTERNADO: {item.internship} | SETOR: {item.sector} | LEITO: {item.room} </Text>  
					<Text style={styles.lastVisit}> Última visita: {item.last_visited} </Text>
				</View>
				<View >
					<Image source={require('../../images/ic_home_blue.png')} style={{width: 25, height: 25}} />
				</View>
			</View>
		</TouchableOpacity>
	);

	render(){
		return (
			<Container>
				<Header style={styles.headerMenu}>
					<Left style={{flex:1}} >
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress={() => this.props.navigation.navigate({ routeName: 'Hospitals' }) }/>
					</Left>
					<Body style={{flex: 1, alignItems: 'center', alignSelf: 'center'}}>
						<Title>{this.props.navigation.getParam('hospital', null).title}</Title>
					</Body>
					<Right style={{flex: 1}} />
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
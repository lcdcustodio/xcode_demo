import React, { Component } from "react";

import api from '../../services/api';

import { Container, Content, Header, Left, Right, Body, Icon, Title, Text, Thumbnail } from 'native-base';

import { View, FlatList, TouchableOpacity } from "react-native";

import AsyncStorage from '@react-native-community/async-storage';

import styles from './style'

export default class Hospital extends Component {

	constructor(props) {
		
		super(props);
		
		this.state = {
			infos: {},
			hospitals: [],
			page: 1,
		}
	}

	displayData = async () => {
        
        try{
            
            let userData = await AsyncStorage.getItem('userData');

            //let baseDataSync_cid = await AsyncStorage.getItem('baseDataSync_cid');
            //let baseDataSync_exam = await AsyncStorage.getItem('baseDataSync_exam');
            //let baseDataSync_hospital = await AsyncStorage.getItem('baseDataSync_hospital');
            //let baseDataSync_hospitalWing = await AsyncStorage.getItem('baseDataSync_hospitalWing');
            //let baseDataSync_medicines = await AsyncStorage.getItem('baseDataSync_medicines');
            //let baseDataSync_specialty = await AsyncStorage.getItem('baseDataSync_specialty');
            //let baseDataSync_tuss = await AsyncStorage.getItem('baseDataSync_tuss');

            console.log(userData);
            //console.log(baseDataSync_cid);
            //console.log(baseDataSync_exam);
            //console.log(baseDataSync_hospital);
            //console.log(baseDataSync_hospitalWing);
            //console.log(baseDataSync_medicines);
            //console.log(baseDataSync_specialty);
            //console.log(baseDataSync_tuss);

        } catch(error) {

            console.log(error);
        
        }                   
    }
	
	componentDidMount() {
		this.loadHospitals();
	}

	loadHospitals = async (page = 1) => {

		console.log(this.displayData());

		const response = await api.get(api.defaults.mockService);

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
		this.loadHospitals(pageNumber);
	}

	renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => {
				this.props.navigation.navigate("Patients", { hospital: item });
			}}>
			
			<View style={[styles.container, {alignItems: 'center' }]}>
				<View>
					<Thumbnail square large source={{uri: item.image}} style={styles.hospitalIcon} />
				</View>
				<View style={{width: 20, marginRight: 100, marginBottom: 10}}>
					<View>
						<Text style={[styles.title, styles.niceBlue]}> 
							{item.title} | 
							<Text style={[styles.description, styles.niceBlue]}> {item.date}</Text>
						</Text>
					</View>

					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="calendar" style={styles.calendarIcon} />
						<Text style={[styles.description]}>Total de internados: {item.visited_patients}</Text>
					</View>
					
					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="user" style={styles.userIcon}/>
						<Text style={[styles.description]}>Total de pendentes: {item.amount_patients}</Text>
					</View>
				</View>
				<View style={[styles.sideButtonRight]}>
					<Icon type="AntDesign" name="right" style={{ color: 'white', fontSize: 20}} />
				</View>
			</View>
			
		</TouchableOpacity>
	);

	render(){
		return (
			<Container>
				<Header style={styles.headerMenu}>
					<Left style={{flex:1}} >
						<Icon name="md-menu" style={{ color: 'white' }} onPress={() => this.props.navigation.openDrawer() } />
					</Left>
					<Body style={{flex: 1, alignItems: 'center',alignSelf: 'center'}}>
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
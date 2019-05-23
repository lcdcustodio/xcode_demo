import React, { Component } from "react";

import api from '../../services/api';

import { Container, Content, Header, Left, Right, Body, Icon, Title, Text, Thumbnail } from 'native-base';

import { View, FlatList, TouchableOpacity } from "react-native";

import AsyncStorage from '@react-native-community/async-storage';

import styles from './style'

import moment from 'moment';

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
			const data = JSON.parse(userData);
            console.log("userData Hospitals: ", data.hospitals);
        } catch(error) {
            console.log(error);
        }                   
    }
	
	componentDidMount() {
		this.loadHospitals();
	}

	calculateTotalPatientsInterned = () => {
		const today = moment().format('YYYY-MM-DD')

		let totalPatientsInterned = this.state.hospitals.map((hospital) => {
			hospital.hospitalizationList.map((patient) => {
				
				patient.trackingList.map((visit) => { 
					let visitDate = moment(visit.startDate).format('YYYY-MM-DD')
					
					console.log("visitDate", visitDate, " + " , visit)


					console.log("today === visitDate", today === visitDate)

					if(today === visitDate) {
						console.log("MATCH")
					}
					//visit.startDate
					//se tiver visita com data de hoje
						//adiciona uma visita ao total de visitas do dia
				})
			})
		})
	}
	
	loadHospitals = async (page = 1) => {
		try{
            let userData = JSON.parse(await AsyncStorage.getItem('userData'));
			let data = {"hospitalizationList":[]}

			api.post('/api/v2.0/sync', data, {
				headers: {
					"Content-Type": "application/json",
				  	"Accept": "application/json",
				  	"Token": userData.token,
				}
			}).then(response => {
				console.log("response=> ", response)
				if(response.status === 200) {
					this.setState({
						hospitals: [ ...this.state.hospitals, ...response.data.content.hospitalList], 
					});
					console.log(this.state)
					this.calculateTotalPatientsInterned()
					//chamar metodo que seta total de pacientes internados
					//chamar metodo que seta total de pacientes sem visitas
					//chamar metodo que seta data da ultima visita
				} else {
					alert("Status != 200")
				}
			}).catch(error => {
				console.log("error=> ", error)
			});
        } catch(error) {
            console.log(error);
        }        		
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
				<View style={{flexDirection: "column", width: '53%'}}>
					<View>
						<Text style={[styles.title, styles.niceBlue]}> 
							{item.name} | 
							<Text style={[styles.description, styles.niceBlue]}> {item.date}</Text>
						</Text>
					</View>

					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="calendar" style={styles.calendarIcon} />
						<Text style={[styles.description]}>Internados: {item.hospitalizationList.length}</Text>
					</View>
					
					<View style={{flexDirection: "row", alignItems: 'center'}}>
						<Icon type="AntDesign" name="user" style={styles.userIcon}/>
						<Text style={[styles.description]}>Pendentes: {item.amount_patients}</Text>
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
							keyExtractor={item => item.id + '_'}
							renderItem={this.renderItem}
							onEndReached={this.loadMore}
							onEndReachedThreshold={0.1} />
					</View>
				</Content>
			</Container>
		);
	}
}
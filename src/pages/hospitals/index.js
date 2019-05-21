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
		this.loadProduts(pageNumber);
	}

	renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => {
				console.log(item);
				this.props.navigation.navigate("Patients", { hospital: item });
			}}>
			
			<View style={[styles.container, {alignItems: 'center' }]}>
				<View>
					<Thumbnail square large source={{uri: item.image}} style={styles.hospitalIcon} />
				</View>
				<View style={{width: 20, marginRight: 100, marginBottom: 10}}>
					<View style={{wordWrap: 'break-word'}}>
						<Text style={[styles.title, styles.niceBlue, {width: 300}]}> 
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
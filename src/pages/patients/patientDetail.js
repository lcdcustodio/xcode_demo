import React, { Component } from "react";
import { Container, Content, Header, Left, Right, Button, Body, Icon, Title, Footer, FooterTab, Text } from 'native-base';
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";

//Apis
import api from '../../services/api';

//Pages
import Profile from "./profile"
import Exams from "./exams"
import Visits from "./visits"

//Components 
import TextLabel from '../../components/TextLabel'
import TextValue from '../../components/TextValue'
import Line from '../../components/Line'
import TitleScreen from '../../components/Title'

export default class PatientDetail extends Component {
    
	constructor(props) {
		super(props)
		this.state = {
			infos: {},
			comments: [],
			page: 1,
			selectedTab: 'profile',
			selectedTabTitle: 'Perfil'
		}
	}
    
	renderSelectedTab() {
		switch (this.state.selectedTab) {
			case 'profile':
				return (<Profile title={this.state.selectedTabTitle} />);
				break;
			case 'exams':
				return (<Exams title={this.state.selectedTabTitle} />);
				break;
			case 'visits':
				return (<Visits title={this.state.selectedTabTitle} />);
				break;
			default:
		}
	}

	switchScreen(screen, title) {        
		this.setState({
			selectedTab: screen,
			selectedTabTitle: title,
		})
	}
	
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
					<Left style={{flex:1}} >
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress={() => this.props.navigation.navigate({ routeName: 'Patients' }) } />
					</Left>
					<Body style={{flex: 1, alignItems: 'center',alignSelf: 'center'}}>
						<Title> {this.state.selectedTabTitle } </Title>
					</Body>
					<Right style={{flex: 1}} />
				</Header>
				<Content>
					{ this.renderSelectedTab() }
				</Content>
				<Footer>
					<FooterTab>
						<Button vertical active={this.state.selectedTab === 'profile'} onPress={() => this.switchScreen('profile', 'Perfil')}>
							<Icon name="person" />
							<Text>Perfil</Text>
						</Button>
						<Button vertical active={this.state.selectedTab === 'exams'} onPress={() => this.switchScreen('exams', 'Timeline')}>
							<Icon name="apps" />
							<Text>Timeline</Text>
						</Button>
						<Button vertical active={this.state.selectedTab === 'visits'} onPress={() => this.switchScreen('visits', 'Visitas')}>
							<Icon active name="camera" />
							<Text>Visitas</Text>
						</Button>
					</FooterTab>
				</Footer>
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
	patientName: {
		marginTop: '17%',
		marginLeft: '5%',
		fontFamily: "Gotham Rounded-Medium",
		fontSize: 20,
		fontWeight: "400",
		fontStyle: "normal",
		lineHeight: 24,
		letterSpacing: 0,
		textAlign: "left",
		color: "rgb(25, 118, 159)"
	},
});
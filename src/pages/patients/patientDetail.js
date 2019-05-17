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
				return (<Profile />);
				break;
			case 'exams':
				return (<Exams />);
				break;
			case 'visits':
				return (<Visits />);
				break;
			default:
		}
	}

	switchScreen(screen, title) {        
		this.state.selectedTab = screen;
		this.setState({
			selectedTab: screen,
			selectedTabTitle: title,
		})
        this.renderSelectedTab();
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
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress={() => this.props.navigation.navigate({ routeName: 'Patient' }) } />
					</Left>
					<Body style={{flex: 1, alignItems: 'center',alignSelf: 'center'}}>
						<Title> {this.state.selectedTabTitle } </Title>
					</Body>
					<Right style={{flex: 1}} />
				</Header>
				<Content>
					<View style={{display: 'flex'}}>
						<TitleScreen marginTop={17} marginLeft={5} title="Francielle da Silva" />
						<Line marginTop={3} marginBottom={3} marginLeft={5} width={90} size={2} />
						<TextLabel marginLeft="5" label='Prontuário' />
						<TextValue marginLeft="5" value="005474211" />	

						<View style={{flexDirection: 'row', marginTop: '5%', borderWidth: 0, borderColor: '#d6d7da' }}>
							<View style={{justifyContent: 'flex-start', width: '50%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="10" label='Convênio' />
								<TextValue marginLeft="10" value="Bradesco" />
							</View>
							
							<View style={{justifyContent: 'flex-start'}}>
								<TextLabel marginLeft="0" label='Plano' />
								<TextValue marginLeft="0" value="Saúde Rio" />
							</View>
						</View>

						<View style={{flexDirection: 'row', marginTop: '5%'}}>
							<View style={{justifyContent: 'flex-start', width: '50%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="10" label='Nascimento' />
								<TextValue marginLeft="10" value="09/10/1992" />
							</View>
							
							<View style={{justifyContent: 'flex-start'}}>
								<TextLabel marginLeft="0" label='Altura/Peso' />
								<TextValue marginLeft="0" value="1.65m/89.6Kg" />
								<TextValue marginLeft="0" size={13} value="IMC 32.91" />
							</View>
						</View>

						<View style={{flexDirection: 'row', marginTop: '5%'}}>
							<View style={{justifyContent: 'flex-start', width: '50%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="10" label='Atendimento' />
								<TextValue marginLeft="10" value="Emergencial" />
							</View>
							
							<View style={{justifyContent: 'flex-start'}}>
								<TextLabel marginLeft="0" label='Tipo' />
								<TextValue marginLeft="0" value="Cirúrgico" />
							</View>
						</View>

						<View style={{flexDirection: 'row', marginTop: '5%'}}>
							<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="5" label='Data de Internação' />
								<TextValue marginLeft="5" value="13/05/2019 - D3 de internação" />
							</View>
						</View>
							
						<View style={{flexDirection: 'row', marginTop: '5%'}}>
							<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="5" label='Data de Início do Monitoramento' />
								<TextValue marginLeft="5" value="13/05/2019" />
							</View>
						</View>

						<View style={{flexDirection: 'row', marginTop: '5%'}}>
							<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="5" label='Procedimento Principal' />
								<TextValue marginLeft="5" value="30804132 - Toracostomia com drenagem pleural fechada" />
							</View>
						</View>

						<View style={{flexDirection: 'row', marginTop: '5%'}}>
							<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="5" label='CID Primário' />
								<TextValue marginLeft="5" value="J930 - Pneumotórax de tensão, espontâneo" />
							</View>
						</View>
							
						<View style={{flexDirection: 'row', marginTop: '5%'}}>
							<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="5" label='CIDs Secundários' />
								<TextValue marginLeft="5" value="Adicionar" />
							</View>
						</View>

						<View style={{flexDirection: 'row', marginTop: '5%'}}>
							<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
								<TextLabel marginLeft="5" label='Informações Anteriores' />
								<TextValue marginLeft="5" value="J930 - Pneumotórax de tensão, espontâneo" />
							</View>
						</View>
						<Text> {'\n'} </Text>
					</View>
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
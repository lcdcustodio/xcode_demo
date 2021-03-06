import React, { Component } from 'react';
import { Alert, StatusBar, Text, StyleSheet, ImageBackground,KeyboardAvoidingView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import qs from "qs";

import Session from '../../Session';
import User from '../../model/User'
import api from '../../services/api';
import {Container, Logo, Input, ErrorMessage, Button, ButtonText} from './styles';

export default class SignIn extends Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			lastDateSync: '2010-01-10T18:46:19-0700',
			email: 'consult.radix',
			password: '*ru8u!uBus2A',
			error: '',
			textContent: '',
			loading: false
		}
	}

	componentDidMount() {
	
        this.setState({loading: true});

        AsyncStorage.getItem('hospitalList', (err, hospitalList) => {

			if (hospitalList != null) {

				AsyncStorage.getItem('userData', async (err, userData) => {

					if (userData != null) {

						let user = JSON.parse(userData);

						Session.current.user = new User(user.name, user.profile);

						this.setState({loading: false});
						
						this.props.navigation.navigate("Hospitals");

					} 
					else
					{
						this.setState({loading: false});
					}

				});
			}
			else
			{
				this.setState({loading: false});
			}
		
		});
    }
	
	getBaseDataSync = async () => {
		return await api.get('/api/basedata/baseDataSync?lastDateSync=' + this.state.lastDateSync).then(res => {
			return res.data.content.data
		}).catch(err => {
			this.setState({loading: false});
		});
	}

	handleEmailChange = (email) => {
		this.setState({ error: '' }, () => false);
		this.setState({ email });
	};

	handlePasswordChange = (password) => {
		this.setState({ error: '' }, () => false);
		this.setState({ password });
	};

	handleSignInPress = async () => {
		
		if (this.state.email.length === 0 || this.state.password.length === 0) {
			this.setState({ error: 'Por favor, preencha todos os campos' }, () => false);
		} else {
			
			this.setState({ textContent: 'Aguarde...' });

			this.setState({loading: true});

			const params = {
				username: this.state.email,
				password: this.state.password
			};

			let formdata = new FormData();

			formdata.append('username', params.username);
			
			formdata.append('password', params.password);

			let xhr = new XMLHttpRequest();

			xhr.open('POST', 'https://appmedconsultor.rededor.com.br/api/login');

			const react = this;

			xhr.onload = function () {

				let response = JSON.parse(xhr.response);

				content = response.content;

				if(content && response.success) {
					
					Session.current.user = new User(content.name, content.profile);

					AsyncStorage.multiSet([
					    ["auth", JSON.stringify(params)],
					    ["userData", JSON.stringify(content)]
					], async() => {

						react.setState({loading: false});

						react.props.navigation.navigate("Hospitals");
				
			        });
		        }	
		        else
		        {		   
		        	react.setState({ error: 'Erro inesperado!' }, () => false); 

					react.setState({loading: false});
		        }	
		    };

			xhr.onerror = function () {
								
				react.setState({loading: false});
				
				if(xhr.status == 401) 
				{
					react.setState({ error: 'Usuário e senha não coincidem' }, () => false);
				} 
				else if(xhr.status == 500) 
				{
					react.setState({ error: 'Falha na comunicação com o servidor de aplicação' }, () => false);
				}
				else
				{
					react.setState({ error: xhr._response }, () => false);
				}
			};

			xhr.send(formdata);
		} 
	};

	render() {
		return (
			<ImageBackground source={require('../../images/doctor-background.png')} style={ styles.imgBackground }>
				
				<Container>

						<Spinner
							visible={this.state.loading}
							textContent={this.state.textContent}
							textStyle={styles.spinnerTextStyle} />
						<StatusBar hidden />
						
						<Logo source={require('../../images/logo-medico-consultor-branca.png')} resizeMode="contain" /> 
						
						<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
							
							<Text style={styles.titulo}>ACESSAR MÉDICO CONSULTOR</Text>
							
							<Input
								placeholder="Usuário"
								value={this.state.email}
								onChangeText={this.handleEmailChange}
								autoCapitalize="none"
								autoCorrect={false}
	              				placeholderTextColor="#FFFFFF"
								textAlign="auto"
							/>
							
							<Input
								placeholder="Senha"
								value={this.state.password}
								onChangeText={this.handlePasswordChange}
								autoCapitalize="none"
								autoCorrect={false}
								secureTextEntry
								placeholderTextColor="#FFFFFF"
								textAlign="auto"
							/>
							
							{this.state.error.length !== 0 && <ErrorMessage style={styles.errorMessage}>{this.state.error}</ErrorMessage>}
							
							<Button onPress={this.handleSignInPress}>
								<ButtonText>ENTRAR</ButtonText>
							</Button>

						</KeyboardAvoidingView>

				</Container>

			</ImageBackground>
		)
	}
}

const styles = StyleSheet.create({
	titulo: {
		color: "#FFF",
		fontSize: 18,
		fontStyle: "normal",
		lineHeight: 20,
		letterSpacing: 1.44,
		textAlign: "center",
		width: 300,
		height: 20,
	},
	imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1 
	},
	spinnerTextStyle: {
	    color: '#FFF'
	},
	errorMessage: {
	    width: '100%'
	},
});

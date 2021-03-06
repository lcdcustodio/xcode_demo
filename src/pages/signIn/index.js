import React, { Component } from 'react';
import { Alert, StatusBar, Text, StyleSheet, ImageBackground, Keyboard } from 'react-native';
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
			email: '',
			password: '',
			error: '',
			textContent: '',
			loading: false,
			keyboardSpace: 0
		}

		Keyboard.addListener('keyboardDidShow',(frames)=>{
            if (!frames.endCoordinates) return;
            this.setState({
				keyboardSpace: frames.endCoordinates.height
			});
		});
		
        Keyboard.addListener('keyboardDidHide',(frames)=>{
            this.setState({keyboardSpace:0});
        });
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

			let timer = setTimeout(() => {

				if (this.state.loading) {

					this.setState({ loading: false });

					Alert.alert(
						'Servidor lento ou indisponível',
						'O servidor não retornou um resultado dentro do período de 2 minutos, por favor tente novamente ou entre em contato com o suporte',
						[
							{
								text: 'OK', onPress: () => {}
							},
						],
						{
							cancelable: false
						},
					);
					
				}

		    }, 120000);
			
			const params = {
				username: this.state.email,
				password: this.state.password
			};

			const data = qs.stringify(params, { encode: false });

			api.post('/api/login',
				data
			)
			.then(response => {

				clearTimeout(timer);

				if(response && response.data && response.data.success) {

					AsyncStorage.removeItem('hospitalList');

					let content = response.data.content;
					
					Session.current.user = new User(content.name, content.profile);

					AsyncStorage.multiSet([
					    ["auth", JSON.stringify(params)],
					    ["userData", JSON.stringify(content)]
					], async() => {

						this.setState({loading: false});

						this.setState({ error: '' }, () => false);

						this.props.navigation.navigate("Hospitals");
				
			        });	
		        }	
		        else
		        {	    			        	
					this.setState({loading: false});

					this.setState({ error: response }, () => false);
		        }	

			}).catch(error => {

				clearTimeout(timer);
				
				this.setState({loading: false});

				if (error && error.response) {

					if(error.response.status == 401) {
						this.setState({ error: 'Usuário e senha não coincidem' }, () => false);
					} else if(error.response.status == 500) {
						this.setState({ error: 'Falha na comunicação com o servidor de aplicação' }, () => false);
					} else if(error.response.status == 502) {
						this.setState({ error: 'O servidor retornou um resultado inesperado, por favor, tente novamente' }, () => false);
					} else {
						this.setState({ error: error.message }, () => false);
					}
				}	
				else
				{
					this.setState({ error: error.message }, () => false);
				}		
			});
		} 
	};

	render() {
		return (
			<ImageBackground source={require('../../images/doctor-background.png')} style={ styles.imgBackground }>
				
				<Container style={{top: this.state.keyboardSpace ? -(this.state.keyboardSpace * .70) : 0}} >

						<Spinner
							visible={this.state.loading}
							textContent={this.state.textContent}
							textStyle={styles.spinnerTextStyle} />
						<StatusBar hidden />
						
						<Logo source={require('../../images/logo-medico-consultor-branca.png')} resizeMode="contain" /> 
							
							<Text style={styles.titulo}>ACESSAR MÉDICO CONSULTOR</Text>
							
							<Input
								style={styles.input}
								placeholder="Usuário"
								value={this.state.email}
								onChangeText={this.handleEmailChange}
								autoCapitalize="none"
								autoCorrect={false}
	              				placeholderTextColor="#FFFFFF"
								textAlign="auto"
							/>
							
							<Input
								style={styles.input}
								placeholder="Senha"
								value={this.state.password}
								onChangeText={this.handlePasswordChange}
								autoCapitalize="none"
								autoCorrect={false}
								secureTextEntry
								placeholderTextColor="#FFFFFF"
								textAlign="auto"
							/>
							
							{this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
							
							<Button onPress={this.handleSignInPress}>
								<ButtonText>ENTRAR</ButtonText>
							</Button>


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
	input: {
		fontSize: 18, 
		lineHeight: 20
	}
});

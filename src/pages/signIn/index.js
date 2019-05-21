import React, { Component } from 'react';

import { StatusBar, Text, StyleSheet, ImageBackground, Image } from 'react-native';

import api from '../../services/api';

import qs from "qs";

import {
	Container,
	Logo,
	Input,
	ErrorMessage,
	Button,
	ButtonText,
} from './styles';

export default class SignIn extends Component {
	
	state = {
		email: '',
		password: '',
		error: ''
	};

	handleEmailChange = (email) => {
		this.setState({ email });
	};

	handlePasswordChange = (password) => {
		this.setState({ password });
	};

	handleSignInPress = async () => {
				
		if (this.state.email.length === 0 || this.state.password.length === 0) {
			this.setState({ error: 'Por favor, preencha todos os campos' }, () => false);
		} else {
			
			const params = {
				username: this.state.email,
				password: this.state.password
			};

			const data = qs.stringify(params, { encode: false });

			api.post('/api/login', 
				data
			)
			.then(response => { 
				
				if(response.data.success)
				{
					this.props.navigation.navigate({ routeName: 'Hospitals' });
				}
			})
			.catch(error => {

				if(error.response.status == 401)
				{
					this.setState({ error: 'Usuário e senha não coincidem' }, () => false);
				}
				else if(error.response.status == 500)
				{
					this.setState({ error: 'Falha na comunicação com o servidor de aplicação' }, () => false);
				}
				
			});
		}
	};

	render() {
		return (
			<Container>

				 <StatusBar hidden />

					 <Logo source={require('../../images/logo-medico-consultor-branca.png')} resizeMode="contain" /> 

					<Text style={styles.titulo1}>ACESSAR MÉDICO CONSULTOR</Text>

					<Input
						placeholder="Endereço de E-mail"
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
					{this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
					<Button onPress={this.handleSignInPress}>
						<ButtonText>ENTRAR</ButtonText>
					</Button>
			</Container>
		)
	}
}

const styles = StyleSheet.create({

	    titulo1: {
		color: "#FFF",
		fontSize: 18,
		fontStyle: "normal",
		lineHeight: 20,
		letterSpacing: 1.44,
		textAlign: "center",
		width: 300,
		height: 20,
	}
	
	});
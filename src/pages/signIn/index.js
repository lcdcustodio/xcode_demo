import React, { Component } from 'react';
import { Alert, StatusBar, Text, StyleSheet, ImageBackground, Image } from 'react-native';
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
			const data = qs.stringify(params, { encode: false });
			api.post('/api/login',
				data
			)
			.then(response => {
				let content = response.data.content;
				Session.current.user = new User(content.name, content.profile);
				AsyncStorage.setItem('userData', JSON.stringify(content), () => {
		            if(response.data.success) {
						this.setState({ textContent: 'Sincronizando...' });
						api.get('/api/basedata/baseDataSync?lastDateSync=' + this.state.lastDateSync).then(res => {
							this.setState({loading: false});
							this.props.navigation.navigate("Hospitals", { baseDataSync: res.data.content.data });
						}).catch(err => {
							this.setState({loading: false});
						    console.log(err);
						});
					} else {
						console.log(response);
						this.setState({loading: false});
					}
		        });			
			}).catch(error => {
				this.setState({loading: false});
				console.log(error);
				if(error.response.status == 401) {
					this.setState({ error: 'Usuário e senha não coincidem' }, () => false);
				} else if(error.response.status == 500) {
					this.setState({ error: 'Falha na comunicação com o servidor de aplicação' }, () => false);
				}
			});
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
						<Text style={styles.titulo}>ACESSAR MÉDICO CONSULTOR</Text>
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
});

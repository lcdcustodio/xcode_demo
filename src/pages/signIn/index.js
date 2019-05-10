import React, { Component } from 'react';

import { StatusBar } from 'react-native';

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
		email: 'marcos.fonseca',
		password: '123456',
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
			this.setState({ error: 'Preencha usuário e senha para continuar!' }, () => false);
		} else {
			this.props.navigation.navigate({ routeName: 'Hospitals' });
		}
	};

	render() {
		return (
			<Container>
				<StatusBar hidden />
				<Logo source={require('../../images/copa-dor.png')} resizeMode="contain" />
				<Input
					placeholder="Endereço de e-mail"
					value={this.state.email}
					onChangeText={this.handleEmailChange}
					autoCapitalize="none"
					autoCorrect={false}
				/>
				<Input
					placeholder="Senha"
					value={this.state.password}
					onChangeText={this.handlePasswordChange}
					autoCapitalize="none"
					autoCorrect={false}
					secureTextEntry
				/>
				{this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
				<Button onPress={this.handleSignInPress}>
					<ButtonText>Entrar</ButtonText>
				</Button>
			</Container>
		)
	}
}

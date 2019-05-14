import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Header, Left, Button, Icon, Body, Title, Footer, FooterTab, Text } from 'native-base';

import Profile from "./profile"
import Exams from "./exams"
import Visits from "./visits"

export default class Patient extends Component {

	constructor(props) {
		super(props)
		this.state = { selectedTab: 'profile' }
	}

	navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.hospital.title
	});

	renderSelectedTab() {
		switch (this.state.selectedTab) {
			case 'profile':
				return (<Profile />);
				break;
			case 'exams':
				return (<Exams />);
				break;
			case 'photos':
				return (<Visits />);
				break;
			default:
		}
	}

	switchScreen(screen) {
		this.setState({ selectedTab: screen })
	}

	render() {
		return (
			<Container>
				<Header>
					<Left style={styles.header}>
						<Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={styles.icon} />
					</Left>
				</Header>
				<Content>
					{this.renderSelectedTab()}
				</Content>
				<Footer>
					<FooterTab>
						<Button vertical active={this.state.selectedTab === 'profile'} onPress={() => this.switchScreen('profile')}>
							<Icon name="person" />
							<Text>Perfil</Text>
						</Button>
						<Button vertical active={this.state.selectedTab === 'exams'} onPress={() => this.switchScreen('exams')}>
							<Icon name="apps" />
							<Text>Timeline</Text>
						</Button>
						<Button vertical active={this.state.selectedTab === 'photos'} onPress={() => this.switchScreen('photos')}>
							<Icon active name="camera" />
							<Text>Visitas</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		);
	}
}

const styles = StyleSheet.create({});
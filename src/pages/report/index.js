import React, { Component } from 'react';
import { StyleSheet, View, Alert, ScrollView, FlatList } from 'react-native';
import TextValue from '../../components/TextValue';
import { Content, ListItem, Text, Right, Body } from 'native-base';

export default class Report extends Component {

	constructor(props) {

		super(props);	
		
		this.state = {};

		console.log('Ok');
	}

	render() {
		
		return (
			<View>

				<Content>

					<ListItem itemDivider>
						<Text>Dados Básicos</Text>
					</ListItem> 

					<ListItem>
						<Body>
							<Text style={{fontWeight: 'bold'}}>Nome{"\n"}<TextValue value="Lorem ipsum" /></Text>
						</Body>
					</ListItem>

					<ListItem>
						<Body>
							<Text style={{fontWeight: 'bold'}}>Prontuário{"\n"}<TextValue value="Lorem ipsum" /></Text>
						</Body>
					</ListItem>

					<ListItem>
						<Body>
							<Text style={{fontWeight: 'bold'}}>Convênio{"\n"}<TextValue value="Lorem ipsum" /></Text>
						</Body>
					</ListItem>

				</Content>

			</View>
		);
	}
}
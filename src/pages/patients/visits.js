import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

const screenHeight = Math.round(Dimensions.get('window').height - 130 );

export default class Visitas extends React.Component {
	
	constructor(props) {

		super(props);
		
		this.state = {
			visitas: this.props.visitas
		}
	}

	appoint() {
		alert('Botão Pressionado')
	}

	renderItem = ({ item, index }) => (
		<View>
			<Text style={[ styles.title, styles.niceBlue ]}> 
				<Text style={[styles.description, styles.niceBlue]}>Visita {item.observationDate} </Text>
			</Text>
			<Text style={ styles.description}>
				{item.observation}
			</Text>
		</View>
	);

	render() {
		return (
			<View style={ styles.container }>

				<FlatList
					data={this.state.visitas}
					keyExtractor={item => item.id}
					renderItem={this.renderItem} />

				<View style={ styles.rowButtonCircle }>
					<LinearGradient colors={['#035fcc', '#023066']} style={ [styles.circle, styles.borderCircle ]} >
						<Icon type="FontAwesome5" name="id-badge" style={ styles.iconCircle } onPress={this.appoint} />
						<Text style={ styles.textCircle } > VISITAR </Text>
					</LinearGradient>
				</View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		height: screenHeight
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
    color: "#333", 
    padding: 5,
    width: 300, 
	},
	niceBlue: {
		color:  "#19769F", 
		paddingLeft: 2
	},
	description : {
		width: '100%',
		paddingTop: '3%',
		paddingBottom: '5%',
    fontFamily: "Verdana",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#9f9f9f" 
	},
	rowButtonCircle: {
		marginTop: '5%',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	circle: {
		paddingTop: '4%',
		width: 80,
		height: 80,
		borderRadius: 80/2,
		flexDirection: 'column',
		alignItems: 'center'
	},
	borderCircle: {
		borderColor: "#707070",
		borderStyle: "solid",
  	borderWidth: 1,
	},
	iconCircle: {
		color: 'white'
	},
	textCircle: {
		fontFamily: 'Gotham Rounded', 
		fontSize:12, 
		fontWeight: "normal", 
		fontStyle: "normal", 
		letterSpacing: 0, 
		color: 'white' 
	}
});
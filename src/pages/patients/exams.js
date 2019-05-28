import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import Timeline from '../../components/Timeline'
import LinearGradient from 'react-native-linear-gradient';

const screenHeight = Math.round(Dimensions.get('window').height - 130 );

export default class Exams extends React.Component {
	
	constructor(props) {

		super(props);
		
		this.state = {
			exames: this.props.exames
		}
	}
	
	appoint() {
		alert('Botão Pressionado')
	}

	renderDetail(row) {
	    return (
			<View style={styles.description}>
				<Text style={styles.title}> {row.examDisplayName} </Text>
				<Text style={[ styles.highlight, {color: (row.examHighCost ? '#bfcc4d' : '#000000'), backgroundColor: (row.examHighCost ? '#cf175c' : '#ffffff') }]}> {row.examHighCost ? 'Alto Custo' : '' } </Text>
			</View>
	    )
	}

	render() {
	    return (
			<View style={styles.container}>
				
				<Timeline 
					data={this.state.exames}
					renderEvent={this.renderDetail}
					lineColor={'#b1b1b1'} 
					circleColor={'#005cd1'} 
					innerCircle={'dot'} 
					circleSize={20}
					renderFullLine={true} 
					lineWidth={4}
					timeStyle={styles.date}
					renderDetail={this.renderDetail} />

				<View style={ styles.rowButtonCircle }>
					<LinearGradient colors={['#035fcc', '#023066']} style={ [styles.circle, styles.borderCircle ]} >
						<Icon type="Entypo" name="sound-mix" style={ styles.iconCircle } onPress={this.appoint} />
						<Text style={ styles.textCircle } > APONTAR </Text>
					</LinearGradient>
				</View>
			</View>
	    );
	}
}

const styles = StyleSheet.create({
	container: {
		height: screenHeight,
	},
	date: {
		fontFamily:'Segoe UI', 
		fontWeight:'400', 
		fontStyle:'normal', 
		color:'#9d9d9d',
	},
	description: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontFamily:'Segoe UI', 
		fontSize:18, 
		fontWeight:'300', 
		fontStyle:'normal', 
		lineHeight:19, 
		letterSpacing:0, 
		color:'#000000',
	},
	highlight: {
		width: '35%',
		height: '140%',
		padding: '3%',
		paddingLeft: '5%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily:'Segoe UI-Semibold', 
		fontWeight:'400', 
		fontSize:13, 
		fontStyle:'normal', 
		lineHeight:13,
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
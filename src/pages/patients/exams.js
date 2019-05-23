import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import Timeline from '../../components/Timeline'
import LinearGradient from 'react-native-linear-gradient';

const screenHeight = Math.round(Dimensions.get('window').height - 130 );

export default class Exams extends React.Component {
	
	constructor() {
		super();
		this.state = {
			timeline: [
				{time: '01/05/2019', title: 'Exame Raio-X', lineColor: '#cf175c', circleColor: '#cf175c', description: 'Alto Custo' },
				{time: '13/04/2019', title: 'Exame Raio-X', lineColor: '#bfcc4d', circleColor: '#bfcc4d', description: 'Baixo Custo' },
				{time: '15/04/2019', title: 'Exame Raio-X', lineColor: '#cf175c', circleColor: '#cf175c', description: 'Alto Custo' },
				{time: '13/04/2019', title: 'Exame Raio-X', lineColor: '#bfcc4d', circleColor: '#bfcc4d', description: 'Baixo Custo' },
				{time: '15/04/2019', title: 'Exame Raio-X', lineColor: '#cf175c', circleColor: '#cf175c', description: 'Alto Custo' },
				{time: '13/04/2019', title: 'Exame Raio-X', lineColor: '#bfcc4d', circleColor: '#bfcc4d', description: 'Baixo Custo' },
				{time: '15/04/2019', title: 'Exame Raio-X', lineColor: '#cf175c', circleColor: '#cf175c', description: 'Alto Custo' },
				{time: '13/04/2019', title: 'Exame Raio-X', lineColor: '#bfcc4d', circleColor: '#bfcc4d', description: 'Baixo Custo' },
			]
		}
	}
	
	appoint() {
		alert('Botão Pressionado')
	}

	renderDetail(rowData, sectionID, rowID) {
		let backgroundColor = ''
		let color = ''

		if(rowData.description === 'Alto Custo') {
			backgroundColor = '#cf175c'
			color = '#ffffff'
		} else {
			backgroundColor = '#bfcc4d'
			color = '#000000'
		}

    return (
			<View style={styles.timelineRowDescription}>
				<Text style={styles.timelineTitle}> {rowData.title} </Text>
				<Text style={[ styles.timelineHighlight, {color: color, backgroundColor: backgroundColor }]}> { rowData.description } </Text>
			</View>
    )
  }

	render() {
		
    return (
			<View style={ styles.container}>
				
					<Timeline 
						data={this.state.timeline}
						renderEvent={this.renderDetail}
						lineColor={'#b1b1b1'} 
						circleColor={'#005cd1'} 
						innerCircle={'dot'} 
						circleSize={20}
						renderFullLine={true} 
						lineWidth={4}
						timeStyle={ styles.timelineDate }
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
	timelineDate: {
		fontFamily:'Segoe UI', 
		fontWeight:'400', 
		fontStyle:'normal', 
		color:'#9d9d9d',
	},
	timelineRowDescription: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	timelineTitle: {
		fontFamily:'Segoe UI', 
		fontSize:18, 
		fontWeight:'300', 
		fontStyle:'normal', 
		lineHeight:19, 
		letterSpacing:0, 
		color:'#000000',
	},
	timelineHighlight: {
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
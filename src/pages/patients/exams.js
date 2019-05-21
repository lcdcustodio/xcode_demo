import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import Timeline from 'react-native-timeline-listview'

export default class Exams extends React.Component {
	
	constructor() {
		super();
		this.data = [
      {time: '01/05/2019', title: 'Exame Raio-X', lineColor: '#cf175c', circleColor: '#cf175c', description: 'Alto Custo' },
      {time: '30/04/2019', title: 'Exame Raio-X', lineColor: '#bfcc4d', circleColor: '#bfcc4d', description: 'Baixo Custo' },
      {time: '15/04/2019', title: 'Exame Raio-X', lineColor: '#cf175c', circleColor: '#cf175c', description: 'Alto Custo' },
      {time: '13/04/2019', title: 'Exame Raio-X', lineColor: '#bfcc4d', circleColor: '#bfcc4d', description: 'Baixo Custo' },
      {time: '27/08/2017', title: 'Exame Raio-X', lineColor: '#cf175c', circleColor: '#cf175c', description: 'Alto Custo' }
    ]
	}
	
	appoint() {
		alert('Apontar')
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
			<View style={{flexDirection: "row", alignItems: 'center', justifyContent: "space-between", marginTop: '-5%'}}>
				<Text style={{alignSelf: 'flex-start', fontFamily:'Segoe UI', fontWeight:'400', fontSize:18, fontStyle:'normal', color:'#000000'}}> 
					{rowData.title}
					{'\n'}
				</Text>

				<Text style={{alignSelf: 'flex-end', fontFamily:'Segoe UI-Semibold', fontWeight:'400', fontSize:13, fontStyle:'normal', lineHeight:13, color: color, backgroundColor: backgroundColor, padding: '2%', width:'32%', height:'60%' }}>
					{ rowData.description }
				</Text>
			</View>
    )
  }

	render() {
		
    return (
			<View style={ styles.container }>
				<Timeline 
					data={this.data}
					renderEvent={this.renderDetail}
					lineColor={'#b1b1b1'} 
					circleColor={'#005cd1'} 
					innerCircle={'dot'} 
					circleSize={20}
					renderFullLine={true} 
					lineWidth={4}
					timeStyle={ styles.timeline }
					renderDetail={this.renderDetail}
					/>

				<TouchableOpacity onPress={this.appoint} style={ styles.containerButtonTouch }>
					<View style={ styles.containerButton }>
						<View style={styles.buttonCircle}>
							<Icon type="Entypo" name="sound-mix" style={ styles.buttonIconCircle } />
							<Text style={ styles.buttonTextCircle } > {'\n'} APONTAR </Text>
						</View>
					</View>
				</TouchableOpacity>

			</View>
    );
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop:'10%', 
		marginLeft:'2%', 
		borderWidth: 0.0, 
		borderColor: '#d6d7da',
	},
	timeline: {
		fontFamily:'Segoe UI', 
		fontWeight:'400', 
		fontStyle:'normal', 
		color:'#9d9d9d'
	},
	containerButtonTouch: {
		marginTop:'35%', 
		marginLeft:'35%', 
		width:'30%', 
	},
	containerButton: {
		marginTop: '10%',
		alignItems: 'center', 
		borderWidth: 0, 
		borderColor: '#d6d7da'
	},
	buttonCircle: {
		padding: '5%',
		width: 100,
		height: 100,
		borderRadius: 100/2,
		backgroundColor: '#035FCC',
		color: '#FFFFFF',
		borderColor: "#707070",
		borderStyle: "solid",
  	borderWidth: 1,
	},
	buttonIconCircle: {
		marginTop:'20%',
		marginLeft:'33%',
		color: 'white'
	},
	buttonTextCircle: {
		marginLeft:'15%',
		fontFamily: 'Gotham Rounded', 
		fontSize:12, 
		fontWeight: "normal", 
		fontStyle: "normal", 
		letterSpacing: 0, 
		color: 'white' 
	}
});
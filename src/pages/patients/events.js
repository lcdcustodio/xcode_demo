import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Event from '../../model/Event';
import Exam from '../../model/Exam';
import MedicineReintegration from '../../model/MedicineReintegration';
import Timeline from '../../components/Timeline';

export default class Events extends Component {
	
	constructor(props) {
		super(props);
		this.state = { eventos: this._loadEvents() };
	}
	
	render() {
		return (
			<View style={styles.container}>
				<Timeline 
					data={this.state.eventos}
					renderEvent={this._renderDetail}
					lineColor={'#b1b1b1'} 
					circleColor={'#005cd1'} 
					innerCircle={'dot'} 
					circleSize={20}
					renderFullLine={true} 
					lineWidth={4}
					timeStyle={styles.date}
					renderDetail={this._renderDetail} />
				<View style={ styles.rowButtonCircle }>
					<LinearGradient colors={['#035fcc', '#023066']} style={ [styles.circle, styles.borderCircle ]} >
						<Icon type="Entypo" name="sound-mix" style={ styles.iconCircle } onPress={this._appoint} />
						<Text style={ styles.textCircle } > APONTAR </Text>
					</LinearGradient>
				</View>
			</View>
		);
	}

	_renderDetail = (row) => {
		if (row instanceof Exam) {
			return (
				<View style={styles.description}>
					<Text style={styles.title}>{row.examDisplayName}</Text>
					{ row.examHighCost && 
						<Text style={styles.highlight}>Alto Custo</Text>
					}
				</View>
			);
		} else if (row instanceof MedicineReintegration) {
			return (
				<View style={styles.description}>
					<Text style={styles.title}>{row.observation}</Text>
				</View>
			);
		}
	}

	_loadEvents = () => {
		let events = [];
		this.props.exames.forEach( (exam) => { events.push(new Exam(exam)) } );
		if (this.props.reconciliacaoMedicamentosa) {
			events.push(new MedicineReintegration(this.props.reconciliacaoMedicamentosa));
		}
		events.sort(Event.compare);
		return events;
	}

	_appoint = () => {
		alert('Botão Pressionado')
	}
}

const styles = StyleSheet.create({
	container: {
		height: Math.round(Dimensions.get('window').height - 130 ),
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
		color: '#bfcc4d',
		backgroundColor: '#cf175c',
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

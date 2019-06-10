import React from 'react';
import { Text, View, FlatList, Modal, TextInput, Switch, TouchableOpacity, Alert } from 'react-native';
import { Icon, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style'
import moment from 'moment';
import _ from 'lodash'
import uuid from 'uuid/v4';

export default class Visitas extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			patient: this.props.patient,
			modalVisible: false,
			visit: {
				uuid: null,
				observation: '',
				alert: false,
				observationDate: '',
				endTracking: false,
				medicalRelease: false,
				removedAt: '',
			},
			update: false
		}
	}

	save = _ => {
		const newVisit = this.state.visit;
		let hasErrors = false;
		if(newVisit.observation.length === 0 ){
			Alert.alert('Atenção', 'O campo observação é obrigatório!',
							[{text: 'OK', onPress: () => {}},],
							{cancelable: false});
		} else {
			if(this.state.update){
				this.state.patient.observationList.forEach( element => {
				   if(this.isaSameVisit(newVisit, element)){
					   this.remove(element)
					} 
			  	}); 
			} else {
			   this.state.patient.observationList.forEach( element => {
				   if(this.isToday(element.observationDate)){
						hasErrors = true;
					} 
				}); 
			}
			
			if(!hasErrors){
				this.state.patient.observationList.push(newVisit)
				this.props.updatePatient(this.state.patient);
				this.toggleModal()
			} else {
				Alert.alert('Atenção', 'Visita já cadastrada!',
							[{text: 'OK', onPress: () => {}},],
							{cancelable: false});
			}
		}
		
	}

	alertToRemove = patient => {
		Alert.alert(
			'Atenção',
			'Deseja remover o item selecionado?',
			[{ text: 'Cancel',onPress: () => console.log('Cancel Pressed'), style: 'cancel'  },
			  {text: 'OK', onPress: () => {
				this.remove(patient);
			  }},
			],
			{cancelable: false},
		  );
	}

	showVisit = patient =>{
		this.toggleModal()
		this.state.visit = patient;
		this.state.update = true
	}

	toggleSwitch = alert => {
		this.setState({
			visit:{
				...this.state.visit,
				alert
			} 
		})
	}

	addObservation = observation => {
		this.setState({
			visit:{
				...this.state.visit,
				observation
			} 
		})
	}

	toggleModal = _ => {
		debugger;
	    this.setState({modalVisible: !this.state.modalVisible})
	}

 	appoint = _ => {
		 this.setState({ 
		 modalVisible: true,
		 update: false, 
		 visit: {
			uuid: uuid(),
			observation: '',
			alert: false,
			observationDate: moment().format(),
			endTracking: false,
			medicalRelease: false,
			removedAt: '',
			}
		})
	}

	showModal = _ => {
		this.setState({modalVisible: false});
	}

	isToday(date) {
		const today = moment()
		let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
		let diffDays = today.diff(dateFormatted, 'days')
		return diffDays === 0 ? true : false
	}

	renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={_=>this.showVisit(item)}
			onLongPress={_=>this.alertToRemove(item)} >
			<View>
				<Text style={[ styles.title, styles.niceBlue ]}> 
					<Text>Visita </Text>
					<Text style={[styles.description, styles.niceBlue]}> 
						{this.isToday(item.observationDate) ? 'Hoje' : 	moment(item.observationDate).format('DD/MM/YYYY')}
					 </Text>
				</Text>
				<Text style={ styles.description}>{item.observation}</Text>
			</View>
		</TouchableOpacity>
	);

	remove(patient) {
		const item = this.state.patient.observationList.filter(item => item.uuid !== patient.uuid);
		this.state.patient.observationList = item;
		this.props.updatePatient(this.state.patient);
	}

	isaSameVisit(newVisit, oldVisit) {
		return newVisit.uuid === oldVisit.uuid;
	}

	showVisitButton = visits => {
		  if (!visits[0] || !this.isToday(visits[0].observationDate)){
			return <View style={ styles.rowButtonCircle }>
						<LinearGradient colors={['#035fcc', '#023066']} style={ [styles.circle, styles.borderCircle ]} >
							<Icon type="FontAwesome5" name="id-badge" style={ styles.iconCircle } onPress={this.appoint} />
							<Text style={ styles.textCircle } > VISITAR </Text>
						</LinearGradient>
					</View>
		} else {
			return  <View style={ styles.rowButtonCircle }>
						<LinearGradient colors={['#808080', '#696969']} style={ [styles.circle, styles.borderCircle ]} >
							<Icon type="FontAwesome5" name="id-badge" style={ styles.iconCircle }  />
							<Text style={ styles.textCircle } > VISITADO </Text>
						</LinearGradient>
					</View>
		}
	}
	
	render() {
		let listOfOrderedObservationDate =[]
		if(this.props.patient.observationList){
			listOfOrderedObservationDate = _.orderBy(this.props.patient.observationList, ['observationDate'], ['desc'])
		}
		console.log("listOfOrderedObservationDate", listOfOrderedObservationDate)
		return (
			<View style={ styles.container }>
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() =>{ console.log("Modal has been closed.") } }>
						<View style={styles.overlay}>
							<View style={styles.modal}>
							
								<View style={styles.viewVisit}>
										<Button backgroundColor={'#005cd1'} onPress={this.toggleModal}>
											<Icon type="AntDesign" name="close" style={styles.close} />
										</Button>
										<Text style={styles.textVisit}>Visita</Text>
										<Button backgroundColor={'#005cd1'} onPress={this.save}>
											<Icon type="AntDesign" name="save" style={styles.save} />
										</Button>
								</View>

								<View style={styles.alertInformation}>
									<View style={{order: 1 , width:'10%', paddingLeft: 2}} >
										<Icon type="Feather" name="alert-circle" style={{color: 'red', fontSize: 25}} />
									</View>
									<View style={{order: 2, width:'70%'}}>
										<Text style={{fontSize: 19, fontWeight: "bold"}}>Alerta</Text>
									</View>
									<View style={{order: 3, width:'20%', paddingLeft: 2}}>
										<Switch onValueChange={this.toggleSwitch} value={this.state.visit.alert} style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 } ]}}/>
									</View>	
								</View>
								<View style={styles.observation}>
									<Text style={styles.textObservation}>Observação</Text>
									<TextInput multiline={true}	 numberOfLines={8} maxHeight={'80%'} style={styles.textArea} value={this.state.visit.observation} onChangeText = {observation => this.addObservation(observation)} />
								</View>
							</View>
						</View>
					</Modal>	

				<FlatList
					data={listOfOrderedObservationDate}
					keyExtractor={item => item.uuid}
					extraData={this.props}
					renderItem={this.renderItem}/>

				{this.showVisitButton(listOfOrderedObservationDate)}

			</View>
		);
	}
}
import React from 'react';
import { Text, View, FlatList, Modal, TextInput, Switch, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style'
import moment from 'moment';

export default class Visitas extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			patient: this.props.patient,
			modalVisible: false,
			visit: {
				observation: null,
				alert: false,
				observationDate: null
			},
		}
	}

	save = _ => {
		this.state.visit.observation = moment();
		this.state.patient.observationList.push(this.state.visit)
		this.props.updatePatient(this.state.patient);
		this.toggleModal()
		console.log("patient saved> ", patient)
	}

	remove = item => {
		console.log("remove: ", item)
		//this.state.patient.filter(item => key !== item);
	}

	update = item => {
		this.toggleModal()
		console.log("item.observationDate", item.observationDate, " | item.alert", item.alert)
		
		let visit ={
			observation: item.observationDate,
			alert: item.alert
		}
		
		console.log("visit", visit)

//		this.save(visit)
	}

	toggleSwitch = (alert) => {
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
	    this.setState({modalVisible: !this.state.modalVisible})
	}

 	appoint = _ => {this.setState({ 
		 modalVisible: true,
		 visit: {
			...this.state.visit
		 }
		}) }

	showModal = _ => {
		this.setState({modalVisible: false});
	}

	renderItem = ({ item, index }) => (
		<TouchableOpacity
			onPress={_ =>this.update(item)}
			onLongPress={_ =>this.remove(item.observationDate)} >
			<View>
				<Text style={[ styles.title, styles.niceBlue ]}> Visita {index+1} |
					<Text style={[styles.description, styles.niceBlue]}> {moment(item.observationDate).format('DD/MM/YYYY')} </Text>
				</Text>
				<Text style={ styles.description}>
					{item.observation}
				</Text>
			</View>
		</TouchableOpacity>
	);

	render() {
		return (
			<View style={ styles.container }>
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() =>{ console.log("Modal has been closed.") } }>
						<View style={styles.overlay}>
							<View style={{backgroundColor: '#F8F8FF', borderRadius: 4, flexDirection: "row", flexWrap: 'wrap', height: '58%', marginTop: '25%', padding: 1}}>
							
								<View style={{flexDirection: "row", width: '100%', justifyContent: 'space-between', backgroundColor: "#005cd1", alignItems: 'center'}}>
										<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'profile'} onPress={this.toggleModal}>
											<Icon type="AntDesign" name="close" style={{color: 'white', fontSize: 18, marginTop: 1, marginBottom: 1, marginLeft: '12%'}} />
										</Button>
										<Text style={{fontWeight: "bold", fontSize: 18, color: 'white'}}>Visita</Text>
										<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'profile'} onPress={this.save}>
											<Icon type="AntDesign" name="save" style={{color: 'white', fontSize: 18, marginTop: 1, marginBottom: 1, marginRight: '12%'}} />
										</Button>
								</View>

								<View style={{flexDirection: "row", width: '100%', flexWrap: 'wrap', alignItems:'center', paddingTop: '10%'}}>
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
								<View style={{flexDirection: "row", width: '100%', flexWrap: 'wrap', paddingTop: '15%'}}>
									<Text style={{fontWeight: "bold", width: '100%', fontSize: 17}}>Observação</Text>
									<TextInput multiline={true}	 numberOfLines={8} style={styles.textArea} value={this.state.visit.observation} onChangeText = {observation => this.addObservation(observation)} />
								</View>
							</View>
						</View>
					</Modal>	

				<FlatList
					data={this.props.patient.observationList}
					keyExtractor={item => item.uuid}
					extraData={this.props}
					renderItem={this.renderItem}/>

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


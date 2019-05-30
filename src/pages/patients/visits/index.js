import React from 'react';
import { Text, View, FlatList, Modal, TextInput, Switch } from 'react-native';
import { Icon, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style'
import moment from 'moment';

export default class Visitas extends React.Component {
	
	constructor(props) {

		super(props);
		
		this.state = {
			visitas: this.props.visitas,
			modalVisible: false,
			switchValue:false
		}
	}

	toggleSwitch = (value) => {
		this.setState({switchValue: value})
 }

 appoint = _ => {this.setState({ modalVisible: true}) }

showModal = _ => {
	this.setState({modalVisible: false});
}

	renderItem = ({ item, index }) => (
		<View>
			<Text style={[ styles.title, styles.niceBlue ]}> Visita {index+1} |
				<Text style={[styles.description, styles.niceBlue]}> {moment(item.observationDate).format('DD/MM/YYYY')} </Text>
			</Text>
			<Text style={ styles.description}>
				{item.observation}
			</Text>
		</View>
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
											<View style={{backgroundColor: 'white', borderRadius: 4, flexDirection: "row", flexWrap: 'wrap'}}>
											
												<View style={{flexDirection: "row", width: '100%', justifyContent: 'space-between', backgroundColor: "#005cd1", alignItems: 'center'}}>
														<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'profile'} onPress={() => console.log("sair")}>
															<Text style={{fontSize: 14, color: 'white'}}> X </Text>
														</Button>
														
														<Text style={{fontWeight: "bold", fontSize: 16, color: 'white'}}>Visita</Text>
														
														<Button backgroundColor={'#005cd1'} vertical active={this.state.selectedTab === 'profile'} onPress={() => console.log("salvando...")}>
															<Text style={{fontSize: 14, color: 'white'}}>Salvar</Text>
														</Button>
												</View>
												<View style={{flexDirection: "row", width: '100%', flexWrap: 'wrap'}}>
															<View style="{{flexDirection: 'column'}}">
																<Icon type="Feather" name="alert-circle" style={{color: '#005cd1', fontSize: 18, marginTop: 3, marginBottom: 3, marginLeft: 10}} />
															<Text>Alerta</Text>
															</View>
															<View>
																<Switch onValueChange={this.toggleSwitch} value={this.state.switchValue} style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}/>
															</View>
												</View>
												<View style={{flexDirection: "row", width: '100%', flexWrap: 'wrap'}}>
														<Text style={{fontWeight: "bold", width: '100%'}}>Observação</Text>
														<TextInput multiline={true}	 numberOfLines={8} style={styles.textArea} value={this.state.text} />
												</View>
											</View>
										</View>
							</Modal>	

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


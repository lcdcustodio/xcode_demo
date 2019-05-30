import React from 'react';
import { Text, View, FlatList, Modal, TextInput, Button, Switch } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style'
import moment from 'moment';

export default class Visitas extends React.Component {
	
	constructor(props) {

		super(props);
		
		this.state = {
			//visitas: this.props.visitas,
			visitas: [
				{
						uuid: "380297CE-F347-4947-A892-5BA97E42898C",
						observationDate: "2018-10-18T16:00:28+0000",
						alert: true,
						medicalRelease: false,
						endTracking: false,
						observation: "Piora da função renal progrediu. Respondeu parcialmente ao aumento da hidratação e ajuste de drogas. USG realizado ontem mostra imergem compatível com abscesso renal. Antibiótico guiado por cultura. Programado novo USG para reavaliação amanhã. ",
						removedAt: null
				},
				{
						uuid: "4074A942-A772-4D8B-91A8-FC1077EE6583",
						observationDate: "2018-10-12T15:53:30+0000",
						alert: false,
						medicalRelease: false,
						endTracking: false,
						observation: "Manteve evolução clínica e laboratorial favorável. Melhora importante dos sintomas. Hemodinamicamente estável. Transferido para a UI. ",
						removedAt: null
				},
				{
						uuid: "5BA3E684-9350-4085-8CB9-8E5C3ED620CF",
						observationDate: "2018-10-26T18:18:13+0000",
						alert: true,
						medicalRelease: true,
						endTracking: true,
						observation: "Paciente recebeu alta hospitalar. ",
						removedAt: null
				}
		],
			modalVisible: false,
			switchValue:false
		}
	}

	toggleSwitch = (value) => {
		this.setState({switchValue: value})
 }

	appoint = _ => {this.setState({ modalVisible: true}) }

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
											
												<View style={{flexDirection: "row", width: '100%', justifyContent: 'space-between'}}>
														<Text><Button onPress="">Cancelar</Button></Text>
														<Text style={{fontWeight: "bold"}}>Visita</Text>
														<Text>Salvar</Text>
												</View>
												<View style={{flexDirection: "row", width: '100%', flexWrap: 'wrap'}}>
															<View style="{{flexDirection: 'column'}}">
															<Icon type="Feather" name="alert-circle"/>
															<Text>Alerta</Text>

															</View>
												</View>
												<View style={{flexDirection: "row", width: '100%', flexWrap: 'wrap'}}>
														<Text style={{fontWeight: "bold", width: '100%'}}>Observação</Text>
														<TextInput multiline={true}	 numberOfLines={8} style={styles.textArea} value={this.state.text} />
												</View>

											{/* 	<View style={{flexDirection: "row", alignItems: 'center', padding: 5}}>
													<View style={{flexDirection: "row", width: '100%'}}>
														<View style="{{alignSelf: 'flex-start', flexDirection: 'row', backgroundColor: '#DDD', borderWidth: 1, borderStyle: 'solid', borderColor: 'black'}}">
															<View>
															<Icon type="Feather" name="alert-circle"/>
															</View>
															<View><Text>Alerta</Text></View>
														</View>
														<View style="{{alignSelf: 'flex-end'}}">
															<Switch onValueChange = {this.toggleSwitch} value = {this.state.switchValue}/>
														</View>
													</View>
													<View style={{flexDirection: "column", width: '100%', marginTop: '10%'}}>
														<Text style={{fontWeight: "bold"}}>Observação</Text>
														<TextInput multiline={true}	 numberOfLines={8} style={styles.textArea} value={this.state.text} />
													</View>
												</View> */}

											
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


import React from 'react';
import { View, StyleSheet, TextInput, Alert} from 'react-native';
import { Container, Content, Header, Left, Body, Icon, Text, Title, Right } from 'native-base';
import TextValue from '../../../../components/TextValue'
import ModalList from '../../../../components/ModalList'
import ModalListSearchable from '../../../../components/ModalListSearchable'
import moment from 'moment';
import Uuid from 'uuid/v4';
import data from '../../../../../data.json';

export default class Recommendation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {	
			specialty: data.specialty, 
			recommendationType: 'Selecione',
			modalRecommendationTypeVisible: false,
			modalSpecialtyVisible: false,
			listRecommendationType: [
				{key: 1, value: 'WELCOME_HOME', label: 'WELCOME HOME'},
				{key: 2, value: 'INDICACAO_AMBULATORIO', label: 'INDICAÇÃO AMBULATORIO'},
				{key: 3, value: 'RECOMENDACAO_MEDICAMENTOSA', label: 'RECOMENDAÇÃO MEDICAMENTOSA'}
			],
			recommendation: {
				uuid: null,
				performedAt: null,
				observation: ''
			},
			update: false
		}
	}
	
	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		let update = this.props.navigation.state.params.update;
		let uuid, date;
		
		if(update){
			uuid =  this.props.navigation.state.params.patient.uuid;
			date = this.props.navigation.state.params.patient.performedAt;
		} else {
			uuid =  Uuid();
			date = moment();
		}

		this.setState({
			recommendation: {
				...this.state.recommendation, 
				uuid: uuid, 
				performedAt: date 
			},
			update: update
		});
	});

	save = _ => {
		let patient = this.props.navigation.state.params.patient;
		let update = this.state.update;

		if(!update && this.state.recommendationType === 'Selecione'){
			this.showAlertMsg("Selecione uma recomendação")
		} else {
			if(this.saveRecommendation(patient)){
				this.props.navigation.navigate("PatientDetail", { patient, selectedTab: 'events'});
			}  
		}
		
	}

	clearState = _ => {
		this.setState({
			...this.state,
			recommendationType: 'Selecione', 
			recommendation: {
				uuid: null,
				performedAt: null,
				observation: ''
			},
			modalRecommendationTypeVisible: false,
			modalSpecialtyVisible: false,
		})
	}

	toggleModalRecommendationType = () => {
		this.setState({
			modalRecommendationTypeVisible: !this.state.modalRecommendationTypeVisible
		})
	}

	toggleModalSpecialty = () => {
		this.setState({
			modalSpecialtyVisible: !this.state.modalSpecialtyVisible 
		})
	}

	addRecommendation = recommendationType => {
		this.setState({
			recommendationType: recommendationType.item,
			recommendation: {
				...this.state.recommendation, 
			}
		})
		this.toggleModalRecommendationType()
	}

	addObservation = observation => {
		this.setState({ 
			recommendation :  {
				...this.state.recommendation,
				observation
			}
		})
	}

	showAlertMsg= item =>{Alert.alert('Atenção', item,[{text: 'OK', onPress: () => {}}],{cancelable: false});}

	selectedRecommendationWelcomeHomeIndication = patient =>{
		const indicationItem = this.state.listRecommendationType[0]
		if (this.state.recommendationType === indicationItem ) {
			if(patient.recommendationWelcomeHomeIndication && !this.state.update){
				this.showAlertMsg(indicationItem.label + " já cadastrado!")
			} else {
				patient.recommendationWelcomeHomeIndication = this.state.recommendation;
				return true;
			}	
		}
	}

	selectedRecommendationClinicalIndication = patient =>{
		const clinicalIndicationItem = this.state.listRecommendationType[1]
		if (this.state.recommendationType === clinicalIndicationItem) {
			if(patient.recommendationClinicalIndication && !this.state.update){
				this.showAlertMsg(clinicalIndicationItem.label + " já cadastrado!")
			} else{
				if(!this.state.recommendation.specialtyId){
					this.showAlertMsg("Selecione uma especialidade")
				} else {
					patient.recommendationClinicalIndication = this.state.recommendation;
					return true;
				}
			} 

		}
	}

	selectedRecommendationMedicineReintegration = patient =>{
		const reintegrationItem = this.state.listRecommendationType[2]
		if (this.state.recommendationType === reintegrationItem ) {
			if(patient.recommendationMedicineReintegration && !this.state.update){
				this.showAlertMsg(reintegrationItem.label + " já cadastrado!")
			} else {
				patient.recommendationMedicineReintegration =  this.state.recommendation;
				return true;
			}
		} 
	}

	saveRecommendation(patient) {
		return this.selectedRecommendationMedicineReintegration(patient) || this.selectedRecommendationWelcomeHomeIndication(patient) || this.selectedRecommendationClinicalIndication(patient);
	}

	recommendationType (item) {
		const recommendation = this.state.listRecommendationType
		if (item == recommendation[0].value){
			return recommendation[0].label;
		} else if(item == recommendation[1].value){
			return recommendation[1].label;
		} else if (item == recommendation[2].value){
			return recommendation[2].label;
		} else {
			return item
		}
	}

	showViewSpecialty =_=>{

		let update = this.props.navigation.state.params.update;

		if(update){
			let patient = this.props.navigation.state.params.patient;
			if( patient.recommendationType === this.state.listRecommendationType[1].value){
				return 	<View style={ [styles.column100] }>
							<Text sytle={styles.textDisable}>{patient.recommendationClinicalIndication.specialtyDisplayName}</Text>
						</View>
			}
		} else {
			if(this.state.recommendationType === this.state.listRecommendationType[1]){	
				return 	<View style={ [styles.column100] }>
							<TextValue 	marginLeft="5" marginTop="2" marginBottom="2" press={ this.toggleModalSpecialty } color={'#0000FF'} value={ this.state.recommendation.specialtyDisplayName ? this.state.recommendation.specialtyDisplayName : 'Selecione' }  />
						</View>
			}
		}
		
	}
	
	showRecommendationType = _ =>{
		let update = this.props.navigation.state.params.update;
		
		if(update){
			let patient = this.props.navigation.state.params.patient;
			return <Text sytle={styles.textDisable}>{this.recommendationType(patient.recommendationType)}</Text>
		} else {
			return <TextValue 	marginLeft="2" marginTop="2" marginBottom="2" press={ this.toggleModalRecommendationType } color={'#0000FF'} value={ this.state.recommendationType === 'Selecione' ? this.state.recommendationType : this.state.recommendationType.label  }  />
		}
	}

	handleSpecialtyId = (specialty) => {

		this.setState({
			recommendation: {
				...this.state.recommendation,
				specialtyId: specialty.item.id,
				specialtyDisplayName: specialty.item.normalizedName
			}
		})

		this.toggleModalSpecialty()
	}

	render() {
		return (<Container>
				<Header style={ styles.header }>
					<Left style={{flex:1}} >
						<Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress = { () =>this.props.navigation.navigate("PatientDetail", { selectedTab: 'events'})} />
					</Left>
					<Body style={{flex: 7, alignItems: 'stretch'}}>
						<Title>Recomendação para alta</Title>
					</Body>
					<Right>
						<Text style={styles.textButton} onPress={ () => this.save() }>Salvar</Text>
					</Right>
				</Header>
				<Content>
				<View style={ styles.container }>

					{/* <Portal>
						<Dialog visible={this.state.modalRecommendationTypeVisible} onDismiss={ () => { this.addRecommendation } }>
							<Dialog.Title>Atendimento</Dialog.Title>
							
							<Divider />
							
							<Dialog.Content>
								<RadioButton.Group onValueChange={ value => { this.handleAttendanceType(value) } } value={this.attendanceType(this.props.patien)}>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="WELCOME_HOME" />
										<Text>WELCOME_HOME</Text>
									</View>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="RECOMENDACAO_MEDICAMENTOSA" />
										<Text>RECOMENDACAO_MEDICAMENTOSA</Text>
									</View>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="INDICACAO_AMBULATORIO" />
										<Text>INDICACAO_AMBULATORIO</Text>
									</View>
								</RadioButton.Group>
							</Dialog.Content>

							<Divider />

							<Dialog.Actions>
								<Button onPress={ () => { this.addRecommendation } }>Fechar</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal> */}

					<ModalList paddingTop={50} height={50} visible={this.state.modalRecommendationTypeVisible} 	list={this.state.listRecommendationType} action={this.addRecommendation} />
					<ModalListSearchable paddingTop={30} height={100} visible={this.state.modalSpecialtyVisible} list={this.state.specialty} action={this.handleSpecialtyId} />
					<View style={styles.row}>
						<Text style={styles.title}>Recomendação</Text>
						<View style={ styles.column100 }>
							{ this.showRecommendationType() }
						</View>
					</View>
					
					{ this.showViewSpecialty() }

					<View>
						<Text style={styles.label }>Observação</Text>
						<TextInput multiline={true} numberOfLines={5} style={styles.textArea} 
						value={this.state.recommendation.observation} onChangeText = {observation => this.addObservation(observation)} />
					</View>
				</View>
				</Content>
				</Container>
			)}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#005cd1"
	},
	container: {
		display: 'flex'
	},
	row: {
		marginTop: '5%',
		width: '100%'
	},
	title:{
		fontSize: 20,
		paddingLeft: 2,
		color: '#000',
		fontWeight: "bold",
		width: '100%'
	}, 
	text: {
		fontSize: 20,
      	color:  "#19769F", 
		paddingLeft: 2,
		paddingBottom: 8,
	},
	textDisable: {
		fontSize: 20,
      	color:  "#A9A9A9", 
		marginLeft: 5,
		marginTop: 2
	},
	textButton: {
		color: '#FFF',
		fontSize: 15
	}, 
	label: {
		fontSize: 17,
		color:  "#A9A9A9", 
		paddingLeft: 2,
		marginTop: 8
	},
	textArea: {
		width: "100%",
		height: "45%",
		borderColor: '#000',
		borderWidth: 1, 
	},
	styleButton:{
		flexDirection: 'row',
		backgroundColor:'#19769F',
		borderColor: '#fff',
		width: '100%', 
		height: "15%",
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
	  },
	  column100: {
		justifyContent: 'flex-start', 
		width: '100%',
		padding: 2
	}
});
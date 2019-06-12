import React, { Component } from 'react';
import { StyleSheet, View, Alert, ScrollView, FlatList } from 'react-native';
import TextLabel from '../../components/TextLabel';
import TextValue from '../../components/TextValue';
import Line from '../../components/Line';
import TitleScreen from '../../components/Title';
import moment from 'moment';
import uuidv4 from'uuid/v4';

import ModalList from '../../components/ModalList';
import ModalInput from '../../components/ModalInput';
import ModalWeightAndHeight from '../../components/ModalWeightAndHeight';
import ModalListSearchable from '../../components/ModalListSearchable';

import data from '../../../data.json';

import { Button, Paragraph, Dialog, Portal, RadioButton, Text, Divider, TextInput, Searchbar, List } from 'react-native-paper';

export default class Profile extends Component {

	constructor(props) {
		super(props);	
		this.state = {
			cid: data.cid,
			auxCid: data.cid,
			tuss: data.tuss,
			modalAttendanceType: false,
			modalHospitalizationType: false,
			modalHeightAndWeight: false,
			modalCRM: false,
			modalPrimaryCID: false,
			modalSecondaryCID: false,
			modalMainProcedure: false,
			modalSelected: null,
			modalTeste1: false,
			modalTeste3: false,
			modalTeste4: false,
			selectedRadio: null,
			cidQuery: null,
			listAttendanceType: [
				{key: 1, value: 'ELECTIVE', label: 'ELETIVO'},
				{key: 2, value: 'EMERGENCY', label: 'EMERGÊNCIA'}
			],
			listHospitalizationType: [
				{key: 1, value: 'CLINICAL', label: 'CLÍNICO'},
				{key: 2, value: 'SURGICAL', label: 'CIRÚRGICO'}
			]
		}
	}

	toggleModal = (modalName) => {
		this.setState({[modalName]: !this.state[modalName]})
	}

	handleAttendanceType = (attendanceType) => {
		this.props.handleUpdatePatient('attendanceType', attendanceType)
		this.toggleModal('modalAttendanceType')
	}

	handleHospitalizationType = (hospitalizationType) => {
		this.props.handleUpdatePatient('hospitalizationType', hospitalizationType)
		this.toggleModal('modalHospitalizationType')
	}

	handleHeightAndWeight = async (patientHeight, patientWeight) => {
		await this.props.handleUpdatePatient('patientHeight', patientHeight)
		await this.props.handleUpdatePatient('patientWeight', patientWeight)
		this.toggleModal('modalHeightAndWeight')
	}

	attendanceType(item) {

		if (item == 'EMERGENCY') {
			return 'Emergencial';
		}
		else if(item == 'ELECTIVE')
		{
			return 'Eletivo';
		}
		return null;
	}

	hospitalizationType(item) {

		if (item == 'SURGICAL') {
			return 'Cirúrgico';
		}
		else if(item == 'CLINICAL')
		{
			return 'Clínico';
		}
		return null;
	}

	handleCRM = (crm) => {
		this.props.handleUpdatePatient('mainProcedureCRM', crm)
	}

	handlePrimaryCID = (cid) => {
		let diagnosticHypothesisList = []
		let diagnosticHypothesis = {
			beginDate: moment(),
			cidDisplayName: `${cid.item.code} - ${cid.item.name}`,
			cidId: cid.item.id,
			uuid: uuidv4()
		}
		diagnosticHypothesisList.push(diagnosticHypothesis)

		this.props.handleUpdatePatient('diagnosticHypothesisList', diagnosticHypothesisList)
		this.toggleModal('modalPrimaryCID')
		this.setState({
			auxCid: data.cid,
			cidQuery: null
		})
	}

	handleSecondaryCID = (cid) => {
		let secondaryCID = {
			beginDate: moment(),
			cidDisplayName: `${cid.item.code} - ${cid.item.name}`,
			cidId: cid.item.id,
			uuid: uuidv4()
		}

		if(this.props.patient.secondaryCIDList && this.props.patient.secondaryCIDList.length > 0) {
			let cidList = this.props.patient.secondaryCIDList
			cidList.push(secondaryCID)
			this.props.handleUpdatePatient('secondaryCIDList', cidList)
			this.setState({
				auxCid: data.cid,
				cidQuery: null
			})
		} else {
			let cidList = [];
			cidList.push(secondaryCID)
			this.props.handleUpdatePatient('secondaryCIDList', cidList)
			this.setState({
				auxCid: data.cid,
				cidQuery: null
			})
		}
		this.toggleModal('modalSecondaryCID')
	}

	removeSecondaryCID = (cidToRemove) => {
		Alert.alert(
			'Remover CID Secundário',
			'Deseja remover?',
			[
				{text: 'Cancelar', onPress: () => console.log('Remocao de CID secundário cancelado'), style: 'cancel', },
				{text: 'OK', onPress: () => 
					{
						let newCidList = this.props.patient.secondaryCIDList.filter(item => item.cidId !== cidToRemove.cidId)
						this.props.handleUpdatePatient("secondaryCIDList", newCidList)
					},
				}
			],
			{cancelable: false},
		);
	}

	handleMainProcedure = async (procedure) => {
		await this.props.handleUpdatePatient('mainProcedureTUSSDisplayName', `${procedure.item.code} - ${procedure.item.name}`)
		await this.props.handleUpdatePatient('mainProcedureTUSSId', procedure.item.code)
		this.toggleModal('modalMainProcedure')
	}

	renderItemPrimary = (element) => {
		return (
			<List.Item title={`${element.item.code} - ${element.item.name}`} onPress={() => { this.handlePrimaryCID(element) }} />
		);
	}

	renderItemSecondary = (element) => {
		return (
			<List.Item title={`${element.item.code} - ${element.item.name}`} onPress={() => { this.handleSecondaryCID(element) }} />
		);
	}

	filterCID = (query) => {
		const newListCid = this.state.cid.filter(item => {
			return (
				item.normalizedName.toUpperCase().includes(query.toUpperCase()) || 
			  	item.code.toUpperCase().includes(query.toUpperCase())
			)
		});

		this.setState({
			auxCid: newListCid,
			cidQuery: query
		});
	}

	renderModalSelected() {
		switch (this.state.modalSelected) {
			case 'HeightAndWeight':
				return ( <ModalWeightAndHeight paddingTop={50} height={70} visible={this.state.modalHeightAndWeight} patientHeight={this.props.patient.patientHeight} patientWeight={this.props.patient.patientWeight} action={ this.handleHeightAndWeight} /> );
			case 'AttendanceType':
				return ( 
					<Portal>
						<Dialog visible={this.state.modalAttendanceType} onDismiss={ () => { this.toggleModal('modalAttendanceType') } }>
							<Dialog.Title>Atendimento</Dialog.Title>
							
							<Divider />
							
							<Dialog.Content>
								<RadioButton.Group onValueChange={ value => { this.handleAttendanceType(value) } } value={this.props.patient.attendanceType}>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="ELECTIVE" />
										<Text>Eletivo</Text>
									</View>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="EMERGENCY" />
										<Text>Emergencial</Text>
									</View>
								</RadioButton.Group>
							</Dialog.Content>

							<Divider />

							<Dialog.Actions>
								<Button onPress={ () => { this.toggleModal('modalAttendanceType') } }>Fechar</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				);
			case 'HospitalizationType':
				return ( 
					<Portal>
						<Dialog visible={this.state.modalHospitalizationType} onDismiss={ () => { this.toggleModal('modalHospitalizationType') } }>
							<Dialog.Title>Tipo</Dialog.Title>
							
							<Divider />
							
							<Dialog.Content>
								<RadioButton.Group onValueChange={ value => { this.handleHospitalizationType(value) } } value={this.props.patient.hospitalizationType}>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="CLINICAL" />
										<Text>Clínico</Text>
									</View>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="SURGICAL" />
										<Text>Cirúrgico</Text>
									</View>
								</RadioButton.Group>
							</Dialog.Content>

							<Divider />

							<Dialog.Actions>
								<Button onPress={ () => { this.toggleModal('modalHospitalizationType') } }>Fechar</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				);
			case 'CRM':
				return ( 
					<Portal>
						<Dialog visible={this.state.modalCRM} onDismiss={ () => { this.toggleModal('modalCRM') } }>
							<Dialog.Title>CRM</Dialog.Title>
							
							<Dialog.Content>
								<TextInput mode='outlined' label='CRM' value={this.props.patient.mainProcedureCRM} onChangeText={text => { this.handleCRM(text) }} />	
							</Dialog.Content>

							<Divider />

							<Dialog.Actions>
								<Button onPress={ () => { this.toggleModal('modalCRM') } }>Fechar</Button>
							</Dialog.Actions>

						</Dialog>
					</Portal>
				);
			case 'PrimaryCID':
				return ( 
					<Portal>
						<Dialog style={{height: '70%'}} visible={this.state.modalPrimaryCID} onDismiss={ () => { this.toggleModal('modalPrimaryCID') } }>
							<Dialog.ScrollArea>
								<Dialog.Title>CID</Dialog.Title>
								<Searchbar placeholder="Filtrar" onChangeText={query => { this.filterCID(query) }} value={this.state.cidQuery} />

								<ScrollView style={{marginTop: 20}} contentContainerStyle={{ paddingHorizontal: 10 }}>
									<List.Section>
										<FlatList
											data={this.state.auxCid}
											keyExtractor={element => `${element.id}`}
											renderItem={this.renderItemPrimary} />
									</List.Section>
								</ScrollView>
							</Dialog.ScrollArea>

							<Divider />

							<Dialog.Actions>
								<Button onPress={ () => { this.toggleModal('modalPrimaryCID') } }>Fechar</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				);
			case 'SecondaryCID':
				return ( 
					<Portal>
						<Dialog style={{height: '70%'}} visible={this.state.modalSecondaryCID} onDismiss={ () => { this.toggleModal('modalSecondaryCID') } }>
							<Dialog.ScrollArea>
								<Dialog.Title>CID</Dialog.Title>
								<Searchbar placeholder="Filtrar" onChangeText={query => { this.filterCID(query) }} value={this.state.cidQuery} />

								<ScrollView style={{marginTop: 20}} contentContainerStyle={{ paddingHorizontal: 10 }}>
									<List.Section>
										<FlatList
											data={this.state.auxCid}
											keyExtractor={element => `${element.id}`}
											renderItem={this.renderItemSecondary} />
									</List.Section>
								</ScrollView>
							</Dialog.ScrollArea>

							<Divider />

							<Dialog.Actions>
								<Button onPress={ () => { this.toggleModal('modalSecondaryCID') } }>Fechar</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				);
			case 'MainProcedure':
				return ( <ModalListSearchable paddingTop={20} height={80} visible={this.state.modalMainProcedure} list={this.state.tuss} action={this.handleMainProcedure} /> );
		}
	}

	render() {
		let CRM = this.props.patient.mainProcedureCRM !== null ? this.props.patient.mainProcedureCRM : 'INFORMAR';
		const { container, row, column50, column100, overlay, item, textValue, trackingListItem, hospitalizationsListContainer } = styles;
		
		return (
			<View style={ container }>

				{ this.renderModalSelected() }

				<Portal>
					<Dialog visible={this.state.modalTeste1} onDismiss={ () => { this.toggleModal('modalTeste1') } }>
						<Dialog.Title>Título</Dialog.Title>
						<Dialog.Content>
							<Paragraph>Descrição da modal</Paragraph>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={ () => { this.toggleModal('modalTeste1') } }>OK</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>

				<TitleScreen marginTop={5} marginLeft={5} title={this.props.patient.patientName} />
				<Line marginTop={3} marginBottom={3} marginLeft={5} width={90} size={2} />
				<TextLabel marginLeft="5" label='Prontuário' />
				<TextValue marginLeft="5" value={this.props.patient.medicalRecordsNumber} />	

				<View style={ row }>
					<View style={ column50 }>
						<TextLabel marginLeft="10" label='Convênio' />
						<TextValue marginLeft="10" value={this.props.patient.agreement} />
					</View>
					
					<View style={ column50 }>
						<TextLabel marginLeft="0" label='Plano' />
						<TextValue marginLeft="0" value={this.props.patient.plane} />
					</View>
				</View>

				<View style={ row }>
					<View style={ column50 }>
						<TextLabel marginLeft="10" label='Nascimento' />
						<TextValue marginLeft="10" value={this.props.patient.patientBornDate ? moment(this.props.patient.patientBornDate).format('DD/MM/YYYY') : '' } />

						<TextValue marginLeft="20" size={13} value={ this.props.patient.patientBornDate ? moment().diff(this.props.patient.patientBornDate, 'years') + ' anos': '' }/>
					</View>
					
					<View style={ column50 }>
						<TextLabel marginLeft="0" label='Altura/Peso' />
						<TextValue marginLeft="0" color={'#0000FF'} value={ this.props.patient.patientHeight && this.props.patient.patientWeight ? `${this.props.patient.patientHeight}m / ${this.props.patient.patientWeight}kg` : '' } press={ () => { this.setState({modalSelected: 'HeightAndWeight', modalHeightAndWeight: true}) }}/>
						<TextValue marginLeft="0" size={13} value={ this.props.patient.patientHeight && this.props.patient.patientWeight ? 'IMC ' + (Number(this.props.patient.patientWeight) / Math.pow(Number(this.props.patient.patientHeight), 2)).toFixed(2) : '' }/>
					</View>
				</View>

				<View style={ row }>
					<View style={ column50 }>
						<TextLabel marginLeft="10" label='Atendimento' />
						<TextValue marginLeft="10" color={'#0000FF'} value={ this.attendanceType(this.props.patient.attendanceType) } press={ () => { this.setState({modalSelected: 'AttendanceType', modalAttendanceType: true}) }}/>
					</View>
					
					<View style={ column50 }>
						<TextLabel marginLeft="0" label='Tipo' />
						<TextValue marginLeft="0" color={'#0000FF'} value={ this.hospitalizationType(this.props.patient.hospitalizationType) } press={ () => { this.setState({modalSelected: 'HospitalizationType', modalHospitalizationType: true}) }}/>
					</View>
				</View>

				<Line marginTop={5} marginBottom={1} marginLeft={5} width={90} size={2} />

				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='Data de Internação' />
						<TextValue marginLeft="5" value={ this.props.patient.admissionDate ? moment(this.props.patient.admissionDate).format('DD/MM/YYYY HH:mm') : ''} />
					</View>
				</View>

				<View style={ row }>
					<View style={ column100 }>
						{this.props.patient.trackingList && this.props.patient.trackingList.map((prop, index) => {
							return (
								<View key={prop.trackingId} style={{marginTop: '2%'}}>
									<TextLabel marginLeft="5" label={`${++index} Monitoramento`} />
									<TextLabel marginLeft="5" label='Data Início do Monitoramento' />
									<TextValue marginLeft="5" value={ prop.startDate ? moment(prop.startDate).format('DD/MM/YYYY') : '' } />
									<TextLabel marginLeft="5" label='Data Fim do Monitoramento' />
									<TextValue marginLeft="5" value={ prop.endDate ? moment(prop.endDate).format('DD/MM/YYYY') : '' } />
								</View>
							);
						})}
					</View>
				</View>
				
				<Line marginTop={3} marginBottom={1} marginLeft={5} width={90} size={2} />

				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='Data da Alta Médica' />
						<TextValue marginLeft="5" value={ this.props.patient.medicalExitDate ? moment(this.props.patient.medicalExitDate).format('DD/MM/YYYY HH:mm') : '' } />
					</View>
				</View>

				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='Data da Alta Administrativa' />
						<TextValue marginLeft="5" value={ this.props.patient.exitDate ? moment(this.props.patient.exitDate).format('DD/MM/YYYY HH:mm') : '' } />
					</View>
				</View>

				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='Motivo da alta Administrativa' />
						<TextValue marginLeft="5" value={this.props.patient.exitDescription} />
					</View>
				</View>
				
				<Line marginTop={5} marginBottom={1} marginLeft={5} width={90} size={2} />
				
				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='Procedimento Principal' />
						{
							this.props.patient.mainProcedureTUSSDisplayName ? 
							<TextValue marginLeft="5" color={'#0000FF'} value={this.props.patient.mainProcedureTUSSDisplayName} press={ () => { this.setState({modalSelected: 'MainProcedure', modalMainProcedure: true}) }} />
							:
							<TextValue marginLeft="5" color={'#0000FF'} value={'ESCOLHER'} press={this.toggleModalSecondaryCID} press={ () => { this.setState({modalSelected: 'MainProcedure', modalMainProcedure: true}) }} />	
						}
					</View>
				</View>

				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='CRM do Responsável' />
						<TextValue marginLeft="5" color={'#0000FF'} value={CRM} press={ () => { this.setState({modalSelected: 'CRM', modalCRM: true}) }} />
					</View>
				</View>
				
				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='CID Primário' />
						{ this.props.patient.diagnosticHypothesisList && this.props.patient.diagnosticHypothesisList.length === 0 ? <TextValue color={'#0000FF'} marginLeft="5" value={'ADICIONAR'} press={ () => { this.setState({modalSelected: 'PrimaryCID', modalPrimaryCID: true}) }} /> : null }

						{this.props.patient.diagnosticHypothesisList && this.props.patient.diagnosticHypothesisList.map((prop) => {
							return (
								<TextValue color={'#0000FF'} key={prop.cidId} marginLeft="5" value={prop.cidDisplayName ? prop.cidDisplayName : 'Escolher'} press={ () => { this.setState({modalSelected: 'PrimaryCID', modalPrimaryCID: true}) }} />
							);
						})}
					</View>
				</View>
					
				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='CIDs Secundários' />
						<TextValue color={'#0000FF'} marginLeft="5" value={'ADICIONAR'} press={ () => { this.setState({modalSelected: 'SecondaryCID', modalSecondaryCID: true}) }} />
						{ 
							this.props.patient.secondaryCIDList.length ? 
								this.props.patient.secondaryCIDList.map((cidItem) => {
									return (
										<Text style={textValue} key={cidItem.cidId} onPress={ () => this.removeSecondaryCID(cidItem) }> { cidItem.cidDisplayName } </Text>
									);
								})
							: 
							<View/>
						}
					</View>
				</View>
				
				<View style={ row }>
					<View style={ column100 }>
						<TextLabel marginLeft="5" label='Internações Anteriores' />
						{this.props.patient.previousHospitalizations && this.props.patient.previousHospitalizations.map((prop) => {
							let startDate = prop.admissionDate ? moment(prop.admissionDate).format('DD/MM/YYYY') : ''
							let endDate = prop.exitDate ? moment(prop.exitDate).format('DD/MM/YYYY') : ''

							return (
								<View key={prop.id} style={ hospitalizationsListContainer }>
									<TextValue marginLeft="5" value={ `${startDate} à ${endDate} - ${prop.hospitalizationDays} dias \n`} />
									<TextValue marginLeft="5" value={ `${prop.exitCidDisplayName}` } />
								</View>
							);
						})}
					</View>
				</View>

				<Text> {'\n'} </Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
	},
	row: {
		flexDirection: 'row', 
		marginTop: '5%'
	},
	column50: {
		justifyContent: 'flex-start', 
		width: '50%'
	},
	column100: {
		justifyContent: 'flex-start', 
		width: '100%'
	},
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		flexDirection: "row",
	},
	item: {
    	padding: 10,
    	fontSize: 18,
	},
	textValue: {
		fontFamily: "Gotham Rounded",
		fontWeight: "normal", 
		fontStyle: "normal", 
		lineHeight: 22, 
		letterSpacing: 0,
		color: '#0000FF',
		fontSize: 18,
		marginTop: '0%', 
		marginLeft: '5%'
	},
	trackingListItem: {
		fontFamily: "Gotham Rounded",
		fontWeight: "normal", 
		fontStyle: "normal", 
		lineHeight: 22, 
		letterSpacing: 0,
		color: '#0000FF',
		fontSize: 18,
		marginTop: '3%', 
		marginLeft: '5%'
	},
	hospitalizationsListContainer: {
		marginTop: '2%', 
		marginBottom: '3%'
	}
});
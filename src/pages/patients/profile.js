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

import { Button, Paragraph, Dialog, Portal, RadioButton, Divider, TextInput, Searchbar } from 'react-native-paper';

import { Content, ListItem, Text, List, Left, Right, Icon, Body, Switch } from 'native-base';

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
								<RadioButton.Group onValueChange={ value => { this.handleAttendanceType(value) } } value={this.attendanceType(this.props.patient.attendanceType)}>
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

				<Content>

					<ListItem itemDivider>
						<Text>Dados Básicos</Text>
					</ListItem> 

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Nome{"\n"}<TextValue value={this.props.patient.patientName} /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Prontuário{"\n"}<TextValue value={this.props.patient.medicalRecordsNumber} /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Convênio{"\n"}<TextValue value={this.props.patient.agreement} /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Plano{"\n"}<TextValue value={this.props.patient.plane} /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Nascimento{"\n"}
							<TextValue value={this.props.patient.patientBornDate ? moment(this.props.patient.patientBornDate).format('DD/MM/YYYY') : '' } />{"\n"}
						</Text>
					</Body>
					<Right>
						<TextValue size={13} value={ this.props.patient.patientBornDate ? moment().diff(this.props.patient.patientBornDate, 'years') + ' anos': '' }/>
		            </Right>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Altura/Peso{"\n"}
							<TextValue color={'#0000FF'} value={ this.props.patient.patientHeight && this.props.patient.patientWeight ? `${this.props.patient.patientHeight}m / ${this.props.patient.patientWeight}kg` : '' } press={ () => { this.setState({modalSelected: 'HeightAndWeight', modalHeightAndWeight: true}) }}/>{"\n"}
						</Text>
					</Body>
					<Right>
						<TextValue size={13} value={ this.props.patient.patientHeight && this.props.patient.patientWeight ? 'IMC ' + (Number(this.props.patient.patientWeight) / Math.pow(Number(this.props.patient.patientHeight), 2)).toFixed(2) : '' }/>
		            </Right>
					</ListItem>

					<ListItem itemDivider>
						<Text>Dados da Internação</Text>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Atendimento{"\n"}<TextValue value={this.props.patient.attendanceType} press={ () => { this.setState({modalSelected: 'AttendanceType', modalAttendanceType: true}) }}/></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Data de Internação{"\n"}<TextValue value={ this.props.patient.admissionDate ? moment(this.props.patient.admissionDate).format('DD/MM/YYYY HH:mm') : ''} /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Data da Alta Médica{"\n"}<TextValue value={ this.props.patient.medicalExitDate ? moment(this.props.patient.medicalExitDate).format('DD/MM/YYYY HH:mm') : '' } /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Data da Alta Administrativa{"\n"}<TextValue value={ this.props.patient.exitDate ? moment(this.props.patient.exitDate).format('DD/MM/YYYY HH:mm') : '' } /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Motivo da Alta Administrativa{"\n"}<TextValue value={this.props.patient.exitDescription} /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Tipo da Internação{"\n"}<TextValue color={'#0000FF'} value={ this.hospitalizationType(this.props.patient.hospitalizationType) } press={ () => { this.setState({modalSelected: 'HospitalizationType', modalHospitalizationType: true}) }}/></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Procedimento Principal{"\n"}{
						this.props.patient.mainProcedureTUSSDisplayName ? 
						<TextValue color={'#0000FF'} value={this.props.patient.mainProcedureTUSSDisplayName} press={ () => { this.setState({modalSelected: 'MainProcedure', modalMainProcedure: true}) }} />
						:
						<TextValue color={'#0000FF'} value={'ESCOLHER'} press={this.toggleModalSecondaryCID} press={ () => { this.setState({modalSelected: 'MainProcedure', modalMainProcedure: true}) }} />	
					}</Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>CRM do Responsável{"\n"}<TextValue color={'#0000FF'} value={CRM} press={ () => { this.setState({modalSelected: 'CRM', modalCRM: true}) }} /></Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>CID Primário{"\n"}{ this.props.patient.diagnosticHypothesisList && this.props.patient.diagnosticHypothesisList.length === 0 ? <TextValue color={'#0000FF'} value={'ADICIONAR'} press={ () => { this.setState({modalSelected: 'PrimaryCID', modalPrimaryCID: true}) }} /> : null }
							{this.props.patient.diagnosticHypothesisList && this.props.patient.diagnosticHypothesisList.map((prop) => {
								return (
									<TextValue color={'#0000FF'} key={prop.cidId} value={prop.cidDisplayName ? prop.cidDisplayName : 'Escolher'} press={ () => { this.setState({modalSelected: 'PrimaryCID', modalPrimaryCID: true}) }} />
								);
							})}
						</Text>
					</Body>
					</ListItem>

					<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>CIDs Secundários{"\n"}<TextValue color={'#0000FF'} value={'ADICIONAR'} press={ () => { this.setState({modalSelected: 'SecondaryCID', modalSecondaryCID: true}) }} />
							{ 
								this.props.patient.secondaryCIDList.length ? 
									this.props.patient.secondaryCIDList.map((cidItem) => {
										return (
											<Text style={textValue} key={cidItem.cidId} onPress={ () => this.removeSecondaryCID(cidItem) }> { cidItem.cidDisplayName } </Text>
										);
									})
								: 
								<Text/>
							}
						</Text>
					</Body>
					</ListItem>

					<ListItem itemDivider>
						<Text>Internações Anteriores</Text>
					</ListItem>

					{this.props.patient.previousHospitalizations && this.props.patient.previousHospitalizations.map((prop) => {
						let startDate = prop.admissionDate ? moment(prop.admissionDate).format('DD/MM/YYYY') : ''
						let endDate = prop.exitDate ? moment(prop.exitDate).format('DD/MM/YYYY') : ''

						return (
							<ListItem>
								<Body>
									<Text style={{fontWeight: 'bold'}}>
										{ `${startDate} à ${endDate} (${prop.hospitalizationDays}`} { `${prop.hospitalizationDays <= 1 ? 'dia' : 'dias'}` }) {"\n"} 
										<TextValue value={ `${prop.exitCidDisplayName ? prop.exitCidDisplayName : ''}` } />
									</Text>
								</Body>
							</ListItem>
						);
					})}

				</Content>

			</View>
		);
	}
}

const styles = StyleSheet.create({

});
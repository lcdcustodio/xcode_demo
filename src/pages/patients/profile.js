import React, { Component } from 'react';
import { StyleSheet, View, Alert, ScrollView, FlatList, Keyboard } from 'react-native';
import { toJsonDate } from '../../components/rededor-base';
import Modal from '../../components/Modal';
import TextValue from '../../components/TextValue';
import moment from 'moment';
import uuidv4 from'uuid/v4';
import data from '../../../data.json';
import { Button, Dialog, Portal, RadioButton, Divider, TextInput, Searchbar, List } from 'react-native-paper';
import { Content, ListItem, Text, Right, Body } from 'native-base';
import _ from 'lodash';

export default class Profile extends Component {

	constructor(props) {
		super(props);	
		this.state = {
			patient: this.props.navigation.getParam('patient'),
			isEditable: this.props.isEditable,
			cid: data.cid,
			auxCid: data.cid,
			tuss: data.tuss,
			auxTuss: data.tuss,
			modalAttendanceType: false,
			modalHospitalizationType: false,
			modalHeightAndWeight: false,
			modalCRM: false,
			modalPrimaryCID: false,
			modalSecondaryCID: false,
			modalMainProcedure: false,
			modalSelected: null,
			selectedRadio: null,
			cidQuery: null,
			tussQuery: null,
			listAttendanceType: [
				{key: 1, value: 'ELECTIVE', label: 'ELETIVO'},
				{key: 2, value: 'EMERGENCY', label: 'EMERGÊNCIA'}
			],
			listHospitalizationType: [
				{key: 1, value: 'CLINICAL', label: 'CLÍNICO'},
				{key: 2, value: 'SURGICAL', label: 'CIRÚRGICO'}
			],
			patientHeightTMP: this.props.navigation.getParam('patient').patientHeight,
			patientWeightTMP: this.props.navigation.getParam('patient').patientWeight,
			crmTMP: this.props.navigation.getParam('patient').mainProcedureCRM,
			keyboardSpace: 0
		}

		Keyboard.addListener('keyboardDidShow',(frames)=>{
            if (!frames.endCoordinates) return;
            this.setState({
				keyboardSpace: frames.endCoordinates.height
			});
		});
		
        Keyboard.addListener('keyboardDidHide',(frames)=>{
            this.setState({keyboardSpace:0});
        });
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		this.setState({
			isEditable: this.props.isEditable,
			patient: this.props.navigation.getParam('patient')
		});
	});

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

	handleHeight = (patientHeight) => {
		this.setState({ patientHeightTMP: patientHeight });
	}

	handleWeight = (patientWeight) => {
		this.setState({ patientWeightTMP: patientWeight });
	}

	saveWeightAndHeight = async () => {
		await this.props.handleUpdatePatient('patientWeight', this.state.patientWeightTMP);
		await this.props.handleUpdatePatient('patientHeight', this.state.patientHeightTMP);
		this.toggleModal('modalHeightAndWeight');
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
		this.setState({ crmTMP: crm });
	}

	saveCRM = () => {
		this.props.handleUpdatePatient('mainProcedureCRM', this.state.crmTMP);
		this.toggleModal('modalCRM');
	}

	handlePrimaryCID = (cid) => {
		diagnosticHypothesisList = [];
		let diagnosticHypothesis = {
			beginDate: toJsonDate(),
			endDate: null,
			cidDisplayName: `${cid.item.code} - ${cid.item.name}`,
			cidId: cid.item.id,
			uuid: uuidv4()
		}

		if (this.props.patient.diagnosticHypothesisList && this.props.patient.diagnosticHypothesisList.length > 0) {
			let cidListDesc = _.orderBy(this.props.patient.diagnosticHypothesisList, ['beginDate'], ['desc']);
			cidListDesc[0].endDate = toJsonDate();
			this.checkEndDate(cidListDesc);

			if (!this.hasCidItem(cidListDesc, diagnosticHypothesis)) {
				cidListDesc.push(diagnosticHypothesis);
				this.props.handleUpdatePatient('diagnosticHypothesisList', cidListDesc);
				this.toggleModal('modalPrimaryCID');
				this.setState({
					auxCid: data.cid,
					cidQuery: null
				});
			}
		} else {
			diagnosticHypothesisList.push(diagnosticHypothesis)
			this.props.handleUpdatePatient('diagnosticHypothesisList', diagnosticHypothesisList)
			this.toggleModal('modalPrimaryCID')
			this.setState({
				auxCid: data.cid,
				cidQuery: null
			})
		}
	}

	handleSecondaryCID = (cid) => {

		let secondaryCID = {
			beginDate: moment(),
			cidDisplayName: `${cid.item.code} - ${cid.item.name}`,
			cidId: cid.item.id,
			uuid: uuidv4()
		}

		if(this.props.patient.secondaryCIDList && this.props.patient.secondaryCIDList.length > 0) {
			
			let cidList = this.props.patient.secondaryCIDList;

			let push = true;

			for (var i = 0; i < cidList.length; i++) {
				if (cidList[i].cidId == cid.item.id) {
					push = false;
				}
			}

			if (push) {

				cidList.push(secondaryCID);
				
				this.props.handleUpdatePatient('secondaryCIDList', cidList)
				
				this.setState({
					auxCid: data.cid,
					cidQuery: null
				});
			}

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

	hasCidItem(cidList, cid) {
		let result = false;
		for (var i = 0; i < cidList.length; i++) {
			if (cidList[i].cidId == cid.id) {
				result = true;
			}
		}
		return result;
	}

	checkEndDate(cidList) {
		for (var i = 0; i < cidList.length; i++) {
			if (cidList[i].endDate === null) {
				cidList[i].endDate = toJsonDate();
			}
		}
	}

	removeSecondaryCID = (cidToRemove) => {
		Alert.alert(
			'Remover CID Secundário',
			'Deseja remover?',
			[
				{text: 'Cancelar', onPress: () => console.log('Remocao de CID secundário cancelado'), style: 'cancel', },
				{text: 'OK', onPress: () => 
					{
						let newCidList = this.props.patient.secondaryCIDList.filter(item => item.cidId !== cidToRemove.cidId);
						
						console.log(newCidList);

						this.props.handleUpdatePatient("secondaryCIDList", newCidList)
					},
				}
			],
			{cancelable: false},
		);
	}

	handleMainProcedure = async (procedure) => {
		await this.props.handleUpdatePatient('mainProcedureTUSSDisplayName', `${procedure.item.code} - ${procedure.item.name}`)
		await this.props.handleUpdatePatient('mainProcedureTUSSId', procedure.item.id)
		this.setState({
			auxTuss: data.tuss,
			tussQuery: null
		})
		this.toggleModal('modalMainProcedure')
	}
	
	renderModalSelected() {
		switch (this.state.modalSelected) {
			case 'HeightAndWeight':
				return (
					<Portal>
						<Dialog style={{top: this.state.keyboardSpace ? -(this.state.keyboardSpace * .47) : 0}} visible={this.state.modalHeightAndWeight} onDismiss={ () => { this.toggleModal('modalHeightAndWeight') } }>
							<Dialog.Title>Altura (m) e Peso (Kg)</Dialog.Title>
							
							<Dialog.Content>
								<TextInput mode='outlined' maxLength={4} keyboardType='numeric' label='Altura' value={this.state.patientHeightTMP ? this.state.patientHeightTMP.toString() : this.state.patientHeightTMP} onChangeText={height => { this.handleHeight(height) }}/>

								<Text> {'\n'} </Text>								

								<TextInput mode='outlined' maxLength={4} keyboardType='numeric' label='Peso' value={this.state.patientWeightTMP ? this.state.patientWeightTMP.toString() : this.state.patientWeightTMP} onChangeText={weight => { this.handleWeight(weight) }} />
							</Dialog.Content>

							<Divider />

							<Dialog.Actions>
								<Button onPress={ () => { this.toggleModal('modalHeightAndWeight') } }>Fechar</Button>
								<Button onPress={ () => { this.saveWeightAndHeight() } }>Salvar</Button>
							</Dialog.Actions>

						</Dialog>
					</Portal>
				);
			case 'AttendanceType':
					const attendanceType = this.props.patient.attendanceType;
				return ( 
					<Portal>
						<Dialog visible={this.state.modalAttendanceType} onDismiss={ () => { this.toggleModal('modalAttendanceType') } }>
							<Dialog.Title>Atendimento</Dialog.Title>
							
							<Divider />
							
							<Dialog.Content>
								<RadioButton.Group 
								  onValueChange={ value => { this.handleAttendanceType(value) } } 
								  value={attendanceType}>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="ELECTIVE" status={attendanceType === 'ELECTIVE' ? 'checked' : 'unchecked'} Enabled/>
										<Text onPress={ () => { this.handleAttendanceType('ELECTIVE') } }>Eletivo</Text>
									</View>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="EMERGENCY" status={attendanceType === 'EMERGENCY' ? 'checked' : 'unchecked'} Enabled/>
										<Text onPress={ () => { this.handleAttendanceType('EMERGENCY') } }>Emergencial</Text>
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
				let hospitalizationType = this.props.patient.hospitalizationType; 
				return ( 
					<Portal>
						<Dialog visible={this.state.modalHospitalizationType} onDismiss={ () => { this.toggleModal('modalHospitalizationType') } }>
							<Dialog.Title>Tipo</Dialog.Title>
							
							<Divider />
							
							<Dialog.Content>
								<RadioButton.Group onValueChange={ value => { this.handleHospitalizationType(value) } } value={hospitalizationType}>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="CLINICAL" status={hospitalizationType === 'CLINICAL' ? 'checked' : 'unchecked'} Enabled/>
										<Text onPress={ () => { this.handleHospitalizationType('CLINICAL') } }>Clínico</Text>
									</View>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<RadioButton value="SURGICAL" status={hospitalizationType === 'SURGICAL' ? 'checked' : 'unchecked'} Enabled/>
										<Text onPress={ () => { this.handleHospitalizationType('SURGICAL') } }>Cirúrgico</Text>
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
						<Dialog style={{ top: this.state.keyboardSpace ? -(this.state.keyboardSpace * .47) : 0 }} visible={this.state.modalCRM} onDismiss={ () => { this.toggleModal('modalCRM') } }>
							<Dialog.Title>CRM</Dialog.Title>
							
							<Dialog.Content>
								<TextInput mode='outlined' label='CRM' keyboardType='numeric' value={this.state.crmTMP} onChangeText={text => { this.handleCRM(text) }} />	
							</Dialog.Content>

							<Divider />

							<Dialog.Actions>
								<Button onPress={ () => { this.toggleModal('modalCRM') } }>Fechar</Button>
								<Button onPress={ () => { this.saveCRM() } }>Salvar</Button>
							</Dialog.Actions>

						</Dialog>
					</Portal>
				);
			case 'PrimaryCID':
				return (
					<Modal title="CID Primário" visible={this.state.modalPrimaryCID} list={this.state.auxCid} onSelect={ (item) => { this.handlePrimaryCID(item) }} close={() => {this.toggleModal('modalPrimaryCID')} } />
				);
			case 'SecondaryCID':
				return (
					<Modal title="CID Secundário" visible={this.state.modalSecondaryCID} list={this.state.auxCid} onSelect={ (item) => { this.handleSecondaryCID(item) }} close={() => {this.toggleModal('modalSecondaryCID')} } />
				);

			case 'MainProcedure':
				return (
					<Modal title="Procedimento Principal" visible={this.state.modalMainProcedure} list={this.state.auxTuss} onSelect={ (item) => { this.handleMainProcedure(item) }} close={() => {this.toggleModal('modalMainProcedure')} } />
				);
		}
	}

	

	renderHeightAndWeight() {

			console.log(this.props.patient.patientHeight);
			console.log(this.props.patient.patientWeight);
			
		return (

			this.state.isEditable ?
				<TextValue color={'#0000FF'} value={ this.props.patient.patientHeight && this.props.patient.patientWeight ? `${this.props.patient.patientHeight}m / ${this.props.patient.patientWeight}kg` : 'INFORMAR' } press={ () => { this.setState({modalSelected: 'HeightAndWeight', modalHeightAndWeight: true}) }}/>
			:
				<TextValue value={ this.props.patient.patientHeight && this.props.patient.patientWeight ? `${this.props.patient.patientHeight}m / ${this.props.patient.patientWeight}kg` : 'NÃO INFORMADO' } />
		);
	}

	renderIMC() {
		let patientHeight = null;
		let patientWeight = null;

		if (this.props.patient.patientHeight) {
			patientHeight = this.props.patient.patientHeight.toString().replace(',', '.');
		}
		
		if (this.props.patient.patientWeight) {
			patientWeight = this.props.patient.patientWeight.toString().replace(',', '.');
		}

		if (patientHeight && patientWeight) {
			return (
				<TextValue size={13} value={ 'IMC ' + (Number(patientWeight) / Math.pow(Number(patientHeight), 2)).toFixed(2) } />
			);
		}
		return <Text />
	}

	renderAtendencyType() {
		return (
			this.state.isEditable ?
				<TextValue color={'#0000FF'} value={this.props.patient.attendanceType ? this.attendanceType(this.props.patient.attendanceType) : 'INFORMAR'} press={ () => { this.setState({modalSelected: 'AttendanceType', modalAttendanceType: true}) }}/>
			:
				<TextValue value={this.props.patient.attendanceType ? this.attendanceType(this.props.patient.attendanceType) : 'NÃO INFORMADO'} />
		);
	}

	renderHospitalizationType() {
		return (
			this.state.isEditable ?
				<TextValue color={'#0000FF'} value={this.props.patient.hospitalizationType ? this.hospitalizationType(this.props.patient.hospitalizationType) : 'INFORMAR'} press={ () => { this.setState({modalSelected: 'HospitalizationType', modalHospitalizationType: true}) }}/>
			:
				<TextValue value={this.props.patient.hospitalizationType ? this.hospitalizationType(this.props.patient.hospitalizationType) : 'NÃO INFORMADO'} />
		);
	}

	renderMainProcedure() {
		return (
			this.state.isEditable ?
				<TextValue color={'#0000FF'} value={this.props.patient.mainProcedureTUSSDisplayName ? this.props.patient.mainProcedureTUSSDisplayName : 'ESCOLHER'} press={ () => { this.setState({modalSelected: 'MainProcedure', modalMainProcedure: true}) }} />
			:
				<TextValue value={this.props.patient.mainProcedureTUSSDisplayName ? this.props.patient.mainProcedureTUSSDisplayName : 'NÃO INFORMADO'} />
		);
	}

	renderPrimaryCID() {
		return (
			this.state.isEditable ?
				this.props.patient.diagnosticHypothesisList.length === 0 ? 
					<TextValue color={'#0000FF'} value={'ESCOLHER'} press={ () => { this.setState({modalSelected: 'PrimaryCID', modalPrimaryCID: true}) }} />
				:
					this.props.patient.diagnosticHypothesisList.map((prop) => {
						console.log(prop)
						if (prop.endDate === null) {
							return ( <TextValue color={'#0000FF'} key={prop.cidId} value={prop.cidDisplayName} press={ () => { this.setState({modalSelected: 'PrimaryCID', modalPrimaryCID: true}) }} /> )
						}
					})
			:
			<TextValue value={this.props.patient.diagnosticHypothesisList.length > 0 ? this.props.patient.diagnosticHypothesisList[0].cidDisplayName : 'NÃO INFORMADO'} />
		);
	}

	renderSecondaryCID() {
		return (
			this.state.isEditable ?
				this.props.patient.secondaryCIDList.map((prop) => {
					return ( <TextValue color={'#0000FF'} key={prop.cidId} value={`${prop.cidDisplayName} \n`} press={ () => { this.removeSecondaryCID(prop) }} /> )
				})
			:
				this.props.patient.secondaryCIDList.length === 0 ? 
					<TextValue value={'NÃO INFORMADO'} />
				:
					this.props.patient.secondaryCIDList.map((prop) => {
						return ( <TextValue key={prop.cidId} value={prop.cidDisplayName} /> )
					})
		);
	}

	renderCRM() {
		return (
			this.state.isEditable ?
				<TextValue color={'#0000FF'} value={this.props.patient.mainProcedureCRM !== null ? this.props.patient.mainProcedureCRM : 'INFORMAR'} press={ () => { this.setState({modalSelected: 'CRM', modalCRM: true}) }} />
			:
				<TextValue value={'NÃO INFORMADO'} />
		);
	}

	render() {
		return (
			<ScrollView style={{ backgroundColor: 'white' }}>
				
				{ this.renderModalSelected() }

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
							{ this.renderHeightAndWeight() }
						</Text>
					</Body>
					<Right>
						{ this.renderIMC() }
					</Right>
				</ListItem>

				<ListItem itemDivider>
					<Text>Dados da Internação</Text>
				</ListItem>

				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Data de Internação{"\n"}<TextValue value={ this.props.patient.admissionDate ? moment(this.props.patient.admissionDate).format('DD/MM/YYYY HH:mm') : ''} /></Text>
					</Body>
				</ListItem>

				{
					this.props.patient.exitDate ?
						<ListItem>
							<Body>
								<Text style={{fontWeight: 'bold'}}>Data da Alta Médica{"\n"}<TextValue value={ this.props.patient.medicalExitDate ? moment(this.props.patient.medicalExitDate).format('DD/MM/YYYY HH:mm') : '' } /></Text>
							</Body>
						</ListItem>
					:
						null
				}

				{
					this.props.patient.exitDate ?
						<ListItem>
							<Body>
								<Text style={{fontWeight: 'bold'}}>Data da Alta Administrativa{"\n"}<TextValue value={ this.props.patient.exitDate ? moment(this.props.patient.exitDate).format('DD/MM/YYYY HH:mm') : '' } /></Text>
							</Body>
						</ListItem>
					:
						null
				}

				{
					this.props.patient.exitDate ?
						<ListItem>
							<Body>
								<Text style={{fontWeight: 'bold'}}>Motivo da Alta Administrativa{"\n"}<TextValue value={this.props.patient.exitDescription} /></Text>
							</Body>
						</ListItem>
					:
					null
				}

				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Atendimento{"\n"}
							{ this.renderAtendencyType() }
						</Text>
					</Body>
				</ListItem>

				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>Tipo da Internação{"\n"}
							{ this.renderHospitalizationType() }
						</Text> 
					</Body>
				</ListItem>

				{
					this.props.patient.hospitalizationType === 'SURGICAL' ?
						<ListItem>
							<Body>
								<Text style={{fontWeight: 'bold'}}>Procedimento Principal{"\n"}
									{ this.renderMainProcedure() }
								</Text>
							</Body>
						</ListItem>
					:
					null
				}

				{
					this.props.patient.hospitalizationType === 'SURGICAL' ?
						<ListItem>
							<Body>
								<Text style={{fontWeight: 'bold'}}>CRM do Responsável{"\n"}
									{ this.renderCRM() }
								</Text>
							</Body>
						</ListItem>
					:
					null
				}

				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>CID Primário{"\n"}
							{ this.renderPrimaryCID() }
						</Text>
					</Body>
				</ListItem>

				<ListItem>
					<Body>
						<Text style={{fontWeight: 'bold'}}>CIDs Secundários{"\n"}
							{ this.state.isEditable ? 
									<TextValue color={'#0000FF'} value={'ADICIONAR \n'} press={ () => { this.setState({modalSelected: 'SecondaryCID', modalSecondaryCID: true}) }} />
								:
								<Text />
							}
							{ this.renderSecondaryCID() }
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
						<ListItem key={prop.id}>
							<Body>
								<Text style={{fontWeight: 'bold'}}>
									{ `${startDate} à ${endDate} (${prop.hospitalizationDays}`} { `${prop.hospitalizationDays <= 1 ? 'dia' : 'dias'}` }) {"\n"} 
									<TextValue value={ `${prop.exitCidDisplayName ? prop.exitCidDisplayName : ''}` } />
								</Text>
							</Body>
						</ListItem>
					);
				})}

			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
    textListItem: {
        padding: 12, fontSize: 18
    },
});
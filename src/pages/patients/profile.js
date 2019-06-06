import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert  } from 'react-native';
import TextLabel from '../../components/TextLabel'
import TextValue from '../../components/TextValue'
import Line from '../../components/Line'
import TitleScreen from '../../components/Title'
import moment from 'moment';

import ModalList from '../../components/ModalList'
import ModalInput from '../../components/ModalInput'
import ModalWeightAndHeight from '../../components/ModalWeightAndHeight'
import ModalListSearchable from '../../components/ModalListSearchable'


export default class Profile extends React.Component {

	constructor(props) {
		super(props);	
		this.state = {
			modalAttendanceTypeVisible: false,
			modalHospitalizationType: false,
			modalHeightAndWeight: false,
			modalCRM: false,
			modalPrimaryCID: false,
			modalSecondaryCID: false,
			modalMainProcedure: false,
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

	toggleModalAttendanceType = () => {
		this.setState({modalAttendanceTypeVisible: !this.state.modalAttendanceTypeVisible})
	}

	handleAttendanceType = (attendanceType) => {
		this.props.handleAttendanceType(attendanceType.item.value)
		this.toggleModalAttendanceType()
	}

	toggleModalHospitalizationType = () => {
		this.setState({modalHospitalizationType: !this.state.modalHospitalizationType})
	}

	handleHospitalizationType = (hospitalizationType) => {
		this.props.handleHospitalizationType(hospitalizationType.item.value)
		this.toggleModalHospitalizationType()
	}

	toggleModalHeightAndWeight = () => {
		this.setState({modalHeightAndWeight: !this.state.modalHeightAndWeight})
	}

	handleHeightAndWeight = (patientHeight, patientWeight) => {
		this.props.handleHeightAndWeight(patientHeight, patientWeight)
		this.toggleModalHeightAndWeight()
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

	toggleModalCRM = () => {
		this.setState({modalCRM: !this.state.modalCRM})
	}

	handleCRM = (crm) => {
		this.props.handleCRM(crm)
		this.toggleModalCRM()
	}

	toggleModalPrimaryCID = () => {
		this.setState({modalPrimaryCID: !this.state.modalPrimaryCID})
	}

	handlePrimaryCID = (cid) => {
		this.props.handlePrimaryCID(cid.item)
		this.toggleModalPrimaryCID()
	}

	toggleModalSecondaryCID = () => {
		this.setState({modalSecondaryCID: !this.state.modalSecondaryCID})
	}

	handleSecondaryCID = (cid) => {
		this.props.handleSecondaryCID(cid.item)
		this.toggleModalSecondaryCID()
	}

	removeSecondaryCID = (item) => {
		Alert.alert(
			'Remover CID Secundário',
			'Deseja remover?',
			[
				{text: 'Cancelar', onPress: () => console.log('Remocao de CID secundário cancelado'), style: 'cancel', },
				{text: 'OK', onPress: () => this.props.removeSecondaryCID(item)},
			],
			{cancelable: false},
		);
	}

	toggleModalMainProcedure = () => {
		this.setState({modalMainProcedure: !this.state.modalMainProcedure})
	}

	handleMainProcedure = (procedure) => {
		this.props.handleMainProcedure(procedure.item)
		this.toggleModalMainProcedure()
	}

	render() {
		let CRM = this.props.perfil.mainProcedureCRM !== null ? this.props.perfil.mainProcedureCRM : 'INFORMAR'

		console.log("Base Data Sync => ", this.props.baseDataSync)
		console.log("Patient => ", this.props.perfil)

		return (
			<View style={ styles.container }>
				
				<ModalList paddingTop={70} height={45} visible={this.state.modalAttendanceTypeVisible} list={this.state.listAttendanceType} action={this.handleAttendanceType} />
				<ModalList paddingTop={70} height={45} visible={this.state.modalHospitalizationType}  list={this.state.listHospitalizationType}  action={this.handleHospitalizationType} />
				<ModalInput paddingTop={50} height={40} visible={this.state.modalCRM} label={'CRM'} value={this.props.perfil.mainProcedureCRM ? this.props.perfil.mainProcedureCRM : ''} action={ this.handleCRM} />
				<ModalWeightAndHeight paddingTop={50} height={70} visible={this.state.modalHeightAndWeight} patientHeight={this.props.perfil.patientHeight} patientWeight={this.props.perfil.patientWeight} action={ this.handleHeightAndWeight} />
				<ModalListSearchable paddingTop={20} height={80} visible={this.state.modalPrimaryCID} list={this.props.baseDataSync.cid} action={this.handlePrimaryCID} />
				<ModalListSearchable paddingTop={20} height={80} visible={this.state.modalSecondaryCID} list={this.props.baseDataSync.cid} action={this.handleSecondaryCID} />
				<ModalListSearchable paddingTop={20} height={80} visible={this.state.modalMainProcedure} list={this.props.baseDataSync.tuss} action={this.handleMainProcedure} />

				<TitleScreen marginTop={5} marginLeft={5} title={this.props.perfil.patientName} />
				<Line marginTop={3} marginBottom={3} marginLeft={5} width={90} size={2} />
				<TextLabel marginLeft="5" label='Prontuário' />
				<TextValue marginLeft="5" value={this.props.perfil.medicalRecordsNumber} />	

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Convênio' />
						<TextValue marginLeft="10" value={this.props.perfil.agreement} />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Plano' />
						<TextValue marginLeft="0" value={this.props.perfil.plane} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Nascimento' />
						<TextValue marginLeft="10" value={this.props.perfil.patientBornDate ? moment(this.props.perfil.patientBornDate).format('DD/MM/YYYY') : '' } />

						<TextValue marginLeft="20" size={13} value={ this.props.perfil.patientBornDate ? moment().diff(this.props.perfil.patientBornDate, 'years') + ' anos': '' }/>
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Altura/Peso' />
						<TextValue marginLeft="0" color={'#0000FF'} value={ this.props.perfil.patientHeight && this.props.perfil.patientWeight ? `${this.props.perfil.patientHeight}m / ${this.props.perfil.patientWeight}kg` : '' } press={ this.toggleModalHeightAndWeight } />
						<TextValue marginLeft="0" size={13} value={ this.props.perfil.patientHeight && this.props.perfil.patientWeight ? 'IMC ' + (Number(this.props.perfil.patientWeight) / Math.pow(Number(this.props.perfil.patientHeight), 2)).toFixed(2) : '' }/>
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Atendimento' />
						<TextValue marginLeft="10" color={'#0000FF'} value={ this.attendanceType(this.props.perfil.attendanceType) } press={ this.toggleModalAttendanceType } />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Tipo' />
						<TextValue marginLeft="0" color={'#0000FF'} value={ this.hospitalizationType(this.props.perfil.hospitalizationType) } press={ this.toggleModalHospitalizationType } />
					</View>
				</View>

				<Line marginTop={5} marginBottom={1} marginLeft={5} width={90} size={2} />

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data de Internação' />
						<TextValue marginLeft="5" value={ this.props.perfil.admissionDate ? moment(this.props.perfil.admissionDate).format('DD/MM/YYYY HH:mm') : ''} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						{this.props.perfil.trackingList.map((prop, index) => {
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

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data da Alta Médica' />
						<TextValue marginLeft="5" value={ this.props.perfil.medicalExitDate ? moment(this.props.perfil.medicalExitDate).format('DD/MM/YYYY HH:mm') : '' } />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data da Alta Administrativa' />
						<TextValue marginLeft="5" value={ this.props.perfil.exitDate ? moment(this.props.perfil.exitDate).format('DD/MM/YYYY HH:mm') : '' } />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Motivo da alta Administrativa' />
						<TextValue marginLeft="5" value={this.props.perfil.exitDescription} />
					</View>
				</View>
				
				<Line marginTop={5} marginBottom={1} marginLeft={5} width={90} size={2} />
				
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Procedimento Principal' />
						{
							this.props.perfil.mainProcedureTUSSDisplayName ? 
							<TextValue marginLeft="5" color={'#0000FF'} value={this.props.perfil.mainProcedureTUSSDisplayName} press={this.toggleModalMainProcedure} />
							:
							<TextValue marginLeft="5" color={'#0000FF'} value={'ESCOLHER'} press={this.toggleModalSecondaryCID} press={this.toggleModalMainProcedure} />	
						}
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='CRM do Responsável' />
						<TextValue marginLeft="5" color={'#0000FF'} value={CRM} press={ this.toggleModalCRM } />
					</View>
				</View>
				
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='CID Primário' />
						{this.props.perfil.diagnosticHypothesisList.map((prop) => {
							return (
								<TextValue color={'#0000FF'} key={prop.cidId} marginLeft="5" value={prop.cidDisplayName ? prop.cidDisplayName : 'Escolher'} press={this.toggleModalPrimaryCID} />
							);
						})}
					</View>
				</View>
					
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='CIDs Secundários' />
						<TextValue color={'#0000FF'} marginLeft="5" value={'ADICIONAR'} press={this.toggleModalSecondaryCID} />
						{ 
							this.props.perfil.secondaryCIDList.length ? 
								this.props.perfil.secondaryCIDList.map((cidItem) => {
									return (
										<Text style={styles.textValue} key={cidItem.cidId} onPress={ () => this.removeSecondaryCID(cidItem) }> { cidItem.cidDisplayName } </Text>
									);
								})
							: 
							<View/>
						}
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
		fontFamily: "Gotham Rounded-Book",
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
		fontFamily: "Gotham Rounded-Book",
		fontWeight: "normal", 
		fontStyle: "normal", 
		lineHeight: 22, 
		letterSpacing: 0,
		color: '#0000FF',
		fontSize: 18,
		marginTop: '3%', 
		marginLeft: '5%'
	}
});
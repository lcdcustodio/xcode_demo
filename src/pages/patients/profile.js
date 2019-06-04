import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, Modal, FlatList } from 'react-native';
import { Button, Icon } from 'native-base'
import TextLabel from '../../components/TextLabel'
import TextValue from '../../components/TextValue'
import Line from '../../components/Line'
import TitleScreen from '../../components/Title'
import moment from 'moment';

import ModalList from '../../components/ModalList'
import ModalWheelPicker from '../../components/ModalWheelPicker'
import ModalInput from '../../components/ModalInput'
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

	render() {
		let trackingListStartDate = null;
		let CRM = this.props.perfil.mainProcedureCRM !== null ? this.props.perfil.mainProcedureCRM : 'INFORMAR'

		if (this.props.perfil.trackingList.length > 0) {
			trackingListStartDate = moment(this.props.perfil.trackingList[0].startDate).format('DD/MM/YYYY');
		}
		
		return (
			<View style={ styles.container }>
				
				<ModalList visible={this.state.modalAttendanceTypeVisible} 
					list={this.state.listAttendanceType} 
					action={this.handleAttendanceType} />

				<ModalList visible={this.state.modalHospitalizationType} 
					list={this.state.listHospitalizationType} 
					action={this.handleHospitalizationType} />

				<ModalWheelPicker visible={this.state.modalHeightAndWeight} 
					initValueHeight={this.props.perfil.patientHeight} 
					initValueWeight={this.props.perfil.patientWeight} 
					actionClose={ this.handleHeightAndWeight} />

				<ModalInput visible={this.state.modalCRM} crm={this.props.perfil.mainProcedureCRM} action={ this.handleCRM} />

				<ModalListSearchable visible={this.state.modalPrimaryCID} 
					list={this.props.perfil.diagnosticHypothesisList} 
					action={this.toggleModalPrimaryCID} />

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
						<TextValue marginLeft="10" value={this.props.perfil.patientBornDate ? this.props.perfil.patientBornDate : '' } />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Altura/Peso' />
						<TextValue marginLeft="0" value={ this.props.perfil.patientHeight && this.props.perfil.patientWeight ? `${this.props.perfil.patientHeight}m / ${this.props.perfil.patientWeight}kg` : '' } press={ this.toggleModalHeightAndWeight } />
						<TextValue marginLeft="0" size={13} value={ this.props.perfil.patientHeight && this.props.perfil.patientWeight ? 'IMC ' + (this.props.perfil.patientWeight / Math.pow(this.props.perfil.patientHeight, 2)).toFixed(2) : '' }/>
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Atendimento' />
						<TextValue marginLeft="10" value={this.props.perfil.attendanceType} press={ this.toggleModalAttendanceType } />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Tipo' />
						<TextValue marginLeft="10" value={this.props.perfil.hospitalizationType} press={ this.toggleModalHospitalizationType } />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data de Internação' />
						<TextValue marginLeft="5" value={ this.props.perfil.admissionDate ? moment(this.props.perfil.admissionDate).format('DD/MM/YYYY HH:mm') : ''} />
					</View>
				</View>
					
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data de Início do Monitoramento' />
						<TextValue marginLeft="5" value={ trackingListStartDate ? moment(trackingListStartDate).format('DD/MM/YYYY HH:mm') : '' } />
					</View>
				</View>

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

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='CID Primário' />
						{this.props.perfil.diagnosticHypothesisList.map((prop) => {
							return (
								<TextValue key={prop.cidId} marginLeft="5" value={prop.cidDisplayName} press={this.toggleModalPrimaryCID} />
							);
						})}
					</View>
				</View>
					
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='CIDs Secundários' />
						{this.props.perfil.secondaryCIDList.map((prop) => {
							return (
								<TextValue key={prop.cidId} marginLeft="5" value={prop.cidDisplayName} />
							);
						})}
					</View>
				</View>
				
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='CRM do Responsável' />
						<TextValue marginLeft="5" value={CRM} press={ this.toggleModalCRM } />
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
});
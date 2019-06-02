import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, Modal, FlatList } from 'react-native';
import { Button, Icon } from 'native-base'

//Components 
import TextLabel from '../../components/TextLabel'
import TextValue from '../../components/TextValue'
import Line from '../../components/Line'
import TitleScreen from '../../components/Title'

import moment from 'moment';
import ModalList from '../../components/ModalList'
import ModalWheelPicker from '../../components/ModalWheelPicker'

export default class Profile extends React.Component {

	constructor(props) {
		super(props);	
		this.state = {
			modalAttendanceTypeVisible: false,
			modalHospitalizationType: false,
			modalHeightAndWeight: false,
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

	render() {
		let trackingListStartDate = null;
		let patientBornDate = this.props.perfil.patientBornDate !== null ? moment(this.props.perfil.patientBornDate).format('DD/MM/YYYY') : this.props.perfil.patientBornDate
		let admissionDate   = this.props.perfil.admissionDate   !== null ? moment(this.props.perfil.admissionDate).format('DD/MM/YYYY')   : this.props.perfil.admissionDate
		let medicalExitDate = this.props.perfil.medicalExitDate !== null ? moment(this.props.perfil.medicalExitDate).format('DD/MM/YYYY') : this.props.perfil.medicalExitDate
		let exitDate        = this.props.perfil.exitDate        !== null ? moment(this.props.perfil.exitDate).format('DD/MM/YYYY')        : this.props.perfil.exitDate

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
						<TextValue marginLeft="10" value={patientBornDate} />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Altura/Peso' />
						<TextValue marginLeft="0" value={ `${this.props.perfil.patientHeight}m / ${this.props.perfil.patientWeight}kg` } press={ this.toggleModalHeightAndWeight } />
						<TextValue marginLeft="0" size={13} value={'IMC ' + (this.props.perfil.patientWeight / Math.pow(this.props.perfil.patientHeight, 2)).toFixed(2) }/>
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
						<TextValue marginLeft="5" value={admissionDate} />
					</View>
				</View>
					
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data de Início do Monitoramento' />
						<TextValue marginLeft="5" value={trackingListStartDate} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data da Alta Médica' />
						<TextValue marginLeft="5" value={medicalExitDate} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data da Alta Administrativa' />
						<TextValue marginLeft="5" value={exitDate} />
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
								<TextValue key={prop.cidId} marginLeft="5" value={prop.cidDisplayName} />
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
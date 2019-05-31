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

export default class Profile extends React.Component {

	constructor(props) {
		super(props);	
		this.state = {
			modalVisible: false,
		}
	}

	toggleModal = () => {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	teste = (item) => {
		this.props.handleAttendanceType(item.value)
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

				{/* <Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible} >

					<View style={[styles.overlay, {paddingTop:'70%', paddingLeft:'5%', paddingRight:'5%'} ]}>

						<View style={{margin:'0%', width:'100%', height:'50%', backgroundColor: 'white', borderRadius: 4, borderColor:'#000000', borderStyle:'solid', borderWidth:1 }}>
							<FlatList
								data={[
									{key: 1, value: 'ELECTIVE', label: 'ELETIVO'},
									{key: 2, value: 'EMERGENCY', label: 'EMERGÊNCIA'},
								]}
								renderItem={ ({item}) => <Text style={styles.item} onPress={ () => {this.setState({modalVisible: !this.state.modalVisible}), this.teste(item) } } > {item.label} </Text>}
								keyExtractor={item => `${item.key}`} />
						</View>

					</View>
				</Modal> */}
				
				<ModalList />

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
						<TextValue marginLeft="0" value={ `${this.props.perfil.patientHeight}m / ${this.props.perfil.patientWeight}kg` } />
						<TextValue marginLeft="0" size={13} value={'IMC ' + (this.props.perfil.patientWeight / Math.pow(this.props.perfil.patientHeight, 2)).toFixed(2) }/>
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Atendimento' />
						<TextValue marginLeft="10" value={this.props.perfil.attendanceType} press={ this.toggleModal } />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Tipo' />
						<Picker style={{ marginLeft: '10%', width: '85%'}} mode={'dropdown'} selectedValue={this.props.perfil.hospitalizationType} onValueChange={(hospitalizationType) => this.props.handleHospitalizationType(hospitalizationType) }>
							<Picker.Item label="CLÍNICO" value="CLINICAL" />
							<Picker.Item label="CIRÚRGICO" value="SURGICAL" />
						</Picker>
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
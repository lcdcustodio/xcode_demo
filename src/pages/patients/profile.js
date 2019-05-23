import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

//Components 
import TextLabel from '../../components/TextLabel'
import TextValue from '../../components/TextValue'
import Line from '../../components/Line'
import TitleScreen from '../../components/Title'

export default class Profile extends React.Component {

	render() {
		return (
			<View style={ styles.container }>
				<TitleScreen marginTop={5} marginLeft={5} title={this.props.data.patient.name} />
				<Line marginTop={3} marginBottom={3} marginLeft={5} width={90} size={2} />
				<TextLabel marginLeft="5" label='Prontuário' />
				<TextValue marginLeft="5" value={this.props.data.patient.medicalRecords.number} />	

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Convênio' />
						<TextValue marginLeft="10" value={this.props.data.patient.medicalRecords.medicalAgreement} />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Plano' />
						<TextValue marginLeft="0" value={this.props.data.patient.medicalRecords.healthPlan} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Nascimento' />
						<TextValue marginLeft="10" value={this.props.data.patient.dateOfBirth} />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Altura/Peso' />
						<TextValue marginLeft="0" value={ `${this.props.data.patient.height}m / ${this.props.data.patient.weight}kg` } />
						<TextValue marginLeft="0" size={13} value={'IMC ' + (this.props.data.patient.weight / Math.pow(this.props.data.patient.height, 2)).toFixed(2) }/>
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Atendimento' />
						<TextValue marginLeft="10" value={this.props.data.patient.attendance.name} />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Tipo' />
						<TextValue marginLeft="0" value={this.props.data.patient.attendance.type} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data de Internação' />
						<TextValue marginLeft="5" value={this.props.data.patient.attendance.dateOfHospitalization} />
					</View>
				</View>
					
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data de Início do Monitoramento' />
						<TextValue marginLeft="5" value={this.props.data.patient.attendance.startDateOfMonitoring} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Procedimento Principal' />
						<TextValue marginLeft="5" value={this.props.data.patient.attendance.mainProcedure} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='CID Primário' />
						<TextValue marginLeft="5" value={this.props.data.patient.attendance.primaryCid} />
					</View>
				</View>
					
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='CIDs Secundários' />
						<TextValue marginLeft="5" value={this.props.data.patient.attendance.secondaryCid} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Informações Anteriores' />
						<TextValue marginLeft="5" value={this.props.data.patient.previousInformation} />
					</View>
				</View>
				<Text> {'\n'} </Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex'
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
	}
});
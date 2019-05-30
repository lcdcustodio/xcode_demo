import React, { Component } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import TextLabel from '../../components/TextLabel'

import TextValue from '../../components/TextValue'

import Line from '../../components/Line'

import TitleScreen from '../../components/Title'

import moment from 'moment';

export default class Profile extends React.Component {

	render() {

		console.log(this.props.perfil);

		let trackingListStartDate = null;

		if (this.props.perfil.trackingList.length > 0) {
			trackingListStartDate = this.props.perfil.trackingList[0].startDate;
		}

		return (
			<View style={ styles.container }>
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
						<TextValue marginLeft="0" value={ this.props.perfil.patientHeight && this.props.perfil.patientWeight ? `${this.props.perfil.patientHeight}m / ${this.props.perfil.patientWeight}kg` : '' } />
						<TextValue marginLeft="0" size={13} value={ this.props.perfil.patientHeight && this.props.perfil.patientWeight ? 'IMC ' + (this.props.perfil.patientWeight / Math.pow(this.props.perfil.patientHeight, 2)).toFixed(2) : '' }/>
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column50 }>
						<TextLabel marginLeft="10" label='Atendimento' />
						<TextValue marginLeft="10" value={this.props.perfil.attendanceType} />
					</View>
					
					<View style={ styles.column50 }>
						<TextLabel marginLeft="0" label='Tipo' />
						<TextValue marginLeft="0" value={this.props.perfil.hospitalizationType} />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data de Internação' />
						<TextValue marginLeft="5" value={ this.props.perfil.admissionDate ? moment(this.props.perfil.admissionDate).format('DD/MM/YYYY HH:mm:ss') : ''} />
					</View>
				</View>
					
				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data de Início do Monitoramento' />
						<TextValue marginLeft="5" value={ trackingListStartDate ? moment(trackingListStartDate).format('DD/MM/YYYY HH:mm:ss') : '' } />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data da Alta Médica' />
						<TextValue marginLeft="5" value={ this.props.perfil.medicalExitDate ? moment(this.props.perfil.medicalExitDate).format('DD/MM/YYYY HH:mm:ss') : '' } />
					</View>
				</View>

				<View style={ styles.row }>
					<View style={ styles.column100 }>
						<TextLabel marginLeft="5" label='Data da Alta Administrativa' />
						<TextValue marginLeft="5" value={ this.props.perfil.exitDate ? moment(this.props.perfil.exitDate).format('DD/MM/YYYY HH:mm:ss') : '' } />
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
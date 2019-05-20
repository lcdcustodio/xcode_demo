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
			<View style={{display: 'flex'}}>
				<TitleScreen marginTop={17} marginLeft={5} title="Francielle da Silva" />
				<Line marginTop={3} marginBottom={3} marginLeft={5} width={90} size={2} />
				<TextLabel marginLeft="5" label='Prontuário' />
				<TextValue marginLeft="5" value="005474211" />	

				<View style={{flexDirection: 'row', marginTop: '5%', borderWidth: 0, borderColor: '#d6d7da' }}>
					<View style={{justifyContent: 'flex-start', width: '50%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="10" label='Convênio' />
						<TextValue marginLeft="10" value="Bradesco" />
					</View>
					
					<View style={{justifyContent: 'flex-start'}}>
						<TextLabel marginLeft="0" label='Plano' />
						<TextValue marginLeft="0" value="Saúde Rio" />
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: '5%'}}>
					<View style={{justifyContent: 'flex-start', width: '50%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="10" label='Nascimento' />
						<TextValue marginLeft="10" value="09/10/1992" />
					</View>
					
					<View style={{justifyContent: 'flex-start'}}>
						<TextLabel marginLeft="0" label='Altura/Peso' />
						<TextValue marginLeft="0" value="1.65m/89.6Kg" />
						<TextValue marginLeft="0" size={13} value="IMC 32.91" />
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: '5%'}}>
					<View style={{justifyContent: 'flex-start', width: '50%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="10" label='Atendimento' />
						<TextValue marginLeft="10" value="Emergencial" />
					</View>
					
					<View style={{justifyContent: 'flex-start'}}>
						<TextLabel marginLeft="0" label='Tipo' />
						<TextValue marginLeft="0" value="Cirúrgico" />
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: '5%'}}>
					<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="5" label='Data de Internação' />
						<TextValue marginLeft="5" value="13/05/2019 - D3 de internação" />
					</View>
				</View>
					
				<View style={{flexDirection: 'row', marginTop: '5%'}}>
					<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="5" label='Data de Início do Monitoramento' />
						<TextValue marginLeft="5" value="13/05/2019" />
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: '5%'}}>
					<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="5" label='Procedimento Principal' />
						<TextValue marginLeft="5" value="30804132 - Toracostomia com drenagem pleural fechada" />
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: '5%'}}>
					<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="5" label='CID Primário' />
						<TextValue marginLeft="5" value="J930 - Pneumotórax de tensão, espontâneo" />
					</View>
				</View>
					
				<View style={{flexDirection: 'row', marginTop: '5%'}}>
					<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="5" label='CIDs Secundários' />
						<TextValue marginLeft="5" value="Adicionar" />
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: '5%'}}>
					<View style={{justifyContent: 'flex-start', width: '100%', borderWidth: 0, borderColor: '#d6d7da'}}>
						<TextLabel marginLeft="5" label='Informações Anteriores' />
						<TextValue marginLeft="5" value="J930 - Pneumotórax de tensão, espontâneo" />
					</View>
				</View>
				<Text> {'\n'} </Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	
});
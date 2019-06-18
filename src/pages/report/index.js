import React, { Component } from 'react';
import { Container, Content, Left, Text, Card, CardItem } from 'native-base';
import { DataTable } from 'react-native-paper';
import { RdHeader } from '../../components/rededor-base';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

export default class Report extends Component {

	constructor(props) {		
		super(props);
		console.log('Ok');
	}s

	render() {
		return (
			<Container>
				<RdHeader title='Relatório Consolidado' goBack={() => {console.log("BACK")}}/>


				<Content style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
		         <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Pacientes Internados</Text>
						</Left>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Bangu</DataTable.Cell>
							<DataTable.Cell numeric>1</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Barra D'or</DataTable.Cell>
							<DataTable.Cell numeric>3</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Caxias D'or</DataTable.Cell>
							<DataTable.Cell numeric>10</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Copa D'or</DataTable.Cell>
							<DataTable.Cell numeric>0</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Niterói D'or</DataTable.Cell>
							<DataTable.Cell numeric>3</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Norte D'or</DataTable.Cell>
							<DataTable.Cell numeric>5</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Oeste D'or</DataTable.Cell>
							<DataTable.Cell numeric>1</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Quinta D'or</DataTable.Cell>
							<DataTable.Cell numeric>9</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Rios D'or</DataTable.Cell>
							<DataTable.Cell numeric>4</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Hospital Real D'or</DataTable.Cell>
							<DataTable.Cell numeric>1</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#cfd7e4', minHeight: 20, height: 40}}>
							<DataTable.Cell>Total de Pacientes</DataTable.Cell>
							<DataTable.Cell numeric>30</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Tipo de Internação</Text>
						</Left>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Eletivo</DataTable.Cell>
							<DataTable.Cell numeric>0</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Urgência</DataTable.Cell>
							<DataTable.Cell numeric>17</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Sem Informação</DataTable.Cell>
							<DataTable.Cell numeric>20</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Tempo de Internação</Text>
						</Left>
					</CardItem>
					<DataTable>
						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Até 5 dias internado</DataTable.Cell>
							<DataTable.Cell numeric>0</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row style={{backgroundColor:'#ededed', minHeight: 20, height: 32}}>
							<DataTable.Cell>Entre 5 e 49 dias internado</DataTable.Cell>
							<DataTable.Cell numeric>20</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row style={{backgroundColor:'#ffffff', minHeight: 20, height: 32}}>
							<DataTable.Cell>Com 50 ou mais dias internado</DataTable.Cell>
							<DataTable.Cell numeric>2</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				 <Card>
					<CardItem style={{backgroundColor: '#CCE5FF', minHeight: 20, height: 40}}>
						<Left>
							<Text>Tipo Acomodação</Text>
						</Left>
					</CardItem>
					<DataTable>
						<DataTable.Row>
							<DataTable.Cell>CTI/UTI</DataTable.Cell>
							<DataTable.Cell numeric>10</DataTable.Cell>
						</DataTable.Row>
				
						<DataTable.Row>
							<DataTable.Cell>USI</DataTable.Cell>
							<DataTable.Cell numeric>2</DataTable.Cell>
						</DataTable.Row>

						<DataTable.Row>
							<DataTable.Cell>Quarto/Enfermaria</DataTable.Cell>
							<DataTable.Cell numeric>25</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				 </Card>

				</Content>
			</Container>
		);
	}
}

	
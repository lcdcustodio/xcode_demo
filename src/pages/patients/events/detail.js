import React, { Component } from "react";
import { Container, Content, Header, Left, Body, Icon, Text, Title, Footer, FooterTab } from 'native-base';
import { StyleSheet } from "react-native";
import { TimelineEventEnum } from '../../../util/TimelineEvent'
import ExamRequestView		from './ExamRequestView';
import FurtherOpinionView	from './FurtherOpinionView';
import MedicalProcedureView	from './MedicalProcedureView';
import MedicineUsageView	from './MedicineUsageView';

export default class EventDetail extends Component {
    
	constructor(props) {
		super(props);
		this.state = this._loadState();
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		this.setState(this._loadState());
	});

	render() {
		return (
			<Container>
				<Header style={ styles.header }>
					<Left style={{flex:1}} >
						<Icon type="AntDesign" name="left" style={{ color: 'white' }}  onPress={this._goBack} />
					</Left>
					<Body style={{flex: 7, alignItems: 'stretch'}}>
						<Title>{this.state.event.type}</Title>
					</Body>
				</Header>
				<Content padder>{this._selectElement()}</Content>
				<Footer>
					<FooterTab>
					</FooterTab>
				</Footer>
			</Container>
		);
	}

	_loadState = () => {
		return {
			event: this._loadArgument('event'),
			patient: this._loadArgument('patient'),
			hospital: this._loadArgument('hospital'),
			baseDataSync: this._loadArgument('baseDataSync'),
		};
	}

	_loadArgument = (name) => {
		return this.props[name] || this.props.navigation.getParam(name);
	}

	_goBack = () => {
		this.props.navigation.navigate("PatientDetail", {
			patient: this.state.patient,
			hospital: this.state.hospital,
			baseDataSync: this.state.baseDataSync,
			selectedTab: 'events', // não funcionando
		});
	}

	_selectElement = () => {
		switch (this.state.event.typeEnum) {
			case TimelineEventEnum.ExamRequest:
				return <ExamRequestView event={this.state.event}/>;

			case TimelineEventEnum.FurtherOpinion:
				return <FurtherOpinionView event={this.state.event}/>;

			case TimelineEventEnum.MedicalProcedure:
				return <MedicalProcedureView event={this.state.event}/>;

			case TimelineEventEnum.MedicineUsage:
				return <MedicineUsageView event={this.state.event}/>;
		}
	}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#005cd1"
	},
	footer: {
		backgroundColor: "#005cd1"
	},
	productContainer: {
		backgroundColor: "#FFF",
		borderBottomWidth: 1,
		borderBottomColor: "#DDD",
		padding: 20
	},
	productTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333"
	},
	productDescription: {
		fontSize: 16,
		color: "#999",
		marginTop: 5,
		lineHeight: 24
	},
	patientName: {
		marginTop: '17%',
		marginLeft: '5%',
		fontFamily: "Gotham Rounded",
		fontSize: 20,
		fontWeight: "400",
		fontStyle: "normal",
		lineHeight: 24,
		letterSpacing: 0,
		textAlign: "left",
		color: "rgb(25, 118, 159)"
	},
});

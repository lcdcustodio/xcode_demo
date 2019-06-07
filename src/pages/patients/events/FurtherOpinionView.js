import React, { Component } from "react";
import { View } from 'native-base';
import { Switch } from "react-native-gesture-handler";
import TextLabel from '../../../components/TextLabel';
import TextValue from '../../../components/TextValue';
import DateTimeValue from '../../../components/DateTimeValue';

export default class FurtherOpinionView extends Component {
    
	render() {
		const {data} = this.props.event;
        return (
			<View>
				<TextLabel label='Especialidade'/>
				<TextValue value={data.specialtyDisplayName}/>
				<TextLabel label='Data do Pedido'/>
				<DateTimeValue value={data.performedAt} format='DD/MM/YYYY'/>
				<TextLabel label='Respondido'/>
				<Switch value={!!data.responseDate}/>
			</View>
		);
	}
}

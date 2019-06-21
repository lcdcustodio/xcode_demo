import React, { Component } from "react";
import { View } from 'native-base';
import { Switch } from "react-native-gesture-handler";
import TextLabel from '../../../components/TextLabel';
import TextValue from '../../../components/TextValue';
import DateTimeValue from '../../../components/DateTimeValue';

export default class MedicalProcedureView extends Component {
    
	render() {
		const {data} = this.props.event;
        return (
			<View>
				<TextLabel label='TUSS'/>
				<TextValue value={data.tussDisplayName}/>
				<TextLabel label='Data'/>
				<DateTimeValue value={data.performedAt} format='DD/MM/YYYY'/>
				<TextLabel label='Complicação'/>
				<Switch value={data.complication}/>
			</View>
		);
	}
}

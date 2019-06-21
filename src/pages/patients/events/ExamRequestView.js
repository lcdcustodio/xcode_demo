import React, { Component } from "react";
import { View } from 'native-base';
import TextLabel from '../../../components/TextLabel';
import TextValue from '../../../components/TextValue';
import DateTimeValue from '../../../components/DateTimeValue';

export default class ExamRequestView extends Component {
    
	render() {
		const {data} = this.props.event;
        return (
			<View>
				<TextLabel label='Exame'/>
				<TextValue value={data.examDisplayName}/>
				<TextLabel label='Alto Custo'/>
				<TextValue value={data.examHighCost ? 'Sim' : 'Não'}/>
				<TextLabel label='Data'/>
				<DateTimeValue value={data.performedAt} format='DD/MM/YYYY'/>
			</View>
		);
	}
}

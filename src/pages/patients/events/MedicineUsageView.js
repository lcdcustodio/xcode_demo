import React, { Component } from "react";
import { View } from 'native-base';
import TextLabel from '../../../components/TextLabel';
import TextValue from '../../../components/TextValue';
import DateTimeValue from '../../../components/DateTimeValue';

export default class MedicineUsageView extends Component {
    
	render() {
		const {data} = this.props.event;
        return (
			<View>
				<TextLabel label='Medicamento'/>
				<TextValue value={data.medicineDisplayName}x/>
				<TextLabel label={'Alto Custo'}/>
				<TextValue value={data.medicineHighCost ? 'Sim' : 'Não'}/>
				<TextLabel label='Data da Prescrição'/>
				<DateTimeValue value={data.performedAt} format='DD/MM/YYYY'/>
			</View>
		);
	}
}

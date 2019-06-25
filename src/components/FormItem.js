import React from 'react';
import { Text, ListItem } from 'native-base';

import TextValue from './TextValue';

const FormItem = (props) => (
	<ListItem>
		<Text style={{fontWeight: 'bold'}}>
			{ props.label + '\n'}
			<TextValue color={'#0000FF'} value={props.value} press={props.onPress} />
		</Text>
	</ListItem>
);

export default FormItem;

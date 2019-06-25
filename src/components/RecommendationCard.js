import React from 'react';
import { Avatar, Card, List } from 'react-native-paper';

const RecommendationCard = (props) => (
	<Card elevation={10} style={ styles.card } onPress={ props.onPress }>
		<List.Item
			title={ props.title }
			description={ props.description }
			left={ () => (
				<Avatar.Text
					size={ 20 }
					style={{ marginTop: 10 }}
					label={ props.number }
				/>
			)}
		/>
	</Card>
);

const styles = {
	card: {
		marginBottom: 10,
	},
};

export default RecommendationCard;

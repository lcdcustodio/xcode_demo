import React, { Component } from 'react';
import { Text } from 'react-native';
import { Avatar, Card, List } from 'react-native-paper';

class RecommendationCardToggle extends Component {

	render() {
		const style = (this.props.visible ? {} : styles.disabledCard);

		return (
			<Card elevation={10} style={ styles.card }>
				<List.Accordion
					title={ this.props.title }
					description={ this.props.subtitle }
					style={styles.item}
					left={ () => (
						<Avatar.Text
							size={ 20 }
							label={ this.props.number }
							style={ style }
						/>
					)}
					expanded={this.props.visible}
					onPress={this.props.onPress}
				>
					{ this.props.children }
				</List.Accordion>
			</Card>
		);
	}
}

const styles = {
	card: {
		marginBottom: 10
	},
	disabledCard: {
		backgroundColor: '#eee',
	},
};

export default RecommendationCardToggle;

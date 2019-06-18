import React, { Component } from 'react';
import { Avatar, Card, List } from 'react-native-paper';

class RecommendationCardToggle extends Component {

	_handlePress = () => {
		const { stateHolder, stateName } = this.props;
		const currentState = stateHolder.state[stateName];
		const newState = {};
		newState[stateName] = {
			...currentState,
			isSet: !currentState.isSet
		};
		stateHolder.setState(newState);
	}

	render() {
		const { stateHolder, stateName } = this.props;
		const currentState = stateHolder.state[stateName];
		const style = (currentState.isSet ? {} : styles.disabledCard);
		return (
			<Card elevation={10} style={ styles.card }>
				<List.Accordion
					title={ this.props.title }
					description='Requisitado pelo médico'
					left={ () => (
						<Avatar.Text
							size={ 20 }
							label={ this.props.number }
							style={ style }
						/>
					)}
					expanded={currentState.isSet}
					onPress={this._handlePress}
				>
					{ this.props.children }
				</List.Accordion>
			</Card>
		);
	}
}

const styles = {
	card: {
		marginBottom: 10,
    },
	disabledCard: {
		backgroundColor: '#eee',
	},
};

export default RecommendationCardToggle;

import React, { Component } from 'react';
import { ScrollView, FlatList } from 'react-native';
import { Button, Dialog, Portal, Divider, Searchbar, List } from 'react-native-paper';
import moment from 'moment';
import data from '../../data.json';

export default class ModalPrimaryCID extends Component {

    constructor(props) {
        super(props);
        const { stateHolder, stateName } = this.props;
        if (!stateHolder.state.hasOwnProperty(stateName)) {
            stateHolder.state[stateName] = false;
        }
		this.state = {
			cid: data.cid,
			query: null,
			filteredList: data.cid,
		}
        console.log('constructor', this.props.stateHolder.state);
    }

    _isVisible = () => {
        return this.props.stateHolder.state[this.props.stateName];
    }

    _close = () => {
        this.props.stateHolder.setState({ [this.props.stateName]: false });
    }

    render() {
        if (!this._isVisible()) return null;
        return (
            <Portal>
                <Dialog style={{ height: '70%' }} visible={ true } onDismiss={ this._close }>
                    <Dialog.ScrollArea>
                        <Dialog.Title>CID Primário</Dialog.Title>
                        <Searchbar placeholder="Filtrar" value={ this.state.query } onChangeText={ this.filter } />
                        <ScrollView style={{marginTop: 20}} contentContainerStyle={{ paddingHorizontal: 10 }}>
                            <List.Section>
                                <FlatList
                                    data={this.state.filteredList}
                                    keyExtractor={element => `${element.id}`}
                                    renderItem={this.renderItemPrimary} />
                            </List.Section>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Divider />
                    <Dialog.Actions>
                        <Button onPress={ this._close }>Fechar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }

	filter = (query) => {
		const filteredList = this.state.cid.filter(item => {
			return (
				item.name.toUpperCase().includes(query.toUpperCase()) ||
				item.normalizedName.toUpperCase().includes(query.toUpperCase()) ||
				item.code.toUpperCase().includes(query.toUpperCase())
			)
		});
		this.setState({
			query: query,
			filteredList: filteredList,
		});
	}

	handlePrimaryCID = (cid) => {
		let diagnosticHypothesisList = []
		let diagnosticHypothesis = {
			beginDate: moment(),
			cidDisplayName: `${cid.item.code} - ${cid.item.name}`,
			cidId: cid.item.id,
			uuid: uuidv4()
		}
		diagnosticHypothesisList.push(diagnosticHypothesis)

        this.props.handleUpdatePatient('diagnosticHypothesisList', diagnosticHypothesisList)
        this._close();
		this.setState({
			query: null,
			filteredList: data.cid,
		})
	}

    renderItemPrimary = (element) => {
		return (
			<List.Item title={`${element.item.code} - ${element.item.name}`} onPress={() => { this.handlePrimaryCID(element) }} />
		);
	}
}

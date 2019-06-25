import React, { Component } from 'react';
import { ScrollView, FlatList } from 'react-native';
import { Button, Dialog, Portal, Divider, Searchbar, List } from 'react-native-paper';

export default class ModalPrimaryCID extends Component {

    constructor(props) {
        super(props);
		this.state = {
			list: this.props.list,
			query: null
		}
    }

    renderItem = (element) => {
        if (element.item.code && element.item.code !== null) {
            return(
                <List.Item title={`${element.item.code} - ${element.item.name}`} onPress={() => {this.props.onSelect(element)} }/>
            );
        } else {
            return (
                <List.Item title={`${element.item.name}`} onPress={() => {this.props.onSelect(element)} }/>
            );
        }
    }
    
    filter = query => { 
        const newList = this.props.list.filter(item => {
            if(item.code != null) {
                return (
                    item.normalizedName.toUpperCase().includes(query.toUpperCase()) || 
                    item.code.toUpperCase().includes(query.toUpperCase())
                )  
            } else {
                return (item.normalizedName.toUpperCase().includes(query.toUpperCase()))
            }
        });
    
        this.setState({ 
            query: query,
            list: newList 
        });
    };
    
    render() {
        return (
            <Portal>
                <Dialog style={{ height: '70%' }} visible={ this.props.visible } onDismiss={ this.props.close }>
                    <Dialog.ScrollArea>
                        <Dialog.Title>{this.props.title}</Dialog.Title>
                        <Searchbar placeholder="Filtrar" value={ this.state.query } onChangeText={ this.filter } />
                        <ScrollView style={{marginTop: 20}} contentContainerStyle={{ paddingHorizontal: 10 }}>
                            <List.Section>
                                <FlatList
                                    data={this.state.list}
                                    keyExtractor={element => `${element.id}`}
                                    renderItem={this.renderItem} />
                            </List.Section>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Divider />
                    <Dialog.Actions>
                        <Button onPress={ this.props.close }>Fechar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }
}

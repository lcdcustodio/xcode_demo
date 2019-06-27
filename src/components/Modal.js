import React, { Component } from 'react';
import { ScrollView, FlatList, Keyboard, Text, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Divider, Searchbar, List } from 'react-native-paper';

export default class ModalPrimaryCID extends Component {

    constructor(props) {
        super(props);
		this.state = {
			list: this.props.list,
            query: null,
            keyboardSpace: 0
        }
        
        Keyboard.addListener('keyboardDidShow',(frames)=>{
            if (!frames.endCoordinates) return;
            this.setState({
				keyboardSpace: frames.endCoordinates.height
			});
		});
		
        Keyboard.addListener('keyboardDidHide',(frames)=>{
            this.setState({keyboardSpace:0});
        });
    }

    renderItem = (element) => {
        if (element.item.code && element.item.code !== null) {
            return(
                <Text style={styles.dialogListItem} onPress={() => { this.props.onSelect(element) }}> {`${element.item.code} - ${element.item.name}`} </Text>
            );
        } else {
            return (
                <Text style={styles.dialogListItem} onPress={() => { this.props.onSelect(element) }}> {`${element.item.name}`} </Text>
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
                <Dialog style={{ marginLeft:5, marginRight:5, paddingLeft:0, height: this.state.keyboardSpace ? '52%' : '84%', top: this.state.keyboardSpace ? -(this.state.keyboardSpace * .47) : 0}} visible={ this.props.visible } onDismiss={ this.props.close }>
                    <Dialog.ScrollArea>
                        <Dialog.Title style={ styles.dialogTitle }> {this.props.title} </Dialog.Title>
                        <Searchbar style={ styles.dialogSearchbar } placeholder="Filtrar" value={ this.state.query } onChangeText={ this.filter } />
                        <ScrollView style={ styles.dialogScrollView }>
                            <List.Section>
                                <FlatList
                                    data={this.state.list}
                                    keyExtractor={element => `${element.id}`}
                                    renderItem={this.renderItem} 
                                    keyboardShouldPersistTaps="always" />
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

const styles = StyleSheet.create({
    dialogTitle: {
        marginTop: 20, 
        marginLeft: -15, 
        marginRight: -15
    },
    dialogSearchbar: {
        marginLeft: -15, 
        marginRight: -15
    },
    dialogScrollView: {
        marginTop: 20, 
        marginLeft: -18, 
        marginRight: -18
    },
    dialogListItem: {
        padding: 10, 
        fontSize: 14,
        width: '100%'
    }
});

import React, { Component } from "react";
import { View, Text, StyleSheet, Modal, FlatList, TextInput } from "react-native";
import PropTypes from 'prop-types';
import _ from 'lodash'

export default class ModalListSearchable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: null,
      listCID: this.props.list
    }
  }

  searchFilterFunction = text => { 
    const newListCID = this.props.list.filter(cid => {
			return (cid.cidDisplayName.toUpperCase().includes(text.toUpperCase()))
		});

    this.setState({ listCID: newListCID });
  };

  renderHeader = () => {    
    return (
      <TextInput editable = {true} value={this.state.filter}
        onChangeText={this.searchFilterFunction}
        style={{marginLeft: '5%', marginTop: '5%', marginBottom: '5%', width: '90%', height: '50%', color:'#000000', borderColor: 'gray', borderWidth: 1}} />
    );
  };

  render(){
    return (
      <Modal
					animationType="fade"
					transparent={true}
					visible={this.props.visible} >

					<View style={styles.overlay}>
						<View style={styles.container}>
							<FlatList
                data={this.state.listCID}
								renderItem={ element => <Text style={styles.text} onPress={ () => { this.props.action(element) }}> {element.item.cidDisplayName} </Text> } 
                keyExtractor={element => `${element.uuid}`}
                ListHeaderComponent={this.renderHeader}
                />
						</View>

					</View>
      </Modal>
    )
  }
}

ModalListSearchable.propTypes = {
  visible: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      cidId: PropTypes.number.isRequired,
      cidDisplayName: PropTypes.string.isRequired,
    })
  ).isRequired,
  action: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: "row",
    paddingTop:'30%', 
    paddingLeft:'5%', 
    paddingRight:'5%'
  },
  container: {
    margin:'0%', 
    width:'100%', 
    height:'50%', 
    backgroundColor: 'white', 
    borderRadius: 4, 
    borderColor:'#000000', 
    borderStyle:'solid', 
    borderWidth:1
  },
  text: {
    padding: 10,
    fontSize: 18,
  },
})
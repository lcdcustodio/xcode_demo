import React, { Component } from "react";
import { View, Text, StyleSheet, Modal, FlatList, TextInput } from "react-native";
import PropTypes from 'prop-types';
import _ from 'lodash'

export default class ModalListSearchable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: null,
      list: this.props.list
    }
  }

  searchFilterFunction = text => { 
    const newList = this.props.list.filter(item => {
      if(item.code != null) {
        return (item.normalizedName.toUpperCase().includes(text.toUpperCase()) || item.code.toUpperCase().includes(text.toUpperCase()))  
      } else {
        return (item.normalizedName.toUpperCase().includes(text.toUpperCase()))
      }
		});

    this.setState({ list: newList });
  };

  renderHeader = () => {    
    return (
      <TextInput editable = {true} value={this.state.filter}
        onChangeText={this.searchFilterFunction}
        style={{marginLeft: 20, marginTop: 20, marginBottom: 20, width: '90%', height: 50, color:'#000000', borderColor: 'gray', borderWidth: 1}} />
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
                data={this.state.list}
                renderItem={ (element, index) => 
                  <Text style={styles.text} onPress={ () => { this.props.action(element) }}> 
                    { element.item.code !== null ? `${element.item.code} - ${element.item.name}` : element.item.name }
                  </Text> 
                } 
                keyExtractor={element => `${element.id}`}
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
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  action: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: "row",
    paddingTop:'20%', 
    paddingLeft:'5%', 
    paddingRight:'5%'
  },
  container: {
    margin:'0%', 
    width:'100%', 
    height:'80%', 
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
import React, { Component } from "react";
import { View, Text, StyleSheet, Modal, FlatList } from "react-native";
import PropTypes from 'prop-types';

export default class ModalList extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <Modal
					animationType="fade"
					transparent={true}
					visible={this.props.visible} >

					<View style={styles.overlay}>
						<View style={styles.container}>
							<FlatList
								data={this.props.list}
								renderItem={ element => <Text style={styles.text} onPress={ () => { this.props.action(element) }}> {element.item.label} </Text> } 
                keyExtractor={element => `${element.key}`}
                />
						</View>

					</View>
      </Modal>
    )
  }
}

ModalList.propTypes = {
  visible: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  action: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: "row",
    paddingTop:'70%', 
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
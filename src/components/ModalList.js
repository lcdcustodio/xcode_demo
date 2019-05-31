import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
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
								renderItem={ (item) => { 
                  <Text style={styles.item} onPress={ () => {this.setState({modalVisible: !this.props.visible}), this.props.action(item) } } >
                    {item.label} 
                  </Text>
                }}
								keyExtractor={item => `${item.key}`} />
						</View>

					</View>
      </Modal>
    )
  }
}

ModalList.propTypes = {
  visible: PropTypes.bool.isRequired,
  list: PropTypes.array.isRequired.shape({
    key: PropTypes.number,
    value: PropTypes.string,
    label: PropTypes.string
  }),
}
/* 
ModalList.defaultProps  = {
  visible: true,
  list: [
    { key: 1, value: 'opt1', label: 'OPTION 1' },
    { key: 2, value: 'opt2', label: 'OPTION 2' }
  ]
} */

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
  item: {
    padding: 10,
    fontSize: 18,
  },
})
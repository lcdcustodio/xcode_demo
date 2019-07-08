import { StyleSheet } from "react-native";
import { Platform } from "react-native";

export default StyleSheet.create({
	
	container: {
    flexDirection: "row", 
    alignItems: 'flex-start',
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    width: '100%'
	},

	title: {
		fontSize: 14,
    color: "#333",
    marginLeft: 10, 
    paddingTop: 10,
    paddingBottom: 10,
	},
	
	hospitalIcon: {
    height: 60,
    width: 140,
    color: "#333",
    alignItems: 'center', 
    textAlign: "center", 
    justifyContent: 'center'
  },
   
  niceBlue: {color:  "#19769F"}, 

  description : {
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "left",
    color: "#51565f" ,
    marginTop: 7, 
    marginLeft: 5, 
    marginBottom: 5
  }, 

    sideButtonRight : {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        backgroundColor: "#005cd1",
        fontWeight: "bold"
    }, 

  headerMenu: {backgroundColor: "#005cd1"}, 

  calendarIcon : { color: '#005cd1', fontSize: 18, marginTop: 3, marginBottom: 3, marginLeft: 10}, 

  userIcon : { color: '#005cd1', fontSize: 18, marginTop: 3, marginBottom: 3, marginLeft: 10},
  spinnerTextStyle: {
      color: '#FFF'
  },
  listItemPatient: {
    marginTop: 0, 
    marginBottom: 0
  },
  onePicker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 66 : 44
  },
  onePickerItem: {
    height: Platform.OS === 'ios' ? 66 : 44
  }
});
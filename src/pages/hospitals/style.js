import { StyleSheet } from "react-native";
import { Right } from "native-base";

export default StyleSheet.create({
	
	container: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    padding: 10
	},

	title: {
		fontSize: 18,
		fontWeight: "bold",
    color: "#333", 
    padding: 10
	},

	sideMenuLogoIcon: {
		resizeMode: 'center',
		width: 175,
		height: 86,
	},
	
	circleIcon: {
		width: 59.3,
		height: 59.3,
		borderWidth: 1,
    borderColor: "#eeeeee"    
  },
   
  niceBlue: {color:  "#19769F", padding: 10}, 

  description : {
    width: 100,
    height: 15,
    fontFamily: "Gotham Rounded",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "left",
    color: "#51565f", 
    backgroundColor: '#C0C0C0'
  }, 

  sideButtonRight : {
    width: 0,
    height: 80,
    backgroundColor: "#005cd1",
    alignItems : 'stretch'
  }, 

  justifyContent : {
    justifyContent : 'space-between'
  }
});
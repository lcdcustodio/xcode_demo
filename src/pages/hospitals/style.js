import { StyleSheet } from "react-native";

export default StyleSheet.create({
	
	container: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: 'flex-start',
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    padding: 0
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
    borderColor: "#eeeeee",
    marginLeft: 15
  },
   
  niceBlue: {color:  "#19769F", padding: 10}, 

  description : {
    width: 100,
    height: 18,
    fontFamily: "Gotham Rounded",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "left",
    color: "#51565f" ,
    maxWidth: 100, 
    marginTop: 10, 
    marginLeft: 10
  }, 

  sideButtonRight : {
    height: 100,
    backgroundColor: "#005cd1",
    marginLeft: 120,
    paddingTop: 40, 
    fontWeight: "bold"
   }, 

  justifyContent : {
    justifyContent : 'space-between'
  }
});
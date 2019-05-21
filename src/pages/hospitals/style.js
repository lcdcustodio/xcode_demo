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
    padding: 5,
    width: 300, 
	},
	
	hospitalIcon: {
    width: 150,
		height: 100,
    resizeMode: 'center',
  },
   
  niceBlue: {color:  "#19769F", paddingLeft: 2}, 

  description : {
    width: 200,
    maxWidth: 200, 
    height: 15,
    fontFamily: "Gotham Rounded",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "left",
    color: "#51565f" ,
    marginTop: 10, 
    marginLeft: 10
  }, 

  sideButtonRight : {
    height: 110,
    backgroundColor: "#005cd1",
    marginLeft: 120,
    paddingTop: 40, 
    fontWeight: "bold"
   }, 

  justifyContent : {
    justifyContent : 'space-between'
  }, 

  headerMenu: {backgroundColor: "#005cd1"}, 

  calendarIcon : { color: '#005cd1', fontSize: 20}, 

  userIcon : { color: '#005cd1', fontSize: 20}
});
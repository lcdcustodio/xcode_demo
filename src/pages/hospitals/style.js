import { StyleSheet } from "react-native";

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
		fontSize: 18,
		fontWeight: "bold",
    color: "#333", 
    padding: 5,
    width: '100%',
	},
	
	hospitalIcon: {
    width: 175,
    height: 86, 
  },
   
  niceBlue: {color:  "#19769F", paddingLeft: 2}, 

  description : {
    height: '50%',
    fontFamily: "Gotham Rounded",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "left",
    color: "#51565f" ,
    marginTop: 10, 
    marginLeft: 10, 
  }, 

  sideButtonRight : {
    height: '100%',
    backgroundColor: "#005cd1",
    paddingTop: '8%', 
    fontWeight: "bold"
   }, 

  headerMenu: {backgroundColor: "#005cd1"}, 

  calendarIcon : { color: '#005cd1', fontSize: 20}, 

  userIcon : { color: '#005cd1', fontSize: 20}
});
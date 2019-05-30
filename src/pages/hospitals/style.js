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
		fontSize: 16,
		fontWeight: "bold",
    color: "#333",
    marginLeft: 10, 
    paddingTop: 10,
    paddingBottom: 10,
	},
	
	hospitalIcon: {
    height: 60,
    width: 140,
    marginTop: 10,
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 10,
  },
   
  niceBlue: {color:  "#19769F"}, 

  description : {
    fontFamily: "Gotham Rounded",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "left",
    color: "#51565f" ,
    marginTop: 7, 
    marginLeft: 5, 
    marginBottom: 5, 
  }, 

  sideButtonRight : {
    height: '100%',
    backgroundColor: "#005cd1",
    paddingTop: '10%', 
    fontWeight: "bold",
   }, 

  headerMenu: {backgroundColor: "#005cd1"}, 

  calendarIcon : { color: '#005cd1', fontSize: 18, marginTop: 3, marginBottom: 3, marginLeft: 10}, 

  userIcon : { color: '#005cd1', fontSize: 18, marginTop: 3, marginBottom: 3, marginLeft: 10},
  spinnerTextStyle: {
      color: '#FFF'
  },
});
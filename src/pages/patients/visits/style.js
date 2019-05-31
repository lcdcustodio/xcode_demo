
import { StyleSheet, Dimensions } from "react-native";

const screenHeight = Math.round(Dimensions.get('window').height - 130 );

export default StyleSheet.create({
	container:{
		height: screenHeight
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
    color: "#333", 
    padding: 5,
    width: 300, 
	},
	niceBlue: {
		color:  "#19769F", 
		paddingLeft: 2
	},
	description : {
		width: '100%',
		paddingTop: '3%',
		paddingBottom: '5%',
    fontFamily: "Verdana",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#9f9f9f" 
	},
	rowButtonCircle: {
		marginTop: '5%',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	circle: {
		paddingTop: '4%',
		width: 80,
		height: 80,
		borderRadius: 80/2,
		flexDirection: 'column',
		alignItems: 'center'
	},
	borderCircle: {
		borderColor: "#707070",
		borderStyle: "solid",
  	borderWidth: 1,
	},
	iconCircle: {
		color: 'white'
	},
	textCircle: {
		fontFamily: 'Gotham Rounded', 
		fontSize:10, 
		fontWeight: "normal", 
		fontStyle: "normal", 
		letterSpacing: 0, 
		color: 'white',
		marginTop: 5,
	},
	overlay: {
		flex: 1,
		padding: '13%',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		flexDirection: "row"
 },
 	textArea: {
		width: "100%",
		height: "70%",
		borderColor: '#000',
		borderWidth: 1, 
		padding: 1
	}
});
import { StyleSheet } from "react-native";
import baseStyles from '../../../styles'

export default StyleSheet.create({
	container: {
		...baseStyles.container,
		flex: 1,
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
 
	modal : {
		backgroundColor: '#F8F8FF', 
		borderRadius: 4, 
		flexDirection: "row", 
		flexWrap: 'wrap', 
		height: '75%', 
		marginTop: '25%', 
		padding: 1
	},
	textArea: {
		flex: 1,
		backgroundColor: 'red',
	},
	textVisit: {
		fontWeight: "bold", 
		fontSize: 18, 
		color: 'white'
	},
	alertInformation : {
		flexDirection: "row", 
		flexWrap: 'wrap', 
		alignItems:'center',
		justifyContent: 'center'
	},
	textObservation : {
		textAlign: 'center', 
		backgroundColor: 'white'
	},
	close : {
		color: 'white', 
		fontSize: 18, 
		marginTop: 1, 
		marginBottom: 1, 
		marginLeft: '12%'
	},
	viewVisit : {
		flexDirection: "row", 
		width: '100%', 
		justifyContent: 'space-between', 
		backgroundColor: "#005cd1", 
		alignItems: 'center'
	},
	save : {
		color: 'white', 
		fontSize: 18, 
		marginTop: 1, 
		marginBottom: 1, 
		marginRight: '12%'
	},
	keyborderView: {
		flex: 1
	},
	dialogScrollView: {
        marginTop: 20, 
        marginLeft: -18, 
		marginRight: -18
    }
});
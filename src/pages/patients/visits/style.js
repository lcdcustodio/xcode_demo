
import { StyleSheet, Dimensions } from "react-native";
import styled from 'styled-components';

const screenHeight = Math.round(Dimensions.get('window').height - 130 );

const ErrorMessage = styled.Text`
  textAlign: center;
  color: #fff;
  fontSize: 16px;
  marginBottom: 15px;
  marginHorizontal: 20px;
`;

export default StyleSheet.create({
	container:{
		height: screenHeight,
		padding: 10,
		backgroundColor: "#ebeff2",
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
		height: 100,
		borderColor: '#ccc',
		borderWidth: 1, 
		padding: 1,
		textAlign: 'justify',
    	lineHeight: 30,
		padding: 10,
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
	observation: {
		flexDirection: "row", 
		width: '100%', 
		flexWrap: 'wrap', 
		paddingTop: '15%'
	},
	textVisit: {
		fontWeight: "bold", 
		fontSize: 18, 
		color: 'white'
	},
	alertInformation : {
		flexDirection: "row", 
		width: '100%', 
		flexWrap: 'wrap', 
		alignItems:'center', 
		paddingTop: '10%'
	},
	textObservation : {
		fontWeight: "bold", 
		width: '100%',
		 fontSize: 17
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
	}
});
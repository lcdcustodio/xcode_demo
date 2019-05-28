import { StyleSheet } from "react-native";

export default StyleSheet.create({
	
	productContainer: {
		backgroundColor: "#FFF",
		borderBottomWidth: 1,
		borderBottomColor: "#DDD",
        padding: 20, 
        justifyContent: "space-between", 
        flexDirection: "row", 
        alignItems: 'center'
	},

	patientTitle: {
		width: 171,
        height: 14,
        fontFamily: "Gotham Rounded",
        fontSize: 14,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 17,
        letterSpacing: 0,
        textAlign: "left"
	},

	productDescription: {
        width: 171,
        height: 14,
        fontFamily: "Gotham Rounded",
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 17,
        letterSpacing: 0,
        textAlign: "left"
    },
    
    hospitalizationDescription : {
        width: '100%',
        height: 12,
        fontFamily: "Gotham Rounded",
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 14,
        letterSpacing: 0,
        textAlign: "left",
        color: "#95989a",
        marginTop: 10
    }, 

    lastVisit : {
        marginTop: '2%',
        width: '100%',
        height: 11,
        fontFamily: "Gotham Rounded",
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 12,
        letterSpacing: 0,
        textAlign: "left",
        color: "#51565f"
    },

    niceBlue: {color:  "#19769F"}, 

    headerMenu: {backgroundColor: "#005cd1"}

});
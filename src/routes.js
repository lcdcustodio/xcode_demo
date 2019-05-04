import { createStackNavigator, createAppContainer } from "react-navigation";

import Main from "./pages/main";
import Hospital from "./pages/hospital";

const AppNavigator = createStackNavigator({
	Main,
	Hospital
}, {
	navigationOptions:{
		headerStyle:{
			backgroundColor: "#DA552F"
		},
		headerTintColor: "#FFF"
	}
});

export default createAppContainer(AppNavigator);


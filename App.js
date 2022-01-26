import "react-native-gesture-handler";
import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./DrawerNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import Joke from "./Screens/Joke";
const Stack = createStackNavigator();
export default function App() {
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="Home"
						component={DrawerNavigator}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="Joke" component={Joke} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import Tab1Screen from "./Screens/Tab1Screen";
import Tab2Screen from "./Screens/Tab2Screen";
import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { DrawerActions } from "@react-navigation/native";
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => {
	return (
		<Tab.Navigator>
			<Tab.Screen
				name="Tab1"
				component={Tab1Screen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Tab2"
				component={Tab2Screen}
				options={{ headerShown: false }}
			/>
		</Tab.Navigator>
	);
};

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const DrawerNavigator = ({ navigation }) => {
	const [expoPushToken, setExpoPushToken] = useState("");
	const responseListener = useRef();

	useEffect(() => {
		registerForPushNotificationsAsync().then((token) =>
			setExpoPushToken(token)
		);

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					navigation.dispatch(DrawerActions.closeDrawer());
					navigation.navigate("Joke", {
						delivery:
							response.notification.request.content.data.delivery,
					});
				}
			);

		return () => {
			Notifications.removeNotificationSubscription(
				responseListener.current
			);
		};
	}, []);

	return (
		<Drawer.Navigator
			initialRouteName="Home"
			drawerContent={(props) => {
				return (
					<DrawerContentScrollView {...props}>
						<DrawerItemList {...props} />
						<DrawerItem
							label={"Show me a joke"}
							onPress={() => sendPushNotification(expoPushToken)}
						/>
					</DrawerContentScrollView>
				);
			}}
		>
			<Drawer.Screen name="Tabs" component={TabNavigator} />
		</Drawer.Navigator>
	);
};

async function sendPushNotification(expoPushToken) {
	const resp = await axios.get("https://v2.jokeapi.dev/joke/Any");
	const message = {
		to: expoPushToken,
		sound: "default",
		title: "Joke setup",
		body: resp.data.setup,
		data: resp.data,
	};

	await axios.post("https://exp.host/--/api/v2/push/send", message, {
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json",
		},
	});
}

async function registerForPushNotificationsAsync() {
	let token;
	if (isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		alert("Must use physical device for Push Notifications");
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	return token;
}

export default DrawerNavigator;

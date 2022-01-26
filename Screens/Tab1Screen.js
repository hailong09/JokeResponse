import { StyleSheet, Text, View } from "react-native";

const Tab1Screen = () => {
	return (
		<View style={styles.container}>
			<Text>Tab1 Screen</Text>
		</View>
	);
};

export default Tab1Screen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

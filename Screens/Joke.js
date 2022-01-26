import { Text, View } from "react-native";

const Joke = ({ route }) => {
	const { delivery } =  route.params;
	return <View>{delivery && <Text>{delivery} </Text>}</View>;
};

export default Joke;

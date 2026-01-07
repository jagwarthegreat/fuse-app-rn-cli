import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:"#fff",
    }
});

export default styles;
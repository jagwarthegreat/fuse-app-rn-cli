import { Dimensions, StyleSheet } from 'react-native';
import constants from '../../../constants';
import { ScaledSheet } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');

const styles = ScaledSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },

    slideContainer: {
        alignItems: 'center',
    },

    childContainer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 15,
    },

    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },

    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 10,
    },

    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 2
    },

    imageParentContainer: {
        width: '100%',
        height: '70%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        resizeMode: 'contain',
    },

    title: {
        fontSize: 24,
        lineHeight: 34,
        fontFamily: constants.fonts.poppins600,
        color: '#000',
        textAlign: 'left',
        paddingTop: 16,
    },

    description: {
        alignSelf: 'stretch',
        fontSize: 18,
        lineHeight: 25,
        fontFamily: constants.fonts.poppins500,
        color: '#000',
        textAlign: 'center',
        paddingTop: 18,
    },

    indicator: {
        height: 8,
        width: 8,
        backgroundColor: '#DEDEDE',
        marginHorizontal: 4,
        borderRadius: 20,
    },

    nextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        justifyContent: 'flex-end',
    },

    labelText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: constants.fonts.poppins600,
        color: '#2d73dc',
        textAlign: 'left',
    },

    rightIcon: {
        color: '#2D73DC',
        fontSize: 23,
    },

    doneContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C5010F',
        borderRadius: 30,
        paddingVertical: 16,
    },

    doneText: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: constants.fonts.poppins600,
        color: '#fff',
        textAlign: 'left',
    },

    backBtn: {
        fontSize: 30,
        borderRadius: 30,
        padding: 8,
        marginTop: 10,
        backgroundColor: '#ACACAC73',
    },

    prevContainer: {
        position: 'absolute',
        top: 20,
        left: 10,
    },
});

export default styles;
import { StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    formContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: heightPercentageToDP('60%'),
        width: widthPercentageToDP('80%'),
    },
    image: {
        width: 250,
        height: 250,
        alignSelf: 'center'
    },
    inputTransparent: {
        backgroundColor: '#84A0A47F'
    },
    buttonLogIn: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        justifyContent:'center',
        borderRadius: 125,
        backgroundColor: '#6ED3547F',
    },
    buttonText: {
        fontFamily: 'Merienda_400Regular',
        color: '#FFFF',
    }
})
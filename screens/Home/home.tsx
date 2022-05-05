import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { GlobalContainer } from '../../components/centeredVHContainer';
import { styles } from './styles';

export const Home = ( ) => {
    const [activado, setActivado] = useState<boolean>(false)

    return (
    <GlobalContainer>
        <View style={styles.container}>
            <Text> { activado ? "ALARMA ACTIVADA" : "ALARMA DESACTIVADA" } </Text>
            <Pressable style={ activado? styles.buttonActivado : styles.buttonDesactivado } onPress={ () => setActivado( !activado ) }>
                <Image style={styles.image} source={require('../../assets/icon.png')}/>
            </Pressable>
        </View>
    </GlobalContainer>    )
};
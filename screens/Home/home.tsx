import { Sound } from 'expo-av/build/Audio';
import { Accelerometer, Magnetometer, ThreeAxisMeasurement } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Divider, Title } from 'react-native-paper';

import { GlobalContainer } from '../../components/centeredVHContainer';
import { styles } from './styles';

export const Home = ( {navigation} : any) => {
    const [activado, setActivado] = useState<boolean>(false);
    const [acelerometroData, setAcelerometroData] = useState<ThreeAxisMeasurement>();
    const [magnetometerData, setMagnetometerData] = useState<ThreeAxisMeasurement>();
    const [reproducirIzq, setReproducirIzq] = useState<boolean>(false);
    const [reproducirDer, setReproducirDer] = useState<boolean>(false);
    const [reproducirVer, setReproducirVer] = useState<boolean>(false);
    const [reproducirHor, setReproducirHor] = useState<boolean>(false);
    const updateInterval = 250;

    const [timeoutIzq, setTimeoutIzq] = useState<NodeJS.Timeout>();
    const [timeoutDer, setTimeoutDer] = useState<NodeJS.Timeout>();
    const [timeoutVer, setTimeoutVer] = useState<NodeJS.Timeout>();
    const [timeoutHor, setTimeoutHor] = useState<NodeJS.Timeout>();

    useEffect( () => {
        Magnetometer.requestPermissionsAsync();
        Accelerometer.requestPermissionsAsync();

        Accelerometer.setUpdateInterval( updateInterval );
        Magnetometer.setUpdateInterval( updateInterval );
        const accelerometerSuscription = Accelerometer.addListener( data => setAcelerometroData(data) );
        const magnetometerSuscription = Magnetometer.addListener( data => setMagnetometerData(data) );
        return () => {
            accelerometerSuscription.remove();
            magnetometerSuscription.remove();
        };
    }, [] );

    useEffect( () => {
        if ( !acelerometroData ) return
        if ( !activado ) return
        if ( reproducirVer || reproducirHor || reproducirIzq || reproducirDer ) return

        const movX = Math.floor(acelerometroData.x * 100);

        if ( movX >= 40 ) {
            Sound.createAsync( require('../../assets/robo1.m4a') )
                .then( ({sound}) => sound.playAsync() )
                .catch( e => console.error(e) );
            setReproducirIzq( true );
            setTimeoutIzq(setTimeout( () => setReproducirIzq(false), 5000 ));
        }

        if ( movX <= -30 ) {
            Sound.createAsync( require('../../assets/robo2.m4a') )
                .then( ({sound}) => sound.playAsync() )
                .catch( e => console.error(e) );
            setReproducirDer( true );
            setTimeoutDer(setTimeout( () => setReproducirDer(false), 5000 ));
        }
        
    }, [acelerometroData?.x] );

    useEffect( () => {
        if ( !activado ) return
        if ( reproducirVer || reproducirHor || reproducirIzq || reproducirDer ) return;
        if ( !magnetometerData ) return

        const hor = Math.floor(magnetometerData.x);
        const ver = Math.floor(magnetometerData.y);

        if ( hor >= 8 || hor <= -12 ) {
            Sound.createAsync( require('../../assets/robo3.m4a') )
                .then( ({sound}) => sound.playAsync() )
                .catch( e => console.error(e) );
            setReproducirHor(true);
            setTimeoutHor(setTimeout( () => setReproducirHor(false), 5000 ));
        }

        if ( ver >= 7 || ver <= -18 ) {
            Sound.createAsync( require('../../assets/robo4.m4a') )
                .then( ({sound}) => sound.playAsync() )
                .catch( e => console.error(e) );
            setReproducirVer(true);
            setTimeoutVer(setTimeout( () => setReproducirVer(false), 5000 ));
        }
        
    }, [magnetometerData?.x, magnetometerData?.y] );

    useEffect( () => {
        if ( activado ) return

        timeoutIzq && clearTimeout( timeoutIzq );
        timeoutDer && clearTimeout( timeoutDer );
        timeoutHor && clearTimeout( timeoutHor );
        timeoutVer && clearTimeout( timeoutVer );

        setReproducirIzq(false);
        setReproducirDer(false);
        setReproducirHor(false);
        setReproducirVer(false);

    }, [activado] );

    if ( !acelerometroData || !magnetometerData ) return <ActivityIndicator/>

    return (
    <GlobalContainer navigation={navigation}>
        <View style={styles.container}>
            <Title style={styles.textWhite}>Acelerómetro:</Title>
            <Title style={styles.textWhite}>X: {Math.round(acelerometroData.x * 100)}</Title>
            <Divider style={ {height: 10, backgroundColor: '#ffffffff'} }/>
            <Title style={styles.textWhite}>Magnetómetro:</Title>
            <Title style={styles.textWhite}>X: {Math.round(magnetometerData.x)}</Title>
            <Title style={styles.textWhite}>Y: {Math.round(magnetometerData.y)}</Title>
            <Pressable style={ activado? styles.buttonActivado : styles.buttonDesactivado } onPress={ () => setActivado( !activado ) }>
                <Image style={styles.image} source={require('../../assets/icon.png')}/>
            </Pressable>
        </View>
    </GlobalContainer>    )
};
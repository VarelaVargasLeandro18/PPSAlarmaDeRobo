import { Sound } from 'expo-av/build/Audio';
import { Camera } from 'expo-camera';
import { Accelerometer, Magnetometer, ThreeAxisMeasurement } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Divider, Title } from 'react-native-paper';

import { GlobalContainer } from '../../components/centeredVHContainer';
import { styles } from './styles';

export const Home = ( {navigation} : any) => {
    const [activado, setActivado] = useState<boolean>(false);
    const [acelerometroData, setAcelerometroData] = useState<ThreeAxisMeasurement>();
    const [magnetometerDataReposo, setMagnetometerDataReposo] = useState<ThreeAxisMeasurement>( {x: 0, y: 0, z:0} );
    const [magnetometerData, setMagnetometerData] = useState<ThreeAxisMeasurement>();
    const [reproducirIzq, setReproducirIzq] = useState<boolean>(false);
    const [reproducirDer, setReproducirDer] = useState<boolean>(false);
    const [reproducirVer, setReproducirVer] = useState<boolean>(false);
    const [reproducirHor, setReproducirHor] = useState<boolean>(false);
    const updateInterval = 250;
    const [flash, setFlash] = useState<"off" | "torch">("off");

    const [timeoutIzq, setTimeoutIzq] = useState<NodeJS.Timeout>();
    const [timeoutDer, setTimeoutDer] = useState<NodeJS.Timeout>();
    const [timeoutVer, setTimeoutVer] = useState<NodeJS.Timeout>();
    const [timeoutHor, setTimeoutHor] = useState<NodeJS.Timeout>();
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect( () => {
        Camera.requestCameraPermissionsAsync();
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
        if ( !activado ) setFlash("off");
        if ( !magnetometerData ) return
        setMagnetometerDataReposo( magnetometerData );
    }, [activado] );

    useEffect( () => {
        if ( !acelerometroData ) return
        if ( !activado ) return
        if ( reproducirVer || reproducirHor || reproducirIzq || reproducirDer ) return

        const hor = Math.round(acelerometroData.x * 100);
        const ver = Math.round(acelerometroData.y * 100);
        
        if ( (hor >= 90 && hor > 0) || (hor <= -90 && hor < 0) ) {
            setReproducirHor( true );
            Sound.createAsync( require('../../assets/tshtDejaEsoWachin.m4a') )
            .then( ({sound}) => sound.playAsync() )
            .then( () => setTimeoutIzq(setTimeout( () => {setReproducirHor(false); }, 5000 )) )
            .catch( e => console.error(e) );
        }
        
        if ( (ver >= 90 && ver > 0) ) {
            setReproducirVer( true );
            setFlash("torch");
            Sound.createAsync( require('../../assets/DejaMiDispositivo.m4a') )
                .then( ({sound}) => sound.playAsync() )
                .then( () => setTimeoutIzq(setTimeout( () => {setReproducirVer(false); setFlash("off")}, 5000 )) )
                .catch( e => console.error(e) );
        }

    }, [acelerometroData?.x, acelerometroData?.y] );

    useEffect( () => {
        if ( !activado ) return
        if ( reproducirVer || reproducirHor || reproducirIzq || reproducirDer ) return;
        if ( !magnetometerData ) return

        const movX = Math.round(magnetometerDataReposo.x -  magnetometerData.x);

        if ( movX >= 3 ) {
            Sound.createAsync( require('../../assets/EyEyEy.m4a') )
                .then( ({sound}) => sound.playAsync() )
                .then( () => setTimeoutIzq(setTimeout( () => setReproducirIzq(false), 5000 )) )
                .catch( e => console.error(e) );
            setReproducirIzq( true );
        }

        if ( movX <= -3 ) {
            setReproducirDer( true );
            Sound.createAsync( require('../../assets/NaoTocar.m4a') )
                .then( ({sound}) => sound.playAsync() )
                .then( () => setTimeoutDer(setTimeout( () => setReproducirDer(false), 5000 )) )
                .catch( e => console.error(e) )
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

    if ( !acelerometroData || !magnetometerData || !magnetometerDataReposo ) return <ActivityIndicator/>

    return (
    <GlobalContainer navigation={navigation}>
        <Camera 
            style={ {width: 1, height: 1} } 
            flashMode={flash}
            type={type}></Camera>
        <View style={styles.container}>
            <Pressable style={ activado? styles.buttonActivado : styles.buttonDesactivado } onPress={ () => setActivado( !activado ) }>
                <Image style={styles.image} source={require('../../assets/icon.png')}/>
            </Pressable>
        </View>
    </GlobalContainer>    )
};
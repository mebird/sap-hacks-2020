import React, { useState } from 'react';
import * as firebase from "firebase/app";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import fireDb from "../firebasedb";
import { useStoreActions } from 'easy-peasy';

export default function Login(props) {
    const setUserSession = useStoreActions(state => state.changeUser);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState(null);

    const handleLogin = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => fireDb.getUser(email))
            .then(usr => setUserSession(usr))
            .then(() => props.navigation.push('Dashboard'))
            .catch(error => setErrMsg(error.message))
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.logo}>
                <Text style={styles.titleLabel}>StaySafe</Text>
                <Image
                    style={styles.logoPicture}
                    source={require('../assets/images/on-demand-deliveries-polaris.png')}
                />
            </View>
                <Text>Login</Text>
            {
                errMsg && <Text style={
                    { color: 'red' }
                }>
                    {
                        errMsg
                    } </Text>
            }
            <TextInput style={
                styles.textInput
            }
                autoCapitalize="none"
                placeholder="Email"
                onChangeText={setEmail}
                value={email} />
            <TextInput secureTextEntry
                style={
                    styles.textInput
                }
                autoCapitalize="none"
                placeholder="Password"
                onChangeText={
                    password => setPassword(password)
                }
                value={
                    password
                    } />
            <TouchableOpacity
                    style={styles.longButton}
                    onPress={() => handleLogin()}
                >
                    <Text style={styles.btnText}> Login </Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.longButton}
                    onPress={() => props.navigation.push('SignUp')}
                >
                    <Text style={styles.btnText}> Don't have an account? Sign Up </Text>
            </TouchableOpacity>

        </ScrollView>
        )
    }


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 15,
    },
    logoPicture: {
        height: 200,
        width: 400,
    },
    titleLabel: {
        margin: 2.5,
        fontWeight: 'bold',
        color: '#2B3158',
        fontSize: 20
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    longButton: {
        borderWidth: 1,
        borderRadius: 3,
        padding: 10,
        marginTop: 10,
        backgroundColor: '#2B3158',
        width: '90%',
        alignItems: 'center'
    },
    btnText: {
        color: 'white',
    }
})

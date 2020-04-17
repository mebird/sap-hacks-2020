import React, { useState } from 'react';
import * as firebase from "firebase/app";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button
} from 'react-native'
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
            .then(() => props.navigation.push('Main'))
            .catch(error => setErrMsg(error.message))
    }

    return (
        <View style={
            styles.container
        }>
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
                onChangeText={setPassword}
                value={password} />
            <Button title="Login"
                onPress={handleLogin} />
            <Button title="Don't have an account? Sign Up"
                onPress={
                    () => props.navigation.navigate('Signup')
                } />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    }
})

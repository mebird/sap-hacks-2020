import React, { useState } from 'react'
import * as firebase from "firebase/app";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import fireDb from "../firebasedb";
import UploadImage from '../components/UploadImage';
import { useStoreState, useStoreActions } from 'easy-peasy';

export default function SignUp(props) {
    const setUserSession = useStoreActions(s => s.changeUser);
    const image = useStoreState(s => s.image);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSignUp = () => {
        const user = { name, location, phonenumber, image, email, password };
        if (!Object.values(user).reduce((prev, curr) => prev && !!curr)) {
            setErrorMsg('Please fill out all fields below.');
        } else {
            fireDb
                .addUser(user)
                .then(() => fireDb.getUser(email))
                .then(usr => setUserSession(usr))
                .then(() => props.navigation.push('Root'))
                .catch(error => setErrorMsg(error.message))
        }
    }

    return (
        <View style={styles.container}>
            <Text>Sign Up</Text>
            {errorMsg &&
                <Text style={{ color: 'red' }}>
                    {errorMsg}
                </Text>}
            <TextInput
                placeholder="Name"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setName}
                value={name}
            />
            <TextInput
                placeholder="Location"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setLocation}
                value={location}
            />
            <TextInput
                placeholder="phonenumber"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setPhonenumber}
                value={phonenumber}
            />
            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                secureTextEntry
                placeholder="Password"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setPassword}
                value={password}
            />
            <UploadImage style={styles.longButton} />
            <TouchableOpacity style={styles.longButton} onPress={() => handleSignUp()}>
                <Text style={styles.btnText}>
                    Sign up
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.longButton} onPress={() => props.navigation.push('Login')}>
                <Text style={styles.btnText}>
                    Already have an account? Login
                </Text>
            </TouchableOpacity>
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
        color: 'white'
    }
})
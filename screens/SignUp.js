import React from 'react'
import * as firebase from "firebase/app";
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import fireDb from "../firebasedb";

export default class SignUp extends React.Component {
    state = { name: '', location: '', phonenumber: '', auth_image: '', email: '', password: '', errorMessage: null }
    // user = {
    //     email: this.state.email,
    //     password: this.state.password
    // }
    handleSignUp = () => {
        fireDb.addUser({
            name: this.state.name,
            location: this.state.location,
            phonenumber: this.state.phonenumber,
            auth_image: this.state.auth_image,
            email: this.state.email,
            password: this.state.password
        });
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => this.props.navigation.navigate('Main'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Sign Up</Text>
                {this.state.errorMessage &&
                    <Text style={{ color: 'red' }}>
                        {this.state.errorMessage}
                    </Text>}
                <TextInput
                    placeholder="Name"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                />
                <TextInput
                    placeholder="Location"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={location => this.setState({ location })}
                    value={this.state.location}
                />
                <TextInput
                    placeholder="phonenumber"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={phonenumber => this.setState({ phonenumber })}
                    value={this.state.phonenumber}
                />
                <TextInput
                    placeholder="Image"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={auth_image => this.setState({ auth_image })}
                    value={this.state.auth_image}
                />
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <Button title="Sign Up" onPress={this.handleSignUp} />
                <Button
                    title="Already have an account? Login"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
        )
    }
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
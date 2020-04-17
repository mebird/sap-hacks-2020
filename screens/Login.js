import React from 'react';
import * as firebase from "firebase/app";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity
} from 'react-native'
export default class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errorMessage: null
    }
    handleLogin = () => {
        const { email, password } = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password).then(() =>
                this
                    .props
                    .navigation
                    .navigate('Main'))
            .catch(error =>
                this.setState({ errorMessage: error.message })
            )
    }
    render() {
        return (
            <View style={
                styles.container
            }>
                <Text>Login</Text>
                {
                    this.state.errorMessage && <Text style={
                        { color: 'red' }
                    }>
                        {
                            this.state.errorMessage
                        } </Text>
                }
                <TextInput style={
                    styles.textInput
                }
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={
                        email => this.setState({ email })
                    }
                    value={
                        this.state.email
                    } />
                <TextInput secureTextEntry
                    style={
                        styles.textInput
                    }
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={
                        password => this.setState({ password })
                    }
                    value={
                        this.state.password
                    } />
                <TouchableOpacity
                        style={styles.longButton}
                        onPress={this.handleLogin}
                    >
                        <Text style={styles.btnText}> Login </Text>
                </TouchableOpacity>
                <TouchableOpacity
                        style={styles.longButton}
                        onPress={() => this.props.navigation.push('SignUp')}
                    >
                        <Text style={styles.btnText}> Don't have an account? Sign Up </Text>
                </TouchableOpacity>
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

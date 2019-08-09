import React from 'react';
import { 
    StyleSheet, View, Image, TextInput, TouchableHighlight, Text, ActivityIndicator,
    ToastAndroid
} from 'react-native';

import Storage from '../utils/storage';
import { URI } from '../utils/constants';
import Loading from '../utils/loading';

export default class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            user: '', pass: '', error: '', waiting: false
        };
        this.inputs = {};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.focusNextField = this.focusNextField.bind(this);
    }

    focusNextField(id) {
        this.inputs[id].focus();
    }

    handleSubmit() {
        this.setState({ waiting: true });
        fetch(URI + 'users/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.user,
                password: this.state.pass,
            }),
        })
        .then((response) => response.json())
        .then(async (responseJson) => {
            this.setState({ waiting: false });
            if (responseJson.message === 'OK') {
                let service = new Storage();
                await service.saveToken(responseJson.data.token);
                this.setState({ error: '' });
                this.props.navigation.navigate('Home');
                this.props.navigation.pop();
            } else {
                this.setState({ error: 'Usuário ou senha inválidos!'});
            }
        })
        .catch((error) => {
            console.log('error!');
            console.error(error);
        });
    }

    addUser = () => {
        this.props.navigation.navigate('Add');
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../todo.jpg')} style={styles.imagem} />
                <Text style={styles.title}>ToDo APP</Text>
                
                {(this.state.error !== '') && <Text style={styles.error}>{this.state.error}</Text>}
                
                <TextInput style={styles.input} ref={(input) => { this.inputs['one'] = input; }} onSubmitEditing={() => { this.focusNextField('two'); }} returnKeyType="next" textContentType="emailAddress" keyboardType="email-address" autoCapitalize="none" require placeholder="Email" onChangeText={(text) => this.setState({ user: text })} />
                <TextInput style={styles.input} ref={(input) => { this.inputs['two'] = input; }} textContentType="password" autoCapitalize="none" secureTextEntry={true} require placeholder="Password" onChangeText={(text) => this.setState({ pass: text })} />
                
                <TouchableHighlight onPress={this.handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={this.addUser} style={styles.newUser}>
                    <Text style={styles.newUserText}>Sign Up</Text>
                </TouchableHighlight>

                {this.state.waiting &&
                    <Loading />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center"
    },
    imagem: {
        width: 200,
        height: 200
    },
    title: {
        fontSize: 22,
        marginBottom: 3
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc'
    },
    error: {
        backgroundColor: '#ff4242',
        padding: 10,
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: 5
    },
    button: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#337ab7',
        alignSelf: 'stretch',
        margin: 15,
        marginHorizontal: 20
    },
    newUser: {
        padding: 20,
        alignSelf: 'stretch',
        margin: 15,
        marginHorizontal: 20
    },
    newUserText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    input: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        borderColor: '#999',
        borderWidth: 0.5,
        backgroundColor: '#FFF',
        alignSelf: 'stretch',
        marginBottom: 15,
        marginHorizontal: 20,
        fontSize: 16
    }
});

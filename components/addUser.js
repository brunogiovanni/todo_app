import React from 'react';
import {
    StyleSheet, ScrollView, Text, TextInput, TouchableHighlight, ToastAndroid
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { URI } from '../utils/constants';

export default class UserForm extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'New user',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#000',
                fontColor: '#fff'
            }
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            name: ''
        };
    }

    _onSave = async (e) => {
        e.preventDefault();
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                fetch(URI + 'user', {
                    method: 'post',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(this.state)
                })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    if (responseJson === 'success') {
                        ToastAndroid.show('Saved', ToastAndroid.SHORT);
                        this.props.navigation.pop();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            } else {
                ToastAndroid.show('There is no connection!', ToastAndroid.LONG);
            }
        });
    }

    render = () => {
        return(
            <ScrollView style={styles.container}>
                <Text style={styles.label}>Name:</Text>
                <TextInput style={styles.input} placeholder="Name" value={this.state.name} onChangeText={(value) => this.setState({ name: value })} />
                
                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.input} placeholder="Email" value={this.state.username} onChangeText={(value) => this.setState({ username: value })} />
                
                <Text style={styles.label}>Password:</Text>
                <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} textContentType="password" value={this.state.password} onChangeText={(value) => this.setState({ password: value })} />
                
                <TouchableHighlight style={styles.button} onPress={this._onSave}>
                    <Text style={styles.button_text}>Save</Text>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5
    },
    label: {
        fontSize: 16,
        fontWeight: "bold"
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
    },
    button: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#337ab7',
        alignSelf: 'stretch',
        margin: 15,
        marginHorizontal: 20
    },
    button_text: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
});

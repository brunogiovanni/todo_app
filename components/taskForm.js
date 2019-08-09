import React from 'react';
import {
    StyleSheet, ScrollView, Text, TextInput, TouchableHighlight, ToastAndroid
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { URI } from '../utils/constants';
import Storage from '../utils/storage';

export default class TaskForm extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task Form',
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
            token: '',
            id: (props.navigation.getParam('id') !== null || props.navigation.getParam('id') !== undefined) ? props.navigation.getParam('id') : '',
            task: (props.navigation.getParam('task') !== null || props.navigation.getParam('task') !== undefined) ? props.navigation.getParam('task') : ''
        };

        this._getToken();
    }

    _getToken = async () => {
        let service = new Storage();
        this.setState({ token: await service.readToken() });
    }

    _onSave = async (e) => {
        e.preventDefault();
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                let method = 'post';
                let uri = URI + 'task/';
                if (this.state.id !== '' && this.state.id !== undefined) {
                    method = 'put';
                    uri += this.state.id;
                }
                fetch(uri, {
                    method: method,
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + this.state.token
                    },
                    body: JSON.stringify({ id: this.state.id, task: this.state.task })
                })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    if (responseJson === 'success') {
                        await ToastAndroid.show('Saved', ToastAndroid.SHORT);
                        this.props.navigation.navigate('Home', { update: true });
                    }
                });
            } else {
                ToastAndroid.show('There is no connection!', ToastAndroid.LONG);
            }
        });
    }

    render = () => {
        return(
            <ScrollView style={styles.container}>
                <Text style={styles.label}>Task:</Text>
                <TextInput style={styles.input} placeholder="Task" value={this.state.task} onChangeText={(value) => this.setState({ task: value })} />
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

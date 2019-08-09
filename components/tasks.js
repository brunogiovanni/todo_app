import React, { Component } from 'react';
import {
    StyleSheet, Text, View, FlatList, ToastAndroid, TouchableHighlight,
    TouchableOpacity, Animated
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Container, Header } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';

import Storage from '../utils/storage';
import { URI } from '../utils/constants';

export default class Tasks extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    
        this.state = {
            tasks: []
        };
        this.token = '';

        this.getTasks = this.getTasks.bind(this);
        this.getToken = this.getToken.bind(this);
        this.addTask = this.addTask.bind(this);
        this.editTask = this.editTask.bind(this);
        
        this.getToken();
    }

    componentDidUpdate() {
        if (this.props.navigation !== undefined && this.props.navigation.getParam('update') === true) {
            this.getToken();
        }
    }

    getToken = async () => {
        let service = new Storage();
        this.token = await service.readToken();
        
        this.getTasks();
    }
    
    getTasks = async () => {
        fetch(URI + 'tasks/', {
            method: 'get',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            }
        })
        .then((response) => response.json())
        .then(async (responseJson) => {
            await this.setState({ tasks: responseJson });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    addTask = async () => {
        this.props.navigation.navigate('AddTask');
    }

    editTask = async (item) => {
        this.props.navigation.navigate('EditTask', { id: item.id, task: item.task });
    }

    closeRow = async (item) => {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                fetch(URI + 'task/' + item.id, {
                    method: 'put',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + this.token
                    },
                    body: JSON.stringify({ id: item.id, status: 'C' })
                })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    if (responseJson === 'success') {
                        ToastAndroid.show('Task closed', ToastAndroid.SHORT);
                        this.getTasks();
                    }
                });
            } else {
                ToastAndroid.show('There is no connection!', ToastAndroid.LONG);
            }
        });
    }

    deleteRow = async (item) => {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                fetch(URI + 'task/' + item.id, {
                    method: 'delete',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + this.token
                    },
                    body: JSON.stringify({ id: item.id })
                })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    if (responseJson === 'success') {
                        ToastAndroid.show('Task deleted', ToastAndroid.SHORT);
                        this.getTasks();
                    }
                });
            } else {
                ToastAndroid.show('There is no connection!', ToastAndroid.LONG);
            }
        });
    }
    
    render() {
        return (
            <Container>
                <Header style={{backgroundColor: "#000"}}>
                    <Container style={{flexDirection: 'row', backgroundColor: '#000'}}>
                        <Text style={styles.titulo}>Tasks</Text>
                    </Container>
                </Header>
                <View style={styles.container}>
                    {this.state.tasks.length > 0 ?
                        <SwipeListView
                            data={this.state.tasks}
                            renderItem={ (data, rowMap) => (
                                <TouchableHighlight onPress={() => { this.editTask(data.item); }} underlayColor={"#000"}>
                                    <View style={styles.rowFront}>
                                        <Text style={styles.label} key={data.item.id}>{data.item.task}</Text>
                                    </View>
                                </TouchableHighlight>
                            )}
                            renderHiddenItem={ (data, rowMap) => (
                                <View style={styles.rowBack}>
                                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={ _ => this.closeRow(data.item) } underlayColor={styles.backTextWhite}>
                                        <Text style={styles.backTextWhite}>Done</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteRow(data.item) } underlayColor={styles.backTextWhite}>
                                        <Text style={styles.backTextWhite}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            leftOpenValue={75}
                            rightOpenValue={-75}
                        />
                    :
                        <Text>Nothing to show</Text>
                    }
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={this.addTask}
                    style={styles.TouchableOpacityStyle}>
                    <Icon name="plus" size={30} style={styles.FloatingButtonStyle} />
                </TouchableOpacity>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    item: {
        padding: 10,
        fontSize: 14
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000"
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 15,
        color: "#fff"
    },
    iconNavegador: {
        paddingTop: 10
    },
    TouchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    FloatingButtonStyle: {
        borderRadius: 50,
        color: '#f00',
        width: 50,
        height: 50,
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: "#FFF",
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		justifyContent: 'center',
        height: 50,
        color: "#000"
	},
	rowBack: {
        alignItems: 'center',
        backgroundColor: "#CCC",
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
    },
    backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		left: 0
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
    },
    trash: {
		height: 25,
		width: 25,
    },
    backTextWhite: {
        color: "#FFF"
    }
});
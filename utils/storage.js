import AsyncStorage from '@react-native-community/async-storage';

export default class Storage {
    async saveToken(token) {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            console.log('storage token');
            console.error(error);
        }
    }

    async readToken() {
        return await AsyncStorage.getItem('token');
    }
}

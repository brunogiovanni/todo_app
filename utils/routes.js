import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Login from '../components/login';
import Tasks from '../components/tasks';
import TaskForm from '../components/taskForm';
import Loading from './loading';
import UserForm from '../components/addUser';

const AppNavigator = createStackNavigator(
    {
        Home: Tasks,
        AddTask: TaskForm,
        EditTask: TaskForm
    },
    {
        initialRouteName: 'Home'
    }
);

const AuthNavigator = createStackNavigator(
    {
        Login: Login,
        Add: UserForm
    }
);

const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: Loading,
            Auth: AuthNavigator,
            App: AppNavigator
        },
        {
            initialRouteName: 'AuthLoading'
        }
    )
);

export default AppContainer;

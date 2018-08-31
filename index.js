import { AppRegistry } from 'react-native';
import App from './App.js';

console.disableYellowBox = true

AppRegistry.registerComponent('ArMonster', () => App);

// The below line is necessary for use with the TestBed App
AppRegistry.registerComponent('ViroSample', () => App);

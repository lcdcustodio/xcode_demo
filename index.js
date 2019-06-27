import * as React from 'react';
import {AppRegistry} from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import {name as appName} from './app.json';
import App from './src/App';
import baseStyles from './src/styles';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: baseStyles.main.backgroundColor,
    }
};

export default function Main() {
    return (
        <PaperProvider theme={ theme }>
            <App />
        </PaperProvider>
    );
}
  
AppRegistry.registerComponent(appName, () => Main);

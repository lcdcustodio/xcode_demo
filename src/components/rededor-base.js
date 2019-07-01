import React from 'react';
import { Header, View, Body, Title, Left, Right, Text } from 'native-base';
import { StyleSheet } from "react-native";
import { Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import baseStyles from '../styles';

export const RdRootHeader = (props) => (
    <Header style={ styles.header }>
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={ props.menu }>
                <Icon ios='ios-menu' android="md-menu" style={ styles.headerIcon }/>
            </TouchableOpacity>
        </View>
        <Body style={{ flex: 6 }}>
            <Title style={ styles.headerTitle }>{ props.title }</Title>
        </Body>
        <View style={{ flex: 1, ...styles.headerSyncIconView }}>
            <TouchableOpacity onPress={ props.sync }>
                <Icon name="sync" style={ styles.headerSyncIcon }/>
            </TouchableOpacity>
        </View>
    </Header>
);

export const RdHeader = (props) => (
    <Header style={ styles.header }>
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={ props.goBack }>
                <IconFontAwesome name="angle-left" style={ styles.headerIcon } />
            </TouchableOpacity>
        </View>
        <Body style={{ flex: 7 }}>
            <Title style={ styles.headerTitle }>{ props.title }</Title>
        </Body>
    </Header>
);

export const RdIf = (props) => (props.condition ? props.children : null);

const styles = StyleSheet.create({
	header: {
        ...baseStyles.main,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        ...baseStyles.main,
    },
    headerIcon: {
        ...baseStyles.main,
        fontSize: 40,
        marginLeft: 5
    },
    headerSyncIcon: {
        ...baseStyles.main,
        fontSize: 30,
    },
    headerSyncIconView: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

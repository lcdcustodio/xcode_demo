import React from 'react';
import { Header, Left, Body, Title } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';


export const RdIf = (props) => (props.condition ? props.children : null);

export const RdHeader = (props) => (
    <Header style={{ backgroundColor: '#005cd1' }}>
        <Left style={{flex:1}} >
            <Icon name="angle-left" style={{color: '#FFF', fontSize: 40}} onPress={ props.goBack } />
        </Left>
        <Body style={{flex: 7}}>
            <Title style={{color: 'white'}}>{ props.title }</Title>
        </Body>
    </Header>
);

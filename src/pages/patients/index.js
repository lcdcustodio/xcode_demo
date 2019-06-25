import React, { Component } from "react"
import baseStyles from '../../styles';
import styles from './style';
import { Container, Content, Header, Left, Right, Body, Title, Text, Card, CardItem } from 'native-base';
import { View, FlatList, TouchableOpacity, Image, BackHandler } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Patients extends Component {
    
    constructor(props) {

        super(props);

        this.state = {
            hospital: {},
            loading: false,
            timerTextColor: "#005cd1",
            timerBackgroundColor: "#fff",
            ICON: {
                OLHO_CINZA_COM_CHECK: 3,
                OLHO_AZUL: 1,
                OLHO_CINZA_COM_EXCLAMACAO: 0,
                CASA_AZUL: 2
            }
        }
    }

    didFocus = this.props.navigation.addListener('didFocus', (res) => {

        this.setState({ loading: true });

        const hospitalId = this.props.navigation.getParam('hospitalId');

        AsyncStorage.getItem('hospitalList', (err, res) => {

            let hospitalList = JSON.parse(res);

            let hospital = [];

            for (var h = 0; h < hospitalList.length; h++) {
                
                if (hospitalId == hospitalList[h].id) {

                    hospital = hospitalList[h];

                    let patients = [];

                    hospital.hospitalizationList.forEach( patient => {

                        let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

                        if (

                            (listOfOrderedPatientObservations.length == 0) || 

                            (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)
                        )
                        {
                            patient.totalDaysOfHospitalization = this.calculateDaysOfHospitalization(patient);
                            patient.colorNumber = this.getColorNumber(patient);
                            patient.colorName = this.getColor(patient.colorNumber);
                            patient.backgroundColor = this.getBackgroundColor(patient.colorNumber);
                            patient.lastVisit = this.getLastVisit(patient);
                            patient.iconNumber = this.getIconNumber(patient);
                            patient.icon = this.getIcon(patient.iconNumber);
                            patient.orderField = this.getOrderField(patient);
                            patients.push(patient);
                        }

                    });

                    patients = _.orderBy(patients, ['orderField'], ['asc']);

                    hospital.hospitalizationList = patients;


                    this.setState({hospital: hospital});

                    this.setState({ loading: false });


                    break;

                }
            }            
        });

        BackHandler.removeEventListener ('hardwareBackPress', () => {});
        
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Hospitals');
            return true;
        });

    });
    
    exitDateBelow48Hours(date) {
        const today = moment()
        let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
        let total = today.diff(dateFormatted, 'days')
        return total < 3 ? true : false
    }

    calculateDaysOfHospitalization(patient) {

        const today = moment();

        let admissionDate = moment(moment(patient.admissionDate).format('YYYY-MM-DD'));

        let totalHospitalizationHours = today.diff(admissionDate, 'hours');

        totalHospitalizationHours = Math.round((totalHospitalizationHours / 24));

        return totalHospitalizationHours;
    }

    getColorNumber(patient) {

        if(patient.locationType === 'UTI' || patient.locationType === 'CTI') {
            return 0;
        } else if(patient.locationType === 'SEMI') {
            return 1;
        } else {
            return 2;
        }
    }

    getColor(colorNumber) {

        if(colorNumber == 0) {
            return 'red'
        } else if(colorNumber == 1) {
            return '#FDBD18'
        } else {
            return 'black'
        }
    }

    getBackgroundColor(colorNumber) {

        if(colorNumber == 0) {
            return '#f8d7da'
        } else if(colorNumber == 1) {
            return '#fff3cd'
        } else {
            return '#fff'
        }
    }

    getLastVisit(patient) {
        let listOfOrderedPatientVisits = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
        if(patient.observationList.length === 0 || listOfOrderedPatientVisits[0].observationDate === null) {
            return 'Sem visita'
        } else if(this.isToday(listOfOrderedPatientVisits[0].observationDate)) {
            return 'Hoje'
        } else if(this.isYesterday(listOfOrderedPatientVisits[0].observationDate)) {
            return 'Ontem'
        } else {
            return this.totalDaysAgo(listOfOrderedPatientVisits[0].observationDate)
        }
    }

    isToday(date) {
        const today = moment()
        let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
        let diffDays = today.diff(dateFormatted, 'days')
        return diffDays === 0 ? true : false
    }

    isYesterday(date) {
        const yesterday = moment().subtract(1, 'day');
        let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
        let diffDays = yesterday.diff(dateFormatted, 'days')
        return diffDays === 0 ? true : false
    }

    totalDaysAgo(date) {
        const today = moment()
        let dateFormatted = moment(moment(date).format('YYYY-MM-DD'))
        return today.diff(dateFormatted, 'days') + ' Dias'
    }

    exitDateIsNotEqualToLastVisit(patient) {
        const exitDate = moment(patient.exitDate)
        let listOfOrderedPatientVisits = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
        let dateLastVisitFormatted = moment(moment(listOfOrderedPatientVisits[0].observationDate).format('YYYY-MM-DD'))
        let diffDays = exitDate.diff(dateLastVisitFormatted, 'days')
        return diffDays !== 0 ? true : false
    }

    getIconNumber(patient) {

        let lastVisit = null;

        let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
        
        if (listOfOrderedPatientObservations.length > 0) {
            
            const today = moment();
            
            lastVisit = moment(moment(listOfOrderedPatientObservations[0].observationDate).format('YYYY-MM-DD'));

            lastVisit = today.diff(lastVisit, 'days');
        }

        if(patient.observationList.length > 0 && listOfOrderedPatientObservations[0].alert) // TEVE VISITA E COM ALERTA
        {
            return this.state.ICON.OLHO_CINZA_COM_EXCLAMACAO;
        }
        else if(lastVisit == 0 && patient.exitDate == null) // VISITADO HOJE E NÃO TEVE ALTA
        {
            return this.state.ICON.OLHO_CINZA_COM_CHECK;
        }

        else if(lastVisit > 0 && patient.exitDate == null) // NÃO TEVE VISITA HOJE E NÃO TEVE ALTA
        {
            return this.state.ICON.OLHO_AZUL;
        }

        else if(patient.observationList.length == 0 && patient.exitDate == null) // NÃO TEVE VISITA E NÃO TEVE ALTA
        {
            return this.state.ICON.OLHO_AZUL;
        }

        else if (patient.exitDate != null) // TEVE ALTA
        {
            return this.state.ICON.CASA_AZUL;
        }
    }

    getIcon(iconNumber) {
        
        if(iconNumber == this.state.ICON.OLHO_CINZA_COM_CHECK)
        {
            return require('../../images/ic_visibility_green_24px.png');
        }
        else if(iconNumber == this.state.ICON.OLHO_AZUL)
        {
            return require('../../images/ic_visibility_blue_24px.png');
        }
        else if(iconNumber == this.state.ICON.CASA_AZUL)
        {
            return require('../../images/ic_home_24px.png');
        }
        else if(iconNumber == this.state.ICON.OLHO_CINZA_COM_EXCLAMACAO)
        {
            return require('../../images/ic_visibility_exclamation_24px.png');
        }
    }

    getOrderField(patient) {
        return patient.iconNumber + "" + patient.colorNumber + "" + patient.patientName;
    }

    renderItem = ({ item }) => (
        
             <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate("PatientDetail", { hospitalId: this.state.hospital.id, patientId: item.id, patient: item});
                }}>

            <View style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: baseStyles.container.backgroundColor}}>
                <Card>
                    <CardItem header bordered style={{ flex: 1, height: 50}}>
                        <View style={{width: '90%'}}>
                            <Text style={[styles.patientTitle, {color: `${item.colorName}`, fontSize: 16, marginLeft: -10} ]}> {item.patientName} </Text>
                        </View>
                        <Right>
                            <Image source={item.icon} style={{width: 25, height: 25}} />
                        </Right>
                    </CardItem>
                    
                    <CardItem footer bordered style={{ justifyContent: 'center', height: 30, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0}}>                            
                        
                        <View style={{ width: '10%'}}>
                            <Text style={{paddingLeft: 1}}><Icon name="calendar" style={{color: '#666', fontSize: 15}} /></Text>
                        </View>

                        <View style={{ width: '15%'}}>
                            <Text style={{fontSize: 10, color: '#666', fontWeight:'normal'}}>{item.totalDaysOfHospitalization}0 dias</Text>
                        </View>

                        <View style={{ width: '10%'}}>
                            <Text style={{paddingLeft: 1}}><Icon name="tag" style={{color: '#666', fontSize: 15}} /></Text>
                        </View>
                        
                        <View style={{ width: '15%'}}>
                            <Text style={{fontSize: 12, color: '#666', fontWeight:'normal'}}>{item.locationSession}</Text>
                        </View>

                        <View style={{ width: '10%'}}>
                            <Text style={{paddingLeft: 1}}><Icon name="bed" style={{color: '#666', fontSize: 15}} /></Text>
                        </View>
                        
                        <View style={{ width: '15%'}}>
                            <Text style={{fontSize: 12, color: '#666', fontWeight:'normal'}}>{item.locationBed}</Text>
                        </View>
                        
                        <View style={{ width: '10%'}}>
                            <Text style={{paddingLeft: 1}}><Icon name="eye" style={{color: '#666', fontSize: 15}} /></Text>
                        </View>
                        
                        <View style={{ width: '15%'}}>
                            <Text style={{fontSize: 10, color: '#666', fontWeight:'normal'}}>{item.lastVisit}</Text>
                        </View>
                    
                    </CardItem>
                </Card>
            </View>

            </TouchableOpacity>
    );

    render(){
        return (

            <Container>
                
                <Spinner
                    visible={this.state.loading}
                    textContent={this.state.textContent}
                    textStyle={styles.spinnerTextStyle} />

                <Header style={styles.headerMenu}>
                    
                    <Left style={{flex:1}} >
                        <Icon name="angle-left" style={{color: '#FFF', fontSize: 40}} onPress={() => this.props.navigation.navigate('Hospitals') } />
                    </Left>
                    <Body style={{flex: 7}}>
                        <Title style={{color: 'white'}}>{this.state.hospital.name}</Title>
                    </Body>
                </Header> 
                <Content style={baseStyles.container}>
                    <View style={styles.container}>
                        <FlatList
                            contentContainerStyle={baseStyles.container}
                            data={this.state.hospital.hospitalizationList}
                            keyExtractor={item => `${item.id}`}
                            renderItem={this.renderItem}
                            onEndReached={this.sincronizar}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}
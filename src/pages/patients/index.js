import React, { Component } from "react"
import { Container, Content, Right, Text, Card, CardItem } from 'native-base';
import { View, FlatList, TouchableOpacity, Image, BackHandler } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { RdHeader } from '../../components/rededor-base';
import baseStyles from '../../styles';
import styles from './style';
import Patient from '../../model/Patient';

export default class Patients extends Component {
    
    constructor(props) {

        super(props);

        this.state = {
            hospital: {},
            loading: false,
            timerTextColor: "#005cd1",
            timerBackgroundColor: "#fff"
        }
    }

    didFocus = this.props.navigation.addListener('didFocus', (res) => {

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
                            const patientClass = new Patient(patient);

                            let iconNumber = patientClass.getIconNumber();

                            patient.totalDaysOfHospitalization = this.calculateDaysOfHospitalization(patient);
                            patient.colorNumber = this.getColorNumber(patient);
                            patient.colorName = this.getColor(patient.colorNumber);
                            patient.backgroundColor = this.getBackgroundColor(patient.colorNumber);
                            patient.lastVisit = this.getLastVisit(patient);
                            patient.iconNumber = iconNumber;
                            patient.icon = patientClass.getIcon(iconNumber);
                            patient.orderField = this.getOrderField(patient);
                            patients.push(patient);
                        }

                    });

                    patients = _.orderBy(patients, ['orderField'], ['asc']);

                    hospital.hospitalizationList = patients;

                    this.setState({hospital: hospital});

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

        let today = moment();
        if (patient.medicalExitDate) {
            today = moment(patient.medicalExitDate);
        }

        let admissionDate = moment(moment(patient.admissionDate).format('YYYY-MM-DD'));

        let totalHospitalizationDays = today.diff(admissionDate, 'days');

        return totalHospitalizationDays + 1;
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
            return 'S/ visita'
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
        return today.diff(dateFormatted, 'days') + ' dias'
    }

    exitDateIsNotEqualToLastVisit(patient) {
        const exitDate = moment(patient.exitDate)
        let listOfOrderedPatientVisits = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
        let dateLastVisitFormatted = moment(moment(listOfOrderedPatientVisits[0].observationDate).format('YYYY-MM-DD'))
        let diffDays = exitDate.diff(dateLastVisitFormatted, 'days')
        return diffDays !== 0 ? true : false
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
                            <Text style={[styles.patientTitle, {color: `${item.colorName}`, fontSize: 16, marginLeft: -10, width: '90%'} ]}> {item.patientName} </Text>
                        </View>
                        <Right>
                            <Image source={item.icon} style={{width: 25, height: 25}} />
                        </Right>
                    </CardItem>
                    
                    <CardItem footer bordered style={{ height: 50, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0}}>                            
                        
                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}>Internado</Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}>{item.totalDaysOfHospitalization} {item.totalDaysOfHospitalization <= 1 ? 'dia' : 'dias'}</Text>
                        </View>
                        
                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}>Setor</Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}>{item.locationSession}</Text>
                        </View>
                        
                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}>Leito</Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}>{item.locationBed}</Text>
                        </View>
                        
                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal', paddingRight: 10}}>Última visita</Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold', paddingRight: 10}}>{item.lastVisit}</Text>
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
                <RdHeader
                    title={this.state.hospital.name}
                    goBack={()=>this.props.navigation.navigate('Hospitals')}/>
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

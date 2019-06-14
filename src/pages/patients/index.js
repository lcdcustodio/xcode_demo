import React, { Component } from "react"
import styles from './style'
import { Container, Content, Header, Left, Right, Body, Icon, Title, Text } from 'native-base'
import { Alert, View, FlatList, TouchableOpacity, Image, BackHandler } from "react-native"
import moment from 'moment'
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage';

export default class Patients extends Component {
    
    constructor(props) {

        super(props);

        this.state = {
            hospital: {},
            ICON: {
                OLHO_CINZA_COM_CHECK: 2,
                OLHO_AZUL: 0,
                OLHO_CINZA_COM_EXCLAMACAO: 3,
                CASA_AZUL: 1
            }
        }

        console.log(this.state.ICON);

    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        console.log('go back');
        this.props.navigation.navigate('Hospitals');
        return true;
    }

    didFocus = this.props.navigation.addListener('didFocus', (res) => {

        AsyncStorage.getItem('hospital', (err, hospital) => {
            
            let patients = [];

            hospital = JSON.parse(hospital);

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
                    patient.lastVisit = this.getLastVisit(patient);
                    patient.iconNumber = this.getIconNumber(patient);
                    patient.icon = this.getIcon(patient.iconNumber);
                    patient.orderField = this.getOrderField(patient);
                    patients.push(patient);
                }

                console.log(patients);
            });

            patients = _.orderBy(patients, ['orderField'], ['asc']);

            hospital.hospitalizationList = patients;

            console.log(patients);

            this.setState({hospital: hospital});
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

    getLastVisit(patient) {
        let listOfOrderedPatientVisits = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
        if(patient.observationList.length === 0 || listOfOrderedPatientVisits[0].observationDate === null) {
            return 'SEM VISITAS'
        } else if(this.isToday(listOfOrderedPatientVisits[0].observationDate)) {
            return 'HOJE'
        } else if(this.isYesterday(listOfOrderedPatientVisits[0].observationDate)) {
            return 'ONTEM'
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

        console.log(lastVisit, patient.patientName);

        if(lastVisit == 0 && patient.exitDate == null) // VISITADO HOJE E NÃO TEVE ALTA
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

        else if(patient.observationList.length > 0 && listOfOrderedPatientObservations[0].alert) // TEVE VISITA E COM ALERTA
        {
            return this.state.ICON.OLHO_CINZA_COM_EXCLAMACAO;
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
                this.props.navigation.navigate("PatientDetail", { patient: item});
            }}>
            <View style={[styles.productContainer]}>
                <View>
                    <Text style={[styles.patientTitle, {color: `${item.colorName}`} ]}> {item.patientName} </Text>
                    <Text style={styles.hospitalizationDescription}> INTERNADO: {item.totalDaysOfHospitalization} Dias | SETOR: {item.locationSession} | LEITO: {item.locationBed} </Text>  
                    <Text style={styles.lastVisit}> Última visita: {item.lastVisit} </Text>
                </View>
                <View >
                    <Image source={item.icon} style={{width: 25, height: 25}} />
                </View>
            </View>
        </TouchableOpacity>
    );

    render(){
        return (
            <Container>
                <Header style={styles.headerMenu}>
                    
                    <Left style={{flex:1}} >
                        <Icon type="AntDesign" name="left" style={{ color: 'white' }} onPress={() => this.props.navigation.navigate('Hospitals') } />
                    </Left>
                    <Body style={{flex: 7}}>
                        <Title style={{color: 'white'}}>{this.state.hospital.name}</Title>
                    </Body>
                </Header> 
                <Content>
                    <View style={styles.container}>
                        <FlatList
                            contentContainerStyle={styles.list}
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
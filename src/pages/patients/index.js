import React, { Component } from "react"
import styles from './style'
import { Container, Content, Header, Left, Right, Body, Icon, Title, Text } from 'native-base'
import { Alert, View, FlatList, TouchableOpacity, Image, BackHandler } from "react-native"
import moment from 'moment'
import _ from 'lodash'

export default class Patients extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            hospital: {},
        }
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

        let hospital = this.props.navigation.getParam('hospital');

        let patients = [];

        console.log(hospital.hospitalizationList);

        hospital.hospitalizationList.forEach( patient => {

            let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);

            if(
                (patient.exitDate == null && listOfOrderedPatientObservations.length == 0) || 

                (patient.exitDate == null && listOfOrderedPatientObservations.length > 0 && !listOfOrderedPatientObservations[0].endTracking) || 

                (patient.exitDate != null && listOfOrderedPatientObservations.length > 0 && !listOfOrderedPatientObservations[0].medicalRelease)
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
        
        let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc'])
        
        let lastVisit = null;

        if (listOfOrderedPatientObservations.length > 0) {
            
            const today = moment();
            
            lastVisit = moment(moment(listOfOrderedPatientObservations[0].observationDate).format('YYYY-MM-DD'));

            lastVisit = today.diff(lastVisit, 'days');
        }

        if(patient.exitDate == null && lastVisit == 0)
        {
            return 2; // OLHO CINZA COM CHECK
        }
        else if(patient.exitDate == null && (lastVisit > 0 || patient.observationList.length == 0))
        {
            return 0; // OLHO AZUL
        }
        else
        {
            return 1; // CASA AZUL
        }
    }

    getIcon(iconNumber) {
                
        if(iconNumber == 2)
        {
            return require('../../images/ic_visibility_green_24px.png'); // OLHO CINZA COM CHECK
        }
        else if(iconNumber == 0)
        {
            return require('../../images/ic_visibility_blue_24px.png'); // OLHO AZUL
        }
        else if(iconNumber == 1)
        {
            return require('../../images/ic_home_24px.png'); // OLHO AZUL
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
                    <Body style={{flex: 3, flexDirection: 'row'}}>
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
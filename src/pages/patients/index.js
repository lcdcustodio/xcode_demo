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
            baseDataSync: {},
        }
    }

    componentDidMount() {
        console.log('back press');
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        console.log('go back');
        this.props.navigation.navigate('Hospitals');
        return true;
    }

    didFocus = this.props.navigation.addListener('didFocus', (res) => {
        let hospital = this.props.navigation.getParam('hospital');
        let baseDataSync = this.props.navigation.getParam('baseDataSync');
        let patients = [];

        console.log(baseDataSync);

        console.log(hospital.hospitalizationList);

        hospital.hospitalizationList.forEach( patient => {

            let adminDischargeExit = false;

            for (var i = 0; i < patient.trackingList.length; i++) {
                if (patient.trackingList[i].endMode == 'ADMIN_DISCHARGE_EXIT') {
                    adminDischargeExit = true;
                }
            }
            
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
        });

        patients = _.orderBy(patients, ['orderField'], ['asc']);

        //console.log(patients);

        hospital.hospitalizationList = patients;
        this.setState({hospital: hospital});
        this.setState({baseDataSync: baseDataSync});
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
        let listOfOrderedPatientVisits = _.orderBy(patient.trackingList, ['endDate'], ['desc'])
        if(patient.trackingList.length === 0 || listOfOrderedPatientVisits[0].endDate === null) {
            return 'SEM VISITAS'
        } else if(this.isToday(listOfOrderedPatientVisits[0].endDate)) {
            return 'HOJE'
        } else if(this.isYesterday(listOfOrderedPatientVisits[0].endDate)) {
            return 'ONTEM'
        } else {
            return this.totalDaysAgo(listOfOrderedPatientVisits[0].endDate)
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
        let listOfOrderedPatientVisits = _.orderBy(patient.trackingList, ['endDate'], ['desc'])
        let dateLastVisitFormatted = moment(moment(listOfOrderedPatientVisits[0].endDate).format('YYYY-MM-DD'))
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
                this.props.navigation.navigate("PatientDetail", { patient: item, hospital: this.state.hospital, baseDataSync: this.state.baseDataSync });
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
                    <Body style={{flex: 7, alignItems: 'stretch'}}>
                        <Title>{this.state.hospital.name}</Title>
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
import JsonEntity	from '../util/JsonEntity';
import Observation	from './Observation';
import Tracking, { TrackingEndModeEnum } from './Tracking';
import _ from 'lodash';
import moment from 'moment';

export default class Patient extends JsonEntity<Patient> {

	public get attendanceType(): AttendanceTypeEnum {
		return this.json.attendanceType;
	}

	public set attendanceType(value: AttendanceTypeEnum) {
		this.json.attendanceType = value;
	}

	public get hospitalizationType(): HospitalizationTypeEnum {
		return this.json.hospitalizationType;
	}

	public set hospitalizationType(value: HospitalizationTypeEnum) {
		this.json.hospitalizationType = value;
	}

	public get trackingList(): Tracking[] {
		return this.getList('trackingList', Tracking);
	}

	public get observationList(): Observation[] {
		return this.getList('observationList', Observation);
	}

	public getLastTracking(): Tracking {
		const list = this.trackingList;
		return (list.length >= 0 ? list[list.length - 1] : null);
	}
	
	public getLastObservation(): Observation {
		const list = this.observationList;
		return (list.length >= 0 ? list[list.length - 1] : null);
	}

	public getIconNumber() {

		const { exitDate, observationList } = this.json;

		let lastVisit = null;

        let listOfOrderedPatientObservations = _.orderBy(observationList, ['observationDate'], ['desc']);


        const today = moment();

        if (listOfOrderedPatientObservations.length > 0) {

	        if(listOfOrderedPatientObservations[0].observationDate == null){
	        	return IconEyeEnum.OLHO_AZUL;
	        }
            
            const today = moment();
            
            lastVisit = moment(moment(listOfOrderedPatientObservations[0].observationDate).format('YYYY-MM-DD'));

            lastVisit = today.diff(lastVisit, 'days');
        }

        if(observationList.length > 0 && listOfOrderedPatientObservations[0].alert && exitDate == null) // TEVE VISITA E COM ALERTA E NÃO TEVE ALTA
        {
            return IconEyeEnum.OLHO_CINZA_COM_EXCLAMACAO;
        }
        else if(lastVisit == 0 && exitDate == null) // VISITADO HOJE E NÃO TEVE ALTA
        {
            return IconEyeEnum.OLHO_CINZA_COM_CHECK;
        }

        else if(lastVisit > 0 && exitDate == null) // NÃO TEVE VISITA HOJE E NÃO TEVE ALTA
        {
            return IconEyeEnum.OLHO_AZUL;
        }

        else if(observationList.length == 0 && exitDate == null) // NÃO TEVE VISITA E NÃO TEVE ALTA
        {
            return IconEyeEnum.OLHO_AZUL;
        }

        else if (exitDate != null) // TEVE ALTA
        {
            return IconEyeEnum.CASA_AZUL;
        }
    }

    public getIcon(iconNumber) {
        
        if(iconNumber == IconEyeEnum.OLHO_CINZA_COM_CHECK)
        {
            return require('../images/ic_visibility_green_24px.png');
        }
        else if(iconNumber == IconEyeEnum.OLHO_AZUL)
        {
            return require('../images/ic_visibility_blue_24px.png');
        }
        else if(iconNumber == IconEyeEnum.CASA_AZUL)
        {
            return require('../images/ic_home_24px.png');
        }
        else if(iconNumber == IconEyeEnum.OLHO_CINZA_COM_EXCLAMACAO)
        {
            return require('../images/ic_visibility_exclamation_24px.png');
        }
    }

	public validateFinalization(): FinalizationErrorEnum[] {
		const { patientHeight, patientWeight, attendanceType, hospitalizationType, diagnosticHypothesisList,
				mainProcedureCRM } = this.json;
		const errors = [];
		if (patientHeight == null || patientWeight == null) {
			errors.push(FinalizationErrorEnum.HeightAndWeightMissing);
		}
		if (!attendanceType) {
			errors.push(FinalizationErrorEnum.AttendanceTypeMissing);
		}
		if (!hospitalizationType) {
			errors.push(FinalizationErrorEnum.HospitalizationTypeMissing);
		}
		if (!diagnosticHypothesisList || !diagnosticHypothesisList.length) {
			errors.push(FinalizationErrorEnum.PrimaryCidMissing);
		}
		if (!mainProcedureCRM && attendanceType === HospitalizationTypeEnum.Surgical) {
			errors.push(FinalizationErrorEnum.CrmMissing);
		}
		return errors;
	}

	public getHospitalizationStatusEnum(): HospitalizationStatusEnum {
		const lastTracking = this.getLastTracking();
		if (lastTracking && !lastTracking.json.endDate) {
			return HospitalizationStatusEnum.Open;
		}
		const lastObservation = this.getLastObservation();
		if (lastObservation && (lastObservation.json.medicalRelease || lastObservation.json.endTracking)) {
			return HospitalizationStatusEnum.Closed;
		}
		return HospitalizationStatusEnum.CanBeClosed;
	}

	public getStatusVisitEnum(): StatusVisitEnum {
        if (this.isHospitalizationActive()) {
            if (this.hasObservationToday()) {
                return StatusVisitEnum.Visited;
            } else {
				const lastObservation = this.getLastObservation();
				return (lastObservation && lastObservation.json.alert)
					? StatusVisitEnum.NotVisitedAlert
                	: StatusVisitEnum.NotVisited;
            }
        } else {
			const lastObservation = this.getLastObservation();
            if (lastObservation && (lastObservation.json.medicalRelease || lastObservation.json.endTracking)) {
				return (lastObservation.json.medicalRelease)
					? StatusVisitEnum.VisitedDischarged
					: StatusVisitEnum.VisitedEndTracking;
            } else {
				const lastTracking = this.getLastTracking();
				if (lastTracking) {
					return (lastTracking.endMode === TrackingEndModeEnum.AdminDischarge)
						? StatusVisitEnum.NotVisitedDischarged
						: StatusVisitEnum.NotVisitedEndTracking;
				}
				return StatusVisitEnum.Unexpected;
			}
        }
	}

	public isHospitalizationActive(): boolean {
		const lastTracking = this.getLastTracking();
		return !(!!this.json.exitDate || (!!lastTracking && !!lastTracking.json.endDate));
	}

    public hasObservationToday(): boolean {
		const lastObservation = this.getLastObservation();
		if (lastObservation && lastObservation.json.observationDate) {
			const date = new Date(lastObservation.json.observationDate);
			const today = new Date();
			return date.getFullYear() === today.getFullYear() &&
					date.getMonth() === today.getMonth() &&
					date.getDate() === today.getDate();
		}
		return false;
    }
}

export enum AttendanceTypeEnum {
	Elective,
	Emergency,
}

export enum HospitalizationTypeEnum {
	Surgical,
	Clinical,
}

export enum FinalizationErrorEnum {
	HeightAndWeightMissing,
	AttendanceTypeMissing,
	HospitalizationTypeMissing,
	PrimaryCidMissing,
	CrmMissing,
}

export enum HospitalizationStatusEnum {
    Open,
    Closed,
    CanBeClosed,
}

export enum StatusVisitEnum {
    NotVisited,
    NotVisitedAlert,
    NotVisitedEndTracking,
    NotVisitedDischarged,
    Visited,
    VisitedEndTracking,
	VisitedDischarged,
	Unexpected,
}

export enum IconEyeEnum {
    OLHO_CINZA_COM_CHECK = 3,
    OLHO_AZUL = 1,
    OLHO_CINZA_COM_EXCLAMACAO = 0,
    CASA_AZUL = 2,
}

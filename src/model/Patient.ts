import JsonEntity	from '../util/JsonEntity';
import Observation	from './Observation';
import Tracking, { TrackingEndModeEnum } from './Tracking';

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

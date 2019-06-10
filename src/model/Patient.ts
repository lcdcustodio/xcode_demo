import JsonEntity	from '../util/JsonEntity';
import { HospitalizationStatusEnum } from './Hospitalization';
import Observation	from './Observation';
import Tracking		from './Tracking';

export default class Patient extends JsonEntity<Patient> {

	public getTrackingList(): Tracking[] {
		return this.getList('trackingList', Tracking);
	}

	public getObservationList(): Observation[] {
		return this.getList('observationList', Observation);
	}

	public getVisitsButtonEnum(): VisitsButtonEnum {
		switch (this.getHospitalizationStatusEnum()) {
			case HospitalizationStatusEnum.Open:
				const statusVisit = this.getStatusVisitEnum();
				return (statusVisit === StatusVisitEnum.Visited)
					? VisitsButtonEnum.Visited
					: VisitsButtonEnum.Visit;

			case HospitalizationStatusEnum.CanBeClosed:
				const lastTracking = this.getLastTracking();
				if (lastTracking && lastTracking.json.endMode === ADMIN_DISCHARGE_EXIT) {
					return VisitsButtonEnum.Finalize;
				}
				if (lastTracking && lastTracking.json.endDate) {
					const statusVisit = this.getStatusVisitEnum();
					return (statusVisit === StatusVisitEnum.VisitedEndTracking)
						? VisitsButtonEnum.EndTrackingDisabled
						: VisitsButtonEnum.EndTrackingEnabled;
				}
				return VisitsButtonEnum.Unexpected;

			case HospitalizationStatusEnum.Closed:
				return VisitsButtonEnum.Unexpected; // Finalizados não são exibidos.
		}
	}

	public getLastTracking(): Tracking {
		const list = this.getTrackingList();
		return (list.length >= 0 ? list[list.length - 1] : null);
	}
	
	public getLastObservation(): Observation {
		const list = this.getObservationList();
		return (list.length >= 0 ? list[list.length - 1] : null);
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
					return (lastTracking.json.endMode === ADMIN_DISCHARGE_EXIT)
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

const ADMIN_DISCHARGE_EXIT = 'ADMIN_DISCHARGE_EXIT';

export enum StatusVisitEnum {
    NotVisited = 1,
    NotVisitedAlert,
    NotVisitedEndTracking,
    NotVisitedDischarged,
    Visited,
    VisitedEndTracking,
	VisitedDischarged,
	Unexpected,
}

export enum VisitsButtonEnum {
	Visit,
	Visited,
	Finalize,
	EndTrackingEnabled,
	EndTrackingDisabled,
	Unexpected,
}

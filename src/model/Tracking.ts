import { compareJsonDate } from '../util/Comparable';
import JsonEntity from '../util/JsonEntity';

export default class Tracking extends JsonEntity<Tracking> {

    public get endMode(): TrackingEndModeEnum {
        return this.json.endMode;
    }

    public set endMode(value: TrackingEndModeEnum) {
        this.json.endMode = value;
    }

    public compareTo(other: Tracking): number {
        return compareJsonDate(this.json.startDate, other.json.startDate);
    }
}

export enum TrackingEndModeEnum {
    AdminDischarge = 'ADMIN_DISCHARGE_EXIT',
    Urgency = 'URGENCY_EXIT',
    ChangeInsurance = 'CHANGE_INSURANCE_EXIT',
}

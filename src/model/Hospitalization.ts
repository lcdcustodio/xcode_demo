import JsonEntity from '../util/JsonEntity';

export default class Hospitalization extends JsonEntity<Hospitalization> {
}

export enum HospitalizationStatusEnum {
    Open,
    Closed,
    CanBeClosed,
}

import JsonEntity from '../util/JsonEntity';

export default class Hospitalization extends JsonEntity {
}

export enum HospitalizationStatusEnum {
    Open,
    Closed,
    CanBeClosed,
}

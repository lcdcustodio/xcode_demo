import { compareJsonDate } from '../util/Comparable';
import JsonEntity from '../util/JsonEntity';

export default class Observation extends JsonEntity<Observation> {

    compareTo(other: Observation): number {
        return compareJsonDate(this.json.observationDate, other.json.observationDate);
    }
}

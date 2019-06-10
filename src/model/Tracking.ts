import { compareJsonDate } from '../util/Comparable';
import JsonEntity from '../util/JsonEntity';

export default class Tracking extends JsonEntity<Tracking> {

    compareTo(other: Tracking): number {
        return compareJsonDate(this.json.startDate, other.json.startDate);
    }
}

import Comparable, { compareJsonDate } from '../util/Comparable';
import JsonEntity from '../util/JsonEntity';

export default class Tracking extends JsonEntity implements Comparable<Tracking> {

    compareTo(other: Tracking): number {
        return compareJsonDate(this.json.startDate, other.json.startDate);
    }
}

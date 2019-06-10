import { HospitalizationStatusEnum } from './Hospitalization';
import JsonEntity	from '../util/JsonEntity';
import Observation	from './Observation';
import Tracking		from './Tracking';

export default class Patient extends JsonEntity {

    public getHospitalizationStatus(): HospitalizationStatusEnum {
		const {trackingList, observationList} = this.json;
		if (trackingList && trackingList.length > 0) {
			const list = this.getList(Tracking, trackingList).sort(JsonEntity.compare);
			const last = list[list.length - 1];
			if (!last.json.endDate) {
				return HospitalizationStatusEnum.Open;
			}
		}
		if (observationList && observationList.length > 0) {
			const list = this.getList(Observation, observationList).sort(JsonEntity.compare);
			const last = list[list.length - 1];
			if (last.json.medicalRelease || last.json.endTracking) {
				return HospitalizationStatusEnum.Closed
			}
		}
		return HospitalizationStatusEnum.CanBeClosed;
    }
}

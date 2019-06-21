import Comparable, { compareDate } from './Comparable';

export enum TimelineEventEnum {
    ExamRequest,
    FurtherOpinion,
    MedicalProcedure,
    MedicineUsage,
    Recommendation
}

export default class TimelineEvent implements Comparable<TimelineEvent> {
    public readonly typeEnum: TimelineEventEnum;
    public readonly data: any;
    public readonly time: Date;
    public readonly type: string;
    public readonly name: string;
    public readonly comments: string;
    public readonly costEvaluation: TimelineEventEvaluation;
    public readonly qualityEvaluation: TimelineEventEvaluation;

    public constructor(typeEnum: TimelineEventEnum, data: any, time: Date, type: string, name: string, comments: string, costEvaluation: TimelineEventEvaluation, qualityEvaluation: TimelineEventEvaluation) {
        this.typeEnum = typeEnum;
        this.data = data;
        this.time = time;
        this.type = type;
        this.name = name;
        this.comments = comments;
        this.costEvaluation = costEvaluation;
        this.qualityEvaluation = qualityEvaluation;
    }

    compareTo(other: TimelineEvent): number {
        return compareDate(this.time, other.time);
    }
}

export class TimelineEventEvaluation {
    public readonly satisfactory: boolean;
    public readonly observation: string;

    public constructor(satisfactory: boolean, observation: string) {
        this.satisfactory = satisfactory;
        this.observation = observation;
    }
}

export function timelineEventSorter (a: TimelineEvent, b: TimelineEvent) {
    return -a.compareTo(b);
}

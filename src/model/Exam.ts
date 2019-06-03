import Event from './Event';

export default class Exam extends Event {

    public constructor(source: any) {
        super(source);
    }

    public get examDisplayName(): string {
        return this.source.examDisplayName;
    }

    public set examDisplayName(value: string) {
        this.source.examDisplayName = value;
    }

    public get examHighCost(): boolean {
        return this.source.examHighCost;
    }

    public set examHighCost(value: boolean) {
        this.source.examHighCost = value;
    }
}

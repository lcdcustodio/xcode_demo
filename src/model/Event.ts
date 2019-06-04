
export default abstract class Event {

    protected source: any;

    protected constructor(source: any) {
        this.source = source;
    }

    public get performedAt(): Date {
        return new Date(this.source.performedAt);
    }

    public set performedAt(value: Date) {
        this.source.performedAt = value.toJSON();
    }

    public static compare(a: Event, b: Event): number {
        const timeA = a.performedAt.getTime();
        const timeB = b.performedAt.getTime();
        return (timeA === timeB ? 0 : (timeA < timeB? -1 : 1));
    }
}

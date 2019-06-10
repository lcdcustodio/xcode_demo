import Comparable from "./Comparable";

export default abstract class JsonEntity {

    public readonly json: any;

    public constructor(json: any) {
        this.json = json;
    }

    protected getList<T extends JsonEntity>(constructor: new(json:any)=>T, json: any[]): T[]  {
        let list: T[] = [];
        for (let i = 0; i < json.length; i++) {
            list.push(new constructor(json[i]));
        }
        return list;
    }

    protected static compare<T extends Comparable<T>>(a: T, b: T): number {
        return a.compareTo(b);
    }
}

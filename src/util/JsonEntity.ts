import Comparable, { compare } from './Comparable';

export default abstract class JsonEntity<T extends JsonEntity<T>> implements Comparable<T> {

    public readonly json: any;
    
    private loadedLists: Map<string, any[]>;

    public constructor(json: any) {
        this.json = json;
    }

    public get dirty(): boolean {
        return false;
    }

    public set dirty(value: boolean) {
        if (value) {
            this.loadedLists.clear();
        }
    }

    protected getList<M extends JsonEntity<M>>(key: string, constructor: new(json:any)=>M): M[]  {
        if (this.loadedLists) {
            if (this.loadedLists.has(key)) {
                return this.loadedLists.get(key);
            }
        } else {
            this.loadedLists = new Map<string, any[]>();
        }
        const listJson: any[] = this.json[key];
        const list: M[] = [];
        if (listJson) {
            for (let i = 0; i < listJson.length; i++) {
                list.push(new constructor(listJson[i]));
            }
        }
        list.sort(compare);
        this.loadedLists.set(key, list);
        return list;
    }

    compareTo(other: T): number {
        return 0;
    }
}

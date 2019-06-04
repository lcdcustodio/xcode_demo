import Recommendation from './Recommendation';

export default class MedicineReintegration extends Recommendation {

    public constructor(source: any) {
        super(source);
    }

    public get observation(): string {
        return this.source.observation;
    }

    public set observation(value: string) {
        this.source.observation = value;
    }
}

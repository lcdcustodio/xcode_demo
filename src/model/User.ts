
export default class User {

    private _name: string;
    private _profile: string;

    public constructor (name: string, profile: string) {
        this._name = name;
        this._profile = profile;
    }

    public get name(): string {
        return this._name;
    }

    public get profile(): string {
        return this._profile;
    }
}

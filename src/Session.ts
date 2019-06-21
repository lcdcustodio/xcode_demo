import User from "./model/User";

export default class Session {

	private static _current: Session = new Session();

	private _user: User;

	private constructor() {
		this._user = null;
	}

	public static get current(): Session {
		return Session._current;
	}

	public get user(): User {
		return this._user;
	}

	public set user(value: User) {
		this._user = value;
	}
}

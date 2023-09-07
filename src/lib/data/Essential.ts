import BackendClient from "$lib/Backend.client";

export enum PermissionLevel {
    PLAYER = 0,
    TESTER = 1,
    MODERATOR = 2,
    ADMIN = 3,
}

export default class Essential {

    private static _yourId: number;
    public static get yourId(): number {
        return this._yourId;
    }
    private static _yourPermission: PermissionLevel;
    public static get yourPermission(): PermissionLevel {
        return this._yourPermission;
    }
    private static setupPromiseResolver;
    public static setupPromise = new Promise<any>((res, rej) => {
        this.setupPromiseResolver = res;
    })

    /**
     * @returns `true` if the operation was successful, `false` otherwise.
     */
    public static async setup(): Promise<boolean> {
        const DATA = (await BackendClient.get("/players/my-info")).payload;        
        if (!DATA) return false;
        this._yourId = DATA.yourId;
        this._yourPermission = DATA.yourPermission;
        this.setupPromiseResolver(DATA);
        return true;
    }

}
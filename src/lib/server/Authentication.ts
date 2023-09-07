import BackendServer from "$lib/Backend.server";
import { decode } from "jsonwebtoken";

export default class Authentication {
    static async loggedIn(token: string): Promise<boolean> { 
        const RES = await BackendServer.fetch(`/is-logged-in`, token);
        if (!RES.ok) return false;
        const DAT: any = await RES.json()
        return DAT;
    }

    static async getPlayerIdFromToken(token: string) {
        const RES = await BackendServer.fetch(`/players/my-info`, token);
        if (!RES.ok) return null;
        const DAT: any = await RES.json()
        return DAT.yourId;
    } 

    static async isSetup(token: string): Promise<boolean> {
        if (await this.loggedIn(token)) {
            const RES = await BackendServer.fetch(`/players/my-lunch`, token);
            if (!RES.ok) return false;
            const DAT: any = await RES.text()
            return !!DAT;
        } else return false;
    }
}
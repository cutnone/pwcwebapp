import type { RequestEvent } from "@sveltejs/kit/types/index";
import { redirect } from "@sveltejs/kit";
import Authentication from "$lib/server/Authentication";
import { decode } from "jsonwebtoken";
import BackendServer from "$lib/Backend.server";

export const load = async (e: RequestEvent) => {
    const TOKEN = e.cookies.get("token");
    if (!(await Authentication.loggedIn(TOKEN))) {
        throw redirect(303, "/");
    }
    if (!(await Authentication.isSetup(TOKEN))) {
        throw redirect(303, "/setup");
    } else {
        const GAME_STATE = await (await BackendServer.fetch("/game-state", TOKEN)).text()
        const INFO = decode(TOKEN);
        const PDATA: any = await (await BackendServer.fetch(`/players/get?googleid=${INFO.sub}`, TOKEN)).json()

        if (!PDATA.team) {

            throw redirect(303, "/pregame");
        }
        if (PDATA.permissionlevel < 1 && GAME_STATE !== "IN_GAME") {
            throw redirect(303, "/pregame");
        }
        return;
    }

}
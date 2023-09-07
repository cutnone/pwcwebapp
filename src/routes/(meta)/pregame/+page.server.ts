import type {RequestEvent } from "@sveltejs/kit/types/index";
import { redirect } from "@sveltejs/kit";
import { decode } from "jsonwebtoken";
import Authentication from "$lib/server/Authentication";
import BackendServer from "$lib/Backend.server";

export const load = async (e: RequestEvent) => {
    const TOKEN = e.cookies.get("token");
    const GAME_STATE = await (await BackendServer.fetch("/game-state", TOKEN)).text()
    const INFO = decode(TOKEN);
    
    if (!(await Authentication.loggedIn(TOKEN))) {
        throw redirect(303, "/");
    }
    if (!(await Authentication.isSetup(TOKEN))) {
        throw redirect(303, "/setup");
    }
    const TEAM = ((await (await BackendServer.fetch(`/players/get?googleid=${INFO.sub}`, TOKEN)).json()) as any).team;
    if (TEAM && GAME_STATE === "IN_GAME") {
        throw redirect(303, "/dashboard");
    }
    
}
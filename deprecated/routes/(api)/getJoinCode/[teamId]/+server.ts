import Authentication from "$lib/server/Authentication";
import { error, type RequestEvent } from "@sveltejs/kit";
import DatabaseInterface from "$lib/server/DatabaseInterface";

export const GET = async (req:RequestEvent) => {
    const TOKEN = req.cookies.get("token");
    if (await Authentication.loggedIn(TOKEN)) {
        const ID = parseInt(req.params.teamId);
        if (ID !== ID) {
            // is NaN
            throw error(400);
        }
        const PLAYER_ID = await Authentication.getPlayerIdFromToken(TOKEN);
        if (!PLAYER_ID) throw error(400);
        const TEAM = await DatabaseInterface.DB.query("SELECT id, leader, joincode FROM teams WHERE id = $1;", [ID]); 
        if (!TEAM[0]) {
            throw error(404);
        }
        if (TEAM[0]?.leader === PLAYER_ID) {
            return new Response(TEAM[0].joincode);
        } else {
            throw error(403);
        }
    } else {
        
        throw error(400);

    }
}

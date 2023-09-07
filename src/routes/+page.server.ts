import Authentication from '$lib/server/Authentication';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';

export const load = async (req: RequestEvent) => {
    
    const TOKEN = req.cookies.get("token");
    if (await Authentication.loggedIn(TOKEN)) {
        if (await Authentication.isSetup(TOKEN)) {

            throw redirect(303, "/pregame");
        }
        throw redirect(303, "/setup");
    } 
}
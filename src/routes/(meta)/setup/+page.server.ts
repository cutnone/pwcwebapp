import type {RequestEvent } from "@sveltejs/kit/types/index";
import { redirect } from "@sveltejs/kit";
import Authentication from "$lib/server/Authentication";

export const load = async (e: RequestEvent) => {
    const TOKEN = e.cookies.get("token");
    
    if (!(await Authentication.loggedIn(TOKEN))) {
        throw redirect(303, "/");
    }
    
}
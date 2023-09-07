import BackendServer from "$lib/Backend.server";
import { redirect, type RequestEvent } from "@sveltejs/kit";

export async function load(req: RequestEvent) {
    
    const ID = parseInt(req.params.id);
    if (isNaN(ID)) {
        throw redirect(303, "/rankings");
    }
    const EXISTS = (await BackendServer.fetch(`/teams/get?id=${ID}`, req.cookies.get("token"))).ok
    
    if (!EXISTS) {
        throw redirect(303, "/rankings");
    }
    
}
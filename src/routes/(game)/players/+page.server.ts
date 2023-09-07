import { redirect, type RequestEvent } from "@sveltejs/kit";


export function load(req: RequestEvent) {
    throw redirect(303, "/rankings");
}
import DatabaseInterface from "$lib/server/DatabaseInterface";
import type { RequestEvent } from "@sveltejs/kit";
import {LoginTicket, OAuth2Client, } from "google-auth-library";
import { capitalizeName } from "$lib/UTILS";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const CLIENT = new OAuth2Client(CLIENT_ID)

export async function POST(req: RequestEvent) {
    let body; 
    try {
        body = await req.request.json();
    } catch {
        return new Response("Bad Request", {status: 400});
    }
    if (!body.credential) return new Response("Missing Token", {status: 400});

    // has token cookie

    let verified = true;
    const TICKET = await CLIENT.verifyIdToken({
        idToken: body.credential,
        audience: CLIENT_ID,
    }).catch(()=>{
        verified = false;
    }) as LoginTicket;
    if (!verified) return new Response("Bad Credentials", {status: 400});
    const PAYLOAD = TICKET.getPayload();
    
    // has verified token

    const userExists = (await DatabaseInterface.DB.query("SELECT EXISTS(SELECT FROM players WHERE googleid = $1);", [PAYLOAD.sub]))[0].exists;
    if (userExists) {
        // good to go
        return new Response("OK", {
            status: 200,
        });
    } else {
        // make sure they're allowed on before creating account
        if (PAYLOAD.hd?.endsWith("colonialsd.org")) {
            // allowed on, create record
            await DatabaseInterface.DB.query("INSERT INTO players (googleid, preferredname, familyname, avatar, givenname) VALUES ($1, $2, $3, $4, $5)", [PAYLOAD.sub, capitalizeName(PAYLOAD.given_name), capitalizeName(PAYLOAD.family_name), PAYLOAD.picture, capitalizeName(PAYLOAD.given_name)]);
            return new Response("OK", {
                status: 200,
            });
        } else {
            return new Response("Unauthorized", {status: 403});
        }
    }
    
    
}


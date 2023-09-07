import {dev} from "$app/environment";
import type { HandleServerError } from "@sveltejs/kit";

async function start() {
    
    console.log(`PWC is starting in ${dev ? "DEV" : "PROD"} mode.`);
    console.log(`...................................PWC is online!...................................`);
}

export async function handle({ event, resolve }) {
  console.log("Recieved");
  const response = await resolve(event);
  console.log("Responding");
  
  return response;
}

export const handleError: HandleServerError = (e) => {
  console.log(e.error);
  console.log(e.event);
}

start();
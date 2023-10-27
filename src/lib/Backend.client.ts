import { dev } from "$app/environment";
import Cookies from "js-cookie";

const LOCAL_BACKEND_PORT = 3004;
const BACKEND_PORT = 3005;

export default class Backend {

    // private static isLocal;

    static get(url) {
        return this.fetch(url)
    }
    static post(url, body: any) {
        return this.fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    static put(url, body: any) {
        return this.fetch(url, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    static patch(url, body: any) {
        return this.fetch(url, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    static delete(url, body?: any) {
        return this.fetch(url, {
            method: "DELETE",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    static async fetch(url: URL | RequestInfo, init?: RequestInit) {
        const RES = await this.rawFetch(url, init);

        return {
            status: RES.status,
            ok: RES.ok,
            statusText: RES.statusText,
            headers: RES.headers,
            raw: RES,
            payload: (RES.headers.get("content-type")?.startsWith("application/json") || RES.headers.get("content-type")?.startsWith("text/json")) ? await RES.json() : null,
        }
    }

    static async rawFetch(url: URL | RequestInfo, init: RequestInit = {}) {
        if (Cookies.get("token")) {
            if (!init) {
                init = {headers: {}}
            } else if (!init.headers) init.headers = {}
            init.headers["Authorization"] = Cookies.get("token");
        }

        
        const originalURL = url;
        let useURL;
        if (typeof url === "string" && !url.startsWith("http")) {
            useURL = `http://localhost:${LOCAL_BACKEND_PORT}${url.startsWith("/") ? "" : "/"}` + originalURL;
            
            if (!dev || (dev && !(await this.testIsLocal()))) {
                useURL = `https://pwcollections.cloud8point5.com:${BACKEND_PORT}${url.startsWith("/") ? "" : "/"}` + originalURL;
            }
        }
        init.mode = "cors"
        return await fetch(useURL, init);
    }
    static async testIsLocal(): Promise<boolean> {
        return (await ((await fetch("/backend-is-local")).text()) === "true");
    }
}
import { dev } from "$app/environment";
import fetch from "node-fetch"
import net from "net"

const LOCAL_BACKEND_PORT = 3004;
const PUBLIC_BACKEND_PORT = 3005;

export default class {
    static async fetch(url: URL | RequestInfo, authToken?: string, init?: RequestInit) {
        if (authToken) {
            if (!init) {
                init = {headers: {}}
            } else if (!init.headers) init.headers = {}
            init.headers["Authorization"] = authToken;
        }
        let useURL = url;
        if (typeof url === "string" && !url.startsWith("http")) {
            useURL = `http://localhost:${LOCAL_BACKEND_PORT}${url.startsWith("/") ? "" : "/"}` + useURL;
            
            if (dev && !(await this.isLocal())) {
                useURL = `https://pwcollections.cloud8point5.com:${PUBLIC_BACKEND_PORT}${url.startsWith("/") ? "" : "/"}` + useURL;
            }
        }
        return await fetch(useURL as any, init as any); // shut the fuck up typescript
    }
    static async isLocal(): Promise<boolean> {
        if (!dev) return false;
        return await new Promise<boolean>((r)=>{
            const server = net.createServer();
            server.on("error", ()=>{
                server.close()
                r(true)
            })
            server.on("listening", ()=>{
                server.close()
                r(false)
            })
            server.listen(LOCAL_BACKEND_PORT)
        })
    }
}
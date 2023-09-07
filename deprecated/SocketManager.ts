// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { io, type Socket } from "socket.io-client";
import { mergeDeep, showLoader } from "$lib/UTILS";
import { theme } from "$lib/data/UserInfoStores";
import Cookies from "js-cookie";
import Events from "events";

export default class SocketManager {

    public static socket: Socket = io("", { 
        autoConnect: false,
        
    });
    public static yourId;

    public static liveLibrary: Map<string, any> = new Map();

    public static flowing = false;
    private static messageBacklog: [k: string, v: any[]][] = [];
    private static closeLoader = null;
    private static liveEventProxy = new Events();
    public static fullEventProxy = new Events();

                                              // channels don't exist anymore
    private static channels = new Map<string, never>();

    private static interval;

    public static start() {

        this.setup();

        this.connect();

        this.interval = setInterval(() => {
            if (Cookies.get("token")) this.ensureConnection();
        }, 1500);

        // setTimeout(()=>{
        //     this.socket.disconnect();
        // }, 3000)
    }

    public static stop() {
        clearInterval(this.interval);
        this.socket?.close();
    }

    private static setup() {
        this.socket.on("BAD_TOKEN", () => {
            this.socket.removeAllListeners("disconnect");
            Cookies.remove("token");
        });
        this.socket.on("disconnect", async () => {
            this.flowing = false;
            this.closeLoader = showLoader("Connecting...", "Reload if this doesn't go away in a few seconds.");
            this.ensureConnection();
        });

        this.socket.on("theme_update", (m) => {
            if (!m) {
                this.socket.emit("theme_change", (window?.matchMedia("(prefers-color-scheme: light)").matches) ? "default-light" : "default-dark")
            } else {
                theme.set(m);
            }
        });

        this.socket.onAny((event: string, ...args) => {
            console.log("MESSAGE:", event, args);
            if (event.includes(":")) {
                const I = event.indexOf(":");
                const EV = event.substring(0, I);
                this.channels.get(EV)?.emit(event.substring(I + 1), ...args);
            }
            if (event.startsWith("live:")) {

                const PATH = event.substring(5);
                const OLD = this.liveLibrary.get(PATH);
                const NEW = args[0];

                if (typeof NEW !== typeof OLD || typeof NEW !== "object") {
                    this.liveLibrary.set(PATH, NEW);
                } else {

                    const TEMP = mergeDeep(OLD, NEW);
                    this.liveLibrary.set(PATH, deleteUndefined(TEMP));

                }

                this.liveEventProxy.emit(event.substring(5), this.liveLibrary.get(PATH));
            }
            this.fullEventProxy.emit(event, ...args);
        });
        this.socket.onAnyOutgoing((...vals) => {
            console.log("SENDING:", vals);
        })

        this.socket.on("SETUP", (info) => {
            this.yourId = info.yourId;
            Cookies.set("session", info.sessionId, {sameSite: "Strict"});
            this.flowing = true;
            this.queueEmit("place_data_order", "players/" + this.yourId);
            for (const m of this.messageBacklog) {
                this.socket.emit(m[0], ...m[1]);
            }
            this.messageBacklog = [];
            if (this.liveEventProxy.eventNames().length > 0) {
                this.socket.emit("place_data_orders", [...this.liveEventProxy.eventNames()]);
            }

            if (this.closeLoader) {
                this.closeLoader();
                this.closeLoader = null;
            }

        });
    }

    public static connect() {
        if (!Cookies.get("token")) {
            if (this.closeLoader) {
                this.closeLoader();
                this.closeLoader = null;
            }
            return;
        };

        this.socket.connect();
    }

    private static ensureConnection() {

        if (this.socket.connected) {
            if (this.closeLoader) {
                this.closeLoader();
                this.closeLoader = null;
            }
            return;
        };
        this.socket.disconnect();
        this.socket = io();
        this.setup();
    }

    public static placeDataOrder(order: string, callback: (...args) => void) {

        this.liveEventProxy.on(order, callback);
        this.queueEmit("place_data_order", order);

    }

    public static retractDataOrder(order: string, callback?: (...args) => void) {
        this.liveEventProxy.off(order, callback);

        if (!this.liveEventProxy.eventNames().includes(order)) this.queueEmit("retract_data_order", order);

    }

    public static queueEmit(event: string, ...args) {
        if (!this.flowing) {

            this.messageBacklog.push([event, args]);
        } else {
            this.socket.emit(event, ...args);
        }
    }

    public static connectTo(channel: string): Channel {

        if (!this.channels.has(channel)) this.channels.set(channel, new Channel(channel));
        return this.channels.get(channel);

    }
    public static disconnectFrom(channel: string) {
        this.channels.get(channel)?.removeAllListeners()
        this.channels.delete(channel)
    }

}

function deleteUndefined(obj: any) {
    for (const [k, v] of Object.entries(obj)) {
        if (v === null) delete obj[k];
        else if (v && typeof v === "object") {
            obj[k] = deleteUndefined(v);
        }
    }
    return obj;
}
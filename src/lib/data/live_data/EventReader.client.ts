import Backend from "$lib/Backend.client";
import { get, readable, writable, type Readable, type Subscriber } from "svelte/store";
import Essential from "../Essential";
import { debounce, deleteUndefined, mergeDeep } from "$lib/UTILS";

export default class EventReader {

    private static stores: Map<string, { store: Readable<any>, setter: Subscriber<any>, recentValue: any }> = new Map()
    private static readonly ACTIVE_TOPICS: Set<string> = new Set();
    private static abortController = new AbortController()
    private static rateLimitTimeout;
    private static readonly TIMEOUT_LENGTH = 300;
    private static rateLimitPromise = null;
    private static rateLimitResolve = null;
    private static chunkBuffer = "";

    public static hookIn<T>(        
        topic: string | (() => string), 
        initialValue?: T,
        customSetter?: (v: any) => any
    ): Readable<T> {

        // console.log("INIT", topic, initialValue);
        
        const REAL_TOPIC = (typeof topic === "string") ? topic : topic();
        
        if (this.stores.has(REAL_TOPIC)) {
            return this.stores.get(REAL_TOPIC).store
        }
        
        const STORE: Readable<T> = readable<T>(initialValue as T, (set) => {
            const STUFF = this.stores.get(REAL_TOPIC)
            if (!STUFF) return;
            const SET_FUNC = customSetter ? (v)=>set(customSetter(v)) : set;
            STUFF.setter = SET_FUNC;
            SET_FUNC(STUFF.recentValue)
            // console.log("SET INTERNAL", REAL_TOPIC, STUFF.recentValue);
            this.ACTIVE_TOPICS.add(REAL_TOPIC)
            this.resend()
            
            return (() => {

                this.ACTIVE_TOPICS.delete(REAL_TOPIC)
                this.resend()

            }).bind(this)
        })

        this.stores.set(REAL_TOPIC, {
            setter: null,
            store: STORE,
            recentValue: initialValue,
        })

        return STORE;

    }

    public static async hookInAsync<T>(        
        topic: string | (() => string | Promise<string>), 
        initialValue?: T,
        customSetter?: (v: any) => any | Promise<any>
    ): Promise<Readable<T>> {

        const REAL_TOPIC = (typeof topic === "string") ? topic : await Promise.resolve(topic());
        
        if (this.stores.has(REAL_TOPIC)) {
            return this.stores.get(REAL_TOPIC).store
        }
        
        const STORE: Readable<T> = readable<T>(initialValue as T, (set) => {
            const STUFF = this.stores.get(REAL_TOPIC)
            if (!STUFF) return;
            const SET_FUNC = customSetter ? async (v)=>set(await Promise.resolve(customSetter(v))) : set;
            
            STUFF.setter = SET_FUNC;
            SET_FUNC(STUFF.recentValue)
            
            this.ACTIVE_TOPICS.add(REAL_TOPIC)
            this.resend()

            return (() => {

                this.ACTIVE_TOPICS.delete(REAL_TOPIC)
                this.resend()

            }).bind(this)
        })

        this.stores.set(REAL_TOPIC, {
            setter: null,
            store: STORE,
            recentValue: initialValue,
        })

        return STORE;

    }

    public static resend = debounce((async ()=>{
        this.abortController.abort("resending")

        this.abortController = new AbortController()

        const PATH = this.getPath()

        const response = await Backend.rawFetch(PATH, {
            signal: this.abortController.signal,
        });
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        this.loop(reader)
    }).bind(this), 300)

    private static async loop(reader: ReadableStreamDefaultReader) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            let isDone = false;
            let truValue;
            try {
                const { value, done } = await reader.read();
                isDone = done;
                truValue = value;
                console.log(value);
                
            } catch {
                break;
            }
            this.update(truValue)
            if (isDone) break;
        }
    }

    private static update(value: string) {
        let rest = value;
        while (rest !== "") {
            if (rest.includes("\n")) {
                let part = rest.split("\n")[0]
                rest = rest.substring(rest.indexOf("\n")+1);

                if (this.chunkBuffer) {
                    part = this.chunkBuffer + part;
                    this.chunkBuffer = "";
                }

                if (!part.includes(":")) {
                    console.error("NO COLON IN UPDATED VALUE:\n", part);
                    return;
                };

                const TOPIC = part.split(":")[0]
                const VALUE = JSON.parse(part.substring(part.indexOf(":") + 1))
                
                if (!this.stores.has(TOPIC)) return;
                
                const STORE = this.stores.get(TOPIC);
                const CURRENT = get(STORE.store);
                const cstr = JSON.stringify(CURRENT)
                const UPDATED = (typeof CURRENT === "object" && CURRENT !== null) ? deleteUndefined(mergeDeep(CURRENT, VALUE)) : VALUE;
                console.log(TOPIC, "|", VALUE, "|", cstr, "|", UPDATED);
                if (STORE.setter) STORE.setter(UPDATED)
                
                STORE.recentValue = UPDATED;


            } else {
                this.chunkBuffer += rest;
                break;
            }
        }
    }

    private static getPath() {
        let path = "/live-data?topics=";
        for (const T of this.ACTIVE_TOPICS) {
            path += T;
            path += ",";
        }
        return path;
    }

    public static makeInstantStoreForAsyncHook<T = any>(
        topic: string | (() => string | Promise<string>), 
        initialValue?: T,
        customSetter?: (v: any) => any | Promise<any>
    ): Readable<T> {
        return readable<T>(initialValue, (set) => {

            let unsubber;
            let unsubbed = false;

            (async () => {
                const STORE = await EventReader.hookInAsync<T>(topic, initialValue, customSetter);
                
                unsubber = STORE.subscribe(set)
                if (unsubbed) unsubber()
            })()

            return () => {
                unsubbed = true;
                if (unsubber) unsubber();
            }

        });
    }

}
import {writable as lWritable} from "svelte-local-storage-store";
import { readable, writable } from "svelte/store";
import { browser } from '$app/environment';
export type Theme = {
    colorWhite: string,
    colorBlack: string,
    colorText: string,
    colorSubtle: string,
    colorDark: string,
    colorBackground: string,
    pageBackground?: string,
}
export type ThemeList = {
    [name:string]: Theme
}
const THEMES: ThemeList = {
    "default-dark": {
        colorWhite: "#fff",
        colorBlack: "#000",
        colorText: "#C3AEFF",
        colorSubtle: "#39314F",
        colorDark: "#1D1928",
        colorBackground: "#252031",
    },
    "default-light": {
        colorWhite: "#1D1928",
        colorBlack: "#fff",
        colorText: "#39314F",
        colorSubtle: "#C3AEFF",
        colorDark: "#e1d5ff",
        colorBackground: "#ffffff",
    },
    "sky-dark": {
        colorWhite: "#fff",
        colorBlack: "#000",
        colorText: "#0096ff",
        colorSubtle: "#003366",
        colorDark: "#000a22",
        colorBackground: "#000000",
    },
    "sky-light": {
        colorWhite: "#000a22",
        colorBlack: "#fff",
        colorText: "#003366",
        colorSubtle: "#0096ff",
        colorDark: "#E5F6FF",
        colorBackground: "#ffffff",
    },
    "ugly-light": {
        colorWhite: "#000",
        colorBlack: "#fff",
        colorText: "#B0E317",
        colorSubtle: "#E3650B",
        colorDark: "#A317E3",
        colorBackground: "#00D3E6",
    },
    "gray-light": {
        colorWhite: "#1a1a1a",
        colorBlack: "#fff",
        colorText: "#393939",
        colorSubtle: "#DCDCDC",
        colorDark: "#DCDCDC33",
        colorBackground: "#ffffff",
    },
    "gray-dark": {
        colorWhite: "#fff",
        colorBlack: "#000",
        colorText: "#DCDCDC",
        colorSubtle: "#393939",
        colorDark: "#1a1a1a",
        colorBackground: "#2a2a2a",
    },
    "sunlight-light": {
        colorWhite: "#ba8c02",
        colorBlack: "#fff",
        colorText: "#c99c02",
        colorSubtle: "#fcb103",
        colorDark: "#fcdf7c99",
        colorBackground: "#ffffff",
    },
    "midnight-dark": {
        colorWhite: "#fff",
        colorBlack: "#000",
        colorText: "#0EFFEF",
        colorSubtle: "#FF4DFF",
        colorDark: "#185B5D",
        colorBackground: "#000000",
    },
    "pbnj-light": {
        colorWhite: "#fff",
        colorBlack: "#000",
        colorText: "#302845",
        colorSubtle: "#F2ECD5",
        colorDark: "#E2D8B4",
        colorBackground: "#ffffff",
    },
}

// eslint-disable-next-line prefer-const
export let theme = lWritable("displayTheme", "");
export const themeData  = readable(THEMES["default-dark"], (set)=>{
    theme.subscribe((v)=>{
        if (!browser) return;
        if (!v) {
            theme.set((window?.matchMedia("(prefers-color-scheme: light)").matches) ? "default-light" : "default-dark");
            return;
        }
        if (!THEMES[v]) {
            console.error("Tried to set a nonexistent theme.");
            return;
        }
        set(THEMES[v]);
    })
});

/* MISC */
export const history = writable((typeof sessionStorage !== "undefined") ? (JSON.parse((sessionStorage.getItem("history")) ? sessionStorage.getItem("history") : "{\"history\": [\"/dashboard\"]}")).history : ["/dashboard"] as string[]);
if (typeof window !== "undefined") {
    history.subscribe((val)=>{
        sessionStorage.setItem("history", JSON.stringify({history: val}));
    })
}
export const pushHistory = writable(true);
import { readable } from "svelte/store";

type QrCodeChallenge = {
    id: string,
    claimsLeft?: number,
    name: string,
    claimed: boolean,
}

const eL: QrCodeChallenge[] = [
    {
        id: "scannable_1",
        name: "Scannable I",
        claimsLeft: 3,
        claimed: false,
    },
    {
        id: "scannable_2",
        name: "Scannable II",
        claimsLeft: 1,
        claimed: true,
    },
    {
        id: "secret_code",
        name: "Secret Code",
        claimsLeft: -1,
        claimed: false,
    },
]

export const codesRaw = readable(eL as QrCodeChallenge[], ()=>{return});

export const codeList = readable([] as QrCodeChallenge[], (set)=>{
    codesRaw.subscribe(val=>{
        set(val.sort((a,b)=>{
            if (a.claimsLeft === -1) {
                if (b.claimsLeft === -1) return 0;
                return 1;
            }
            if (b.claimsLeft === -1) return -1;
            return a.claimsLeft-b.claimsLeft;
        }))
    })
});
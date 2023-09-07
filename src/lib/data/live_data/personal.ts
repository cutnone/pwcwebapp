import { derived } from "svelte/store";
import { teamsList } from "./users";
import EventReader from "./EventReader.client";
import Essential from "../Essential";

export const yourData = EventReader.makeInstantStoreForAsyncHook<any>(async () => {
    const ID = Essential.yourId ?? (await Essential.setupPromise).yourId;
    return `players/${ID}`;
}, {})

export const yourTeam = derived(yourData, (v) => v?.team, null);

export const yourTeamPlace = derived([teamsList, yourTeam], ([tl, yt])=>{
    const sorted = tl.sort((a, b) => {
        return b.points - a.points;
    });

    for (const I in sorted) {
        const i = parseInt(I);
        if (sorted[i].id === yt) { return i + 1 }
    }
})

export const yourPoints = derived(yourData, (v)=>v?.points ?? 0, 0)
import { derived, readable } from "svelte/store";
import createTimeline, { type RichTimeline, type RichTimelineEvent } from "../CreateTimeline";
import * as LUXON from "luxon";
import EventReader from "./EventReader.client";


export const mainTimelineRaw = EventReader.hookIn(`timelines/main`, {})

export const mainTimeline = createTimeline(mainTimelineRaw);

export const eventList = EventReader.hookIn(`timelines/events`, {}, (v) => {
    return Object.values(v).map((v: any) => {
        return {
            id: v.id,
            name: v.name,
            start: LUXON.DateTime.fromISO(v.start),
            end: (v.end) ? LUXON.DateTime.fromISO(v.end) : undefined,
        }
    })
})

export const eventTimeline = createTimeline(eventList);

export const nextEvent = derived(mainTimeline, (v)=>{
    
    const ARR = Object.values(v);
    for (const e of ARR) {

        const diff = e.start.diffNow();
        if (diff.toMillis() < 0) continue;
        else {
            
            return e;
        }
    }
    
    const GAME_DURATION = ARR.find((val) => {
        return val.name === "Game Duration"
    });
    
    if (GAME_DURATION?.end.diffNow().toMillis() >= 0) {
        
        return GAME_DURATION;
    }
}, null)
import * as USERS from "./live_data/users";
import * as TIMELINES from "./live_data/timelines";
import * as PERSONAL from "./live_data/personal";
import type { Readable } from "svelte/store";
import EventReader from "./live_data/EventReader.client";

/* USERS */
export const teamsList = USERS.teamsList;
export const teamsMap = USERS.teamsMap;
export const getPlayerStore = USERS.getPlayerStore;
export const getTeamStore = USERS.getTeamStore;

/* TIMELINES */
export const eventList = TIMELINES.eventList;
export const eventTimeline = TIMELINES.eventTimeline;
export const mainTimeline = TIMELINES.mainTimeline;
export const nextEvent = TIMELINES.nextEvent;

/* PERSONAL */
export const yourData = PERSONAL.yourData;
export const yourPoints = PERSONAL.yourPoints;
export const yourTeam = PERSONAL.yourTeam;
export const yourTeamPlace = PERSONAL.yourTeamPlace;

export default class LiveData {

    /**
     * If you need a store instantly, use `LiveData.getLiveNow`.
     */
    public static getLive<T = any>(        
        topic: string | (() => string), 
        initialValue?: T,
        customSetter?: (v: any) => any
    ): Readable<T> {
        return EventReader.hookIn<T>(topic, initialValue, customSetter);
    }

    /**
     * Uses two nested stores. Use `LiveData.getLive` if you're concerned with performance.
     */
    public static getLiveWithAsync<T = any>(        
        topic: string | (() => string | Promise<string>), 
        initialValue?: T,
        customSetter?: (v: any) => any | Promise<any>
    ): Readable<T> {
        return EventReader.makeInstantStoreForAsyncHook<T>(topic, initialValue, customSetter);
    }

}

import { readable, type Readable } from "svelte/store";
import EventReader from "./EventReader.client";

type Team = {
    members: number;
    id: number,
    points: number,
    name: string,
}

export const teamsMap = EventReader.hookIn(`teams`, {})

export const teamsList = readable([] as Team[], (set) => {
    teamsMap.subscribe((v) => {
        const SET_TO = [];
        for (const t of Object.values(v)) {
            SET_TO.push(t);
        }
        SET_TO.sort((a, b) => {
            return b.points - a.points;
        })
        
        set(SET_TO);
    })
});

export async function getTeamStore(id: number): Promise<Readable<{ members: number[], leader: number }>> {

    return await EventReader.hookIn(`teams/${id}`)

}

export async function getPlayerStore(id: number): Promise<Readable<any>> {

    return await EventReader.hookIn(`players/${id}`)

}
import { derived, readable, type Subscriber, type Writable } from "svelte/store";
import type { Readable } from "svelte/store";
import * as LUXON from "luxon";

export type TimelineEvent = {
    name: string, 
    start: string,
    end?: string,
    id: string,
};
export type Unit = "days"|"hours"|"minutes"|"seconds"|"milliseconds";
export type RichTimelineEvent = {
    name: string, 
    start: LUXON.DateTime,
    end?: LUXON.DateTime,
    id: string,
    inProgress: boolean,
    timeLeft: {
        unit: Unit,
        amount: number,
    }
}
export type RichTimeline = RichTimelineEvent[];

export default function createTimeline(eventList: Readable<Record<string, TimelineEvent>>|Writable<{[id: number]: TimelineEvent}>): Readable<RichTimeline> {
    let rtl: RichTimeline = [];
    let timeoutId = null;
    let setFunc: Subscriber<RichTimeline>;

    const returnable = derived<Readable<unknown>, RichTimeline>(eventList, (value: Record<string, TimelineEvent>, set)=>{
        clearTimeout(timeoutId);
        const tarr = Object.values(value);
        
        rtl = [];
        for (const e of tarr) {
            rtl.push({
                id: e.id,
                name: e.name,
                start: LUXON.DateTime.fromISO(e.start),
                end: e.end ? LUXON.DateTime.fromISO(e.end) : undefined,
                inProgress: false,
                timeLeft: {
                    amount: 0,
                    unit: "days",
                }
            });
        }
        // const ignore: string[] = [];
        // rtl: for (const [i, re] of rtl.entries()) {
        //     for (const e of value) {
        //         if (e.id === re.id) {
        //             re.name = e.name;
        //             re.start = e.start;
        //             re.end = e.end;
        //             ignore.push(e.id);
        //             continue rtl;
        //         }
                
        //     }
        //     rtl[i] = null;
        // }
        // while (rtl.indexOf(null) !== -1) {
        //     rtl.splice(rtl.indexOf(null), 1);
        // }
        // for (let i = 0; i < value.length; i++) {
        //     const val = value[i];
        //     if (ignore.includes(val.id)) continue;
        //     rtl.push({
        //         id: val.id,
        //         name: val.name,
        //         start: val.start,
        //         end: val.end,
        //         inProgress: false,
        //         timeLeft: {
        //             amount: 0,
        //             unit: "days",
        //         }
        //     });
        // }

        rtl.sort((a, b)=>{return (a.start.diff(b.start)).toMillis();});
        setFunc = set;
        
        calc();
    });

    
    
    function calc() {
        
        for (const e of rtl) {
            
            // unit
            const now = LUXON.DateTime.now().setZone("US/Eastern");
            let diff;
            if (e.start.diffNow().valueOf() < 0 && e.end) {
                diff = e.end.setZone("US/Eastern").diff(now).shiftTo("days", "hours", "minutes", "seconds", "milliseconds");
                e.inProgress = true;
            } else {
                diff = e.start.setZone("US/Eastern").diff(now).shiftTo("days", "hours", "minutes", "seconds", "milliseconds");
                
            }
            let unit;            
            if (diff.days > 0) {
                unit = "day";
            } else if (diff.hours > 0) {
                unit = "hour";
            } else if (diff.minutes > 0) {
                unit = "minute";
            } else {
                unit = "second";
            }
            unit+="s";
            e.timeLeft.unit = unit;
            
            // amount
            e.timeLeft.amount = diff[unit];
        }
        
        setFunc(rtl);
        
        timeoutId = setTimeout(calc, 1000);
    }
    
    
    
    return returnable;
    
}
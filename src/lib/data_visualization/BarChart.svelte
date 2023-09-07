<script lang="ts">
    import {flip} from "svelte/animate";
    export let data: {
        label: string,
        value: number,
        icon?: string,
        url?: string,
        accent?: boolean,
    }[] = [];

    let floor = 0;
    let ceil = 0;
    let rCeil = 0;

    $: {
        const values = data.reduce((prev, current)=>{
            prev.push(current.value);
            return prev;
        }, []);
        floor = Math.min(...values);
        ceil = Math.max(...values);
        floor = Math.max(0, floor-((ceil-floor)/5))
        rCeil = ceil-floor;
    }

	import ChartBar from "./ChartBar.svelte";
	import { expoOut } from "svelte/easing";
	import { goto } from "$app/navigation";

</script>
<div class="main">
    <div class="bars">
        {#each data as entry (entry.label)}
            <div animate:flip={{easing: expoOut, duration: 300}} style:width="{100/data.length}%">
                <ChartBar url={entry.url} accent={entry.accent} width={100} height={((entry.value-floor)/rCeil)*100} value={entry.value}/>
            </div>
        {/each}
    </div>
    <div class="labels">
		{#each data as entry (entry.label)}
            <h2 animate:flip={{easing: expoOut, duration: 300}} style:width="{100/data.length}%"><span>{entry.label}</span></h2>
        {/each}
    </div>
</div>

<style lang="scss">
    .labels {
        justify-content: center;
        > * {
            text-align: center;
            /* display: flex; */
            transform: translateX(-10%);
            /* justify-content: center; */
            white-space: nowrap;
            span {
                text-align: center;
                text-overflow: ellipsis;
                display: block;
                width: 120%;
                overflow: hidden;
            }
		}
        :nth-child(even) span::before {
            content: "|";
            display: block;
            color: var(--color-main-translucent);
            margin-bottom: 0.2rem;
        }
	}
    .bars, .labels {
        display: flex;
    }
    .bars {
        flex-grow: 1;
    }
    .main {
        overflow-x: visible;
        padding: 0 3em;
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0.5rem;
    }

    
</style>
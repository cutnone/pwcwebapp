<script lang="ts">
	import EventEntry from "./EventEntry.svelte";
    import {mainTimeline} from "$lib/data/live_data/timelines";
    import {codeList} from "$lib/data/QrCodeStores";

    let width;
    let title: HTMLHeadingElement;

    $: {
        if (title) {
            title.style.fontSize = width/15+"px";
        }
    }



</script>

<div class="main" style="height: {width}px" bind:offsetWidth={width}>
    <h1 bind:this={title}>Events and Challenges</h1>
    <ul class="feed">
        {#each $mainTimeline as event (event.id)}
            <EventEntry completeMessage="" inProgress={event.inProgress} complete={(event.timeLeft.amount < 0)} quickInfo={
                `${(event.timeLeft.amount >= 0 && !event.inProgress) ? "in" : ""} 
                 ${(event.timeLeft.amount > 0 && event.inProgress) ? "for" : ""} 
                 ${Math.abs(event.timeLeft.amount)} 
                 ${(event.timeLeft.amount > 0 && event.inProgress) ? "more" : ""} 
                 ${(event.timeLeft.amount === 1 || event.timeLeft.amount === -1) ? event.timeLeft.unit.substring(0, event.timeLeft.unit.length-1) : event.timeLeft.unit} 
                 ${(event.timeLeft.amount < 0) ? "ago" : ""}`}
            >{event.name}</EventEntry>
        {/each}
        {#each $codeList as code (code.id)}
            {#if (code.claimsLeft !== 0)}
                <EventEntry completeMessage="Claimed" complete={code.claimed} quickInfo={(code.claimsLeft === -1) ? "no claim cap" : `${code.claimsLeft} ${(code.claimsLeft === 1) ? "claim" : "claims"} left`}>{code.name}</EventEntry>
            {/if}
        {/each}
    </ul>
</div>

<style lang="scss">
    h1 {
        font-size: 2em;
    }
    .feed {
        flex-grow: 1;
        overflow: scroll;
        height: 50%;
        padding-right: 0.7rem;
        padding-left: 0;
        list-style: none;
        &::-webkit-scrollbar-corner {
            background-color: transparent;
        }
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        /* height: 100%; */
        background-color: var(--color-dark);
        border-radius: 2rem;
        padding: 1.5rem;
        /* transition: var(--transition); */
    }
</style>
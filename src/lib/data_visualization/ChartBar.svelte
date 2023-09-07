<script lang="ts">
	import { tweened } from "svelte/motion";
    import {expoOut} from "svelte/easing"
	import { goto } from "$app/navigation";

    export let height: number = 0;
    export let width: number = 0;
    export let value: number = null;
    export let accent: boolean = false;
    export let url: string = null;
    
    const heightTweened = tweened(height, {
        easing: expoOut,
        duration: 300,
    })

    $: {
        heightTweened.set(height);   
    }
</script>

<div style:width={width+"%"} class="main">
    <h2>{value?.toLocaleString() ?? ""}</h2>
    <div style:height={$heightTweened+"%"} class={"bar"+(accent ? " accent" : "")+(url ? " clickable " : "")} on:click={url ? ()=>{goto(url, {replaceState: true})} : undefined}></div>
</div>

<style lang="scss">

    .main {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        flex-grow: 1;
        gap: 0.5rem;
        padding: 0;
    }
    h2 {
        text-align: center;
    }
    .bar {
        border-radius: 0.5em;
        width: 40%;
        background-color: var(--color-main);
    }
    .bar.accent {
        outline: dashed 0.2em var(--color-white);
        outline-offset: -0.4em;
    }
    .clickable {
        cursor: pointer;
        &:hover, &:focus-visible {
            transform: scale(1.03);
        }
        &:active {
            transform: scale(0.98);
        }
    }
</style>
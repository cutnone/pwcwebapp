<script lang="ts">
	import LiveData from "$lib/data/LiveData";
	import { onMount } from "svelte";

    export let playerId: number;

    let PLAYER_STORE;
    
    $: if (playerId) {
        PLAYER_STORE = LiveData.getLive(`players/${playerId}`);
    }
    
    let pfp: HTMLSpanElement;

    $: {
        if (pfp && $PLAYER_STORE?.avatar) {
            pfp.style.backgroundImage = "url('" + $PLAYER_STORE?.avatar + "')";
        }
    }

    onMount(()=>{
        
    })
</script>

<span
    bind:this={pfp}
/>

<style lang="scss">
    span {
        width: 1em;
        height: 1em;
        background-size: cover;
        border-radius: 50%;
        border: 2px solid var(--color-main);
        display: inline-block;
    }
</style>
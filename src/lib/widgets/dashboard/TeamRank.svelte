<script lang="ts">

	import RankCounter from "$lib/data_visualization/RankCounter.svelte";
    import {yourTeamPlace} from "$lib/data/live_data/personal";
    import {goto} from "$app/navigation"
    export let button: HTMLButtonElement;
    let container: HTMLDivElement;
    let cWidth: number;
    $: if (button) {
        button.addEventListener("click", ()=>{
            goto("/rankings", {replaceState: true});
        })
    }
    $: {
        if (container) {
            container.style.fontSize = cWidth/10+"px";
        }
    }


</script>

<div bind:offsetWidth={cWidth} bind:this={container} class="place">
    <h1>
        <span><RankCounter value={$yourTeamPlace}/></span>
    </h1>
    <p>Team Rank</p>
</div>

<style lang="scss">
    .place {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        
        padding-bottom: 1em;
        text-align: center;
        cursor: pointer;
        padding: 1em;
        h1 {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 4.4em;
            flex-grow: 1;
            span {
                display: inline-block;
                height: fit-content;
            }
        }
        p {
            font-weight: bold;
        }
    }
    .place {
        height: 100%;
        /* transition: var(--transition); */
        text-decoration: none;
        border-radius: 2rem;
    }
    
</style>
<script lang="ts">
	import NumberCounter from "$lib/data_visualization/NumberCounter.svelte";
    import {nextEvent} from "$lib/data/live_data/timelines";
    import {showAlert} from "$lib/UTILS";
    export let button: HTMLButtonElement;
    let unit: string = "days";
    let amount: number = 0;
    
    let container: HTMLDivElement;
    let cWidth: number;
    $: if ($nextEvent) {
    
        // unit = $nextEvent.timeLeft.unit;
        amount = $nextEvent.timeLeft.amount;
        unit = $nextEvent.timeLeft.unit;
    }
    $: {
        if (container) {
            container.style.fontSize = cWidth/10+"px";
        }
    }

    $: if (button) {
        button.addEventListener("click", ()=>{
            showAlert("Not implemented yet 😅", "When this is done, clicking this will show a timeline of major game events.", "Dismiss");
        })
    }

</script>

{#if $nextEvent}
    <div bind:offsetWidth={cWidth} bind:this={container} class="place">
        <h1>
            <span><NumberCounter value={amount}/></span>
        </h1>
        <p>{unit.charAt(0).toUpperCase()+unit.substring(1, (amount == 1) ? unit.length-1 : undefined)} until</p>
        <p>{$nextEvent.name}</p>
    </div>

{/if}


<style lang="scss">
    .place {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        
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
            margin-bottom: -0.1em;
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
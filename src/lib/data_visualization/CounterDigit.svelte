<script lang="ts">
	import { onMount } from "svelte";
	import { expoOut, elasticOut } from "svelte/easing";
	import { tweened } from "svelte/motion";


    export let comma: boolean = false;
    export let currentValue = "0";

    let reducedMotion = true;

    let prev = 0;
    export async function update(value, distance: number, sensitivityFactor = 1.5) {
        currentValue = value
        const aDist = Math.abs(distance);
        const aMarg = Math.abs($margin);
        if (Math.abs(aDist-aMarg) > aDist/sensitivityFactor) {
            await margin.set(distance, {
                duration: 0,
            });
            margin.set(0,  {
                duration: (reducedMotion) ? 0 : 300,
            });
        }
    }

    let margin = tweened(0, {
        duration: 300,
        easing: elasticOut,
    })

    onMount(()=>{
        const rm = window.matchMedia("(prefers-reduced-motion)");
        reducedMotion = rm.matches;
        rm.addEventListener("change", (ls)=>{
            reducedMotion = ls.matches;
        });
    }) 
</script>

<p>
    <span style="transform: translateY({$margin}ch); display: inline-block">{currentValue}</span>{#if comma}<span>,</span>{/if}
</p>
<svelte:options accessors={true}/>

<style lang="scss">
    p {
        white-space: nowrap;
    }
</style>
<script lang="ts">
    import { tweened, type Tweened } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';
	import PointDigit from "$lib/data_visualization/CounterDigit.svelte";
	import Icon from '$lib/Icon.svelte';

    export let value: number = 0;
    export let duration: number = 1000;
    export let iconName = "points";
    export let icon = false;

    $: {
        points.set(value ?? 0, {
            duration: duration,
        });
    }

    let digitBox: HTMLParagraphElement;

    const points = tweened((value ?? 0)-1, {
        duration: 1000,
        easing: expoOut,
    });

    export let currentValue = null;
    $: {
        if (Math.round($points) !== currentValue) {
            currentValue = Math.round($points);
            render();
        }
    }
    let dArray: PointDigit[]  = [];
    let pVal = 0;
    async function render() {
        if (!digitBox) return;
        const cString = currentValue.toString();
        const pString = pVal.toString();
        const distance = (pVal > currentValue) ? 0.3 : -0.3;

        while (digitBox.children.length != cString.length) {
            if (digitBox.children.length < cString.length) {
                const digit = new PointDigit({
                    target: digitBox,
                    anchor: digitBox.children[0] ?? undefined,
                    props: {
                        comma: (dArray.length !== 0 && dArray.length%3 == 0)
                    }
                });
                dArray.unshift(digit);
            } else {
                dArray[0].$destroy();
                dArray.shift();
            }
        }

        for (let i = cString.length-1; i >= 0; i--) {
            if (pString[i] === cString[i]) continue;
            dArray[i].update(cString[i], distance);
        }

        pVal = currentValue;

        

    }
    points.set(value);
</script>

<span class="points">
    <p bind:this={digitBox} style="display: flex;"></p>
    {#if icon}
        <div class="icon"><Icon name={iconName}/></div>
    {/if}
</span>
<svelte:options accessors={true}/>

<style lang="scss">
    .points {
        display: inline-flex;
        align-items: center;
        gap: 0.2ch;
    }

    .icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 1ch;
        margin-top: -0.07em;
        height: min-content;
    }
</style>
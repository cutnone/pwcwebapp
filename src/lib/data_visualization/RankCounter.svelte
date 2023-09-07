<script lang="ts">
	import NumberCounter from "./NumberCounter.svelte";
    let unit: HTMLParagraphElement;
    export let value = 0;

    $: {

        if (unit) {
            let last = value.toString();
            if (last.endsWith("11") || last.endsWith("12") || last.endsWith("13")) {
                unit.innerText = "th";
            } else {
                last = last[last.length-1];
                switch (last) {
                    case "1": unit.innerText = "st"; break;
                    case "2": unit.innerText = "nd"; break;
                    case "3": unit.innerText = "rd"; break;
                    default: unit.innerText = "th"; break;
                }
            }
        }
    }
</script>

<span>
    <NumberCounter value={value}></NumberCounter>
    <p bind:this={unit} class="unit"></p>
</span>

<style lang="scss">
    span {
        display: inline-flex;
    }
    .unit {
        font-size: 0.4em;
    }
</style>
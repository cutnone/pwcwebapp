<script lang="ts">
	import { onMount } from "svelte";
	import { get_root_for_style } from "svelte/internal";
    import {themeData} from "$lib/data/UserInfoStores";
    export let name: string = "points";
    export let color: "light"|"dark"|"translucent" = "light";

    let realColor;
    let obj: HTMLObjectElement;

    $: {
        if (obj?.contentDocument) {
            switch (color) {
                case "light": {realColor = $themeData.colorText; break;}
                case "dark": {realColor = $themeData.colorBackground; break;}
                case "translucent": {realColor = $themeData.colorText+"99"; break;}
            }
            for (let c of obj.contentDocument.children) {
                c["style"].fill = realColor;
            }
        }
    }
    
    function setup() {
        obj["style"].fill = "visible";
        obj["style"].visibility = "visible";
    }
    onMount(()=>{
        try {
            setup();
        } catch (error) {
            
        }
    })
</script>

<object tabindex="-1" style:visibility="hidden" on:load={setup} bind:this={obj} title="{name}" data="/icons/fi-br-{name}.svg" type="image/svg+xml" ></object>

<style lang="scss">
    object {
        width: inherit;
        height: 1em;
        pointer-events: none;
    }
</style>
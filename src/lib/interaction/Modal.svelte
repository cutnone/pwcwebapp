<script lang="ts">
    import {wait} from "$lib/UTILS";
	import { createEventDispatcher, onMount } from "svelte";
    let element: HTMLDialogElement;
    let closing = false;

    const dispach = createEventDispatcher();

    export function show() { 
        element.showModal();
        dispach("open");
    }
    export function hide() {
        closing = true;
        element.addEventListener("animationend", ()=>{
            element.close();
            closing = false;
            dispach("close");
        }, {once: true,});
    }
    onMount(()=>{
        element.addEventListener("close", (e)=>{
            dispach("close");
        })
    })
</script>

<dialog class="{(closing) ? "closing" : ""}" bind:this={element}>
    <slot></slot>
</dialog>
<svelte:options accessors={true}/>

<style lang="scss">
    dialog {
        margin: auto;
        background-color: var(--color-background);
        border-radius: 1em;
        padding: 2em;
        box-shadow: 0 0 0 100vmax #000000aa;
        max-width: 75ch;
        &[open] {
            animation: open 0.3s cubic-bezier(0, 0.5, 0, 1) forwards;
        }
        &:not([open]):not(.closing) {
            display: none;
        }
        &.closing {
            animation: close 0.1s var(--anim-ease-alt) forwards;
            
        }
    }
    
    @keyframes open {
        0% {
            box-shadow: 0 0 0 0 #000000aa;
            opacity: 0;
            transform: scale(0.5);
            display: block;
        }
        100% {
            opacity: 1;
            display: block;
        }
    }
    @keyframes close {
        0% {
            opacity: 1;
            display: block;
        }
        100% {
            opacity: 0;
            transform: scale(0.7);
            display: block;
        }
    }
</style>
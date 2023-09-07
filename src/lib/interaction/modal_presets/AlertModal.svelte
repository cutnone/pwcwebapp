<script lang="ts">
	import { element } from "svelte/internal";
import Modal from "../Modal.svelte";
export let message = "No Content...";
export let title = "Alert";
export let buttonText = "Close";
let button: HTMLButtonElement;
let modal: Modal;
export const show = ()=>{
    modal.show()
};
export const hide = ()=>{modal.hide()};

</script>

<Modal bind:this={modal} on:close on:open={()=>{setTimeout(()=>{button.blur()}, 0)}}>
    <h1>{title}</h1>
    <p>{message}</p>
    <button on:click={modal.hide} bind:this={button}>{buttonText}</button>
</Modal>
<svelte:options accessors={true}/>

<style lang="scss">
    p, h1 {
        margin-bottom: 1rem;
    }
</style>
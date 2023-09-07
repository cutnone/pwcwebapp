<script lang="ts">
import Modal from "../Modal.svelte";
export let message = "";
export let title = "Enter Text:";
export let placeholder = "";
export let submitButtonText = "Submit";
export let closeButtonText;
export let value = "";
let submitButton: HTMLButtonElement;
let modal: Modal;

export const show = ()=>{
    modal.show()
};
export const hide = ()=>{modal.hide()};

</script>

<Modal bind:this={modal} on:close on:open={()=>{setTimeout(()=>{submitButton.blur()}, 0)}}>
    <h1>{title}</h1>
    <p>{message}</p>
    <form class="text-field" on:submit|preventDefault={modal.hide}>
        <input type="text" placeholder={placeholder} bind:value={value} />
    </form>
    <div class="buttons">
        {#if (closeButtonText)}
            <button class="outline" on:click={()=>{value = null; modal.hide()}} bind:this={submitButton}>{closeButtonText}</button>
        {/if}
        <button on:click={modal.hide} bind:this={submitButton}>{submitButtonText}</button>
    </div>
</Modal>
<svelte:options accessors={true}/>

<style lang="scss">
    p, h1 {
        margin-bottom: 1rem;
    }

    .buttons {
        display: flex;
        justify-content: center;
        gap: 1em;
    }

    .text-field {
        display: flex;
        justify-content: stretch;
        > * {
            flex-grow: 1;
        }
        margin-bottom: 1em;
    }
</style>
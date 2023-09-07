<script lang="ts">
import Modal from "../Modal.svelte";
export let message = "No Content...";
export let title = "Alert";
export let yesButtonText = "Yes";
export let noButtonText = "No";
export let choice: boolean = null;
let button: HTMLButtonElement;
let modal: Modal;
export const show = ()=>{
    modal.show()
};
export const hide = (selection)=>{
    choice = selection;
    modal.hide()
};

</script>

<Modal bind:this={modal} on:close on:open={()=>{setTimeout(()=>{button.blur()}, 0)}}>
    <h1>{title}</h1>
    <p>{message}</p>
    <div class="buttons">
        <button class="outline" on:click={()=>hide(false)} bind:this={button}>{noButtonText}</button>
        <button on:click={()=>hide(true)} bind:this={button}>{yesButtonText}</button>

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
</style>
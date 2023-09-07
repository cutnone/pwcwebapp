<script lang="ts">
	import { onMount } from "svelte";
    import { showAlert } from "$lib/UTILS";
	import { goto } from "$app/navigation";
    import {yourData} from "$lib/data/LiveData";
	import BackendClient from "$lib/Backend.client";
    let name = "";
    let lunch="";
    let submitButton: HTMLButtonElement;
    let initted = false;

    let ALunchBtn: HTMLInputElement;
    let BLunchBtn: HTMLInputElement;
    let CLunchBtn: HTMLInputElement;

    onMount(async ()=>{
        initted = false;
        const RES = (await BackendClient.get("/players/my-lunch")).payload;
        switch (RES) {
            case "A": {
                ALunchBtn.checked = true;
                break;
            }
            case "B": {
                BLunchBtn.checked = true;
                break;
            }
            case "C": {
                CLunchBtn.checked = true;
                break;
            }
        }
        lunch = RES ?? "";
    })
    
    async function input(){
        submitButton.disabled = true;
        const RES = await BackendClient.get("/players/name-lunch")
        if (RES.ok) {
            goto("/pregame");
        } else {
            showAlert("Oops", "Something went wrong.");
            submitButton.disabled = false;
        }


    }

    $: {
        if (submitButton) {
            if (lunch && name) submitButton.disabled = false;
            else submitButton.disabled = true;
            
        }
    }

    $: { 
        if (!initted && $yourData.preferredName) {
            name = $yourData.preferredName;

            initted = true;
        }
    }

</script>
<main>
    <header>
        <h1>Welcome!</h1>
        <h3>Let's set some stuff up.</h3>
    </header>

    <div class='info-box'>
        <h2>Your lunch:</h2>
        <div class='lunch-selector'>
            <span class='lunch-option'>
                <input type="radio" name="lunch" bind:this={ALunchBtn} on:change={function(){lunch="A"}}>
                <span>A</span>
            </span>
            <span  class='lunch-option'>
                <input type="radio" name="lunch" bind:this={BLunchBtn} on:change={function(){lunch="B"}}>
                <span>B</span>
            </span>
            <span  class='lunch-option'>
                <input type="radio" name="lunch" bind:this={CLunchBtn} on:change={function(){lunch="C"}}>
                <span>C</span>
            </span>
        </div>
    </div>
    <div class='info-box'>
        <h2>Preferred first name:</h2>
        <p>(This is your real name - not a username.)</p>
        <input type="text" bind:value={name} placeholder="enter name..."/>
    </div>
    <div class='ready'>
        <button disabled={true} bind:this={submitButton} on:click={input}>I'm Ready</button>
    </div>
</main>
<style lang="scss">
    main{
        font-size: 1rem;
        text-align:center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding:0 .4rem;
        height: var(--viewport-height);
    }
    header{
        margin:1.5em 0;

    }

    .info-box {
		width: min(24em, 100%);
		background: var(--color-dark);
		padding: 1em;
		border-radius: 1em;
		display: flex;
		flex-direction: column;
        margin:.2rem;
        gap: 1em;
		h2{
			color: var(--color-white);
			margin: 0;
		}
		max-height: 20em;
		overflow: hidden;
	}
    .lunch-option{
        display: inline-block;
        width:3em;
        height:3em;
        // font-size: 1.5em;
        input{
            display: flex;
            transform: scale();
            height:100%;
            width:100%;
            cursor: pointer;
            opacity: 0;
            &:checked+span{
                background-color: var(--color-main);
                color:var(--color-white);
                border-color: var(--color-white);
            }
        }
        span{
            display: flex;
            justify-content: center;
            position: relative;
            top:-100%;
            width:100%;
            height: 100%;
            pointer-events: none;
            background-color: var(--color-dark);
            align-items: center;
            border:1.25px solid var(--color-main);
            border-radius:3000em;
            font-weight: bold;
            font-size:1.25em;
            color:var(--color-main);
        }
    }
    .lunch-selector{
        display: flex;
        justify-content: center;
        gap: 1em;
        height:2em;
        margin-bottom: 1.5em;
    }
    .ready{
        flex-grow: 1;
        display: flex;
        flex-direction: column-reverse;
        margin-bottom:2.5em;
    }
</style>
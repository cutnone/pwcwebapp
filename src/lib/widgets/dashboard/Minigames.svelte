<script lang="ts">
    export let button: HTMLButtonElement;
    $: if (button) {
        button.addEventListener("click", ()=>{
            goto("/minigames", {replaceState: true});
        })
    }
    import {goto} from "$app/navigation"
    let container: HTMLDivElement;
    let cWidth: number;
    $: {
        if (container) {
            container.style.fontSize = cWidth/10+"px";
        }
    }
</script>



<div bind:offsetWidth={cWidth} bind:this={container} class="mgames">
    <div class="word">
        <h1 class="back3" style:transform="scale(2.3) translateY(-2.4em)">Minigames Minigames</h1>
        <h1 class="back2" style:transform="scale(1.7) translateY(-1.9em)">Minigames Minigames Minigames</h1>
        <h1 class="back1" style:transform="scale(1.3) translateY(-1.2em)">Minigames Minigames</h1>
        <h1 class="center">Minigames</h1>
        <h1 class="back1" style:transform="scale(1.3) translateY(0.8em)">Minigames Minigames</h1>
        <h1 class="back2" style:transform="scale(1.7) translateY(1.3em)">Minigames Minigames Minigames</h1>
        <h1 class="back3" style:transform="scale(2.3) translateY(1.55em)">Minigames Minigames</h1>
    </div>
</div>


<style lang="scss">
    .mgames {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 1em;
        text-align: center;
        cursor: pointer;
        padding: 1em;
        .word {
            height: max-content;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transform: translateY(-1.1em);
            transform-origin: center;
            white-space: nowrap;
        }
        .back1 {
            opacity: 0.5;
        }
        .back2 {
            opacity: 0.25;
        }
        .back3 {
            opacity: 0.125;
        }
        .center {
            z-index: 1;
            text-shadow: 0 0 0.3em var(--color-dark);
        }
        h1 {
            height: 0;
            font-size: 1.8em;
            flex-grow: 1;
        }
    }
    .mgames, .wrap {
        height: 100%;
        /* transition: var(--transition); */
        text-decoration: none;
        border-radius: 2rem;
    }
    .wrap {
        background-color: var(--color-dark);
        border: none;
        width: 100%;
        display: block;
        &:hover, &:focus-visible {
            background-color: var(--color-subtle);
            transform: scale(1.05);
            .place {
                transform: scale(0.9);
            }
        }
        &:active {
            background-color: var(--color-subtle);
            transform: scale(1.1);
            .place {
                transform: scale(0.8);
            }
        }
    }
</style>
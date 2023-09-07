<script lang="ts">
    import {goto} from "$app/navigation"
    export let button: HTMLButtonElement;
    $: if (button) {
        button.addEventListener("click", ()=>{
            goto("/shop", {replaceState: true});
        })
    }
    let container: HTMLDivElement;
    let cWidth: number;
    $: {
        if (container) {
            container.style.fontSize = cWidth/10+"px";
        }
    }

    
</script>

<div bind:offsetWidth={cWidth} bind:this={container} class="shop-btn">
    <h1 class='store' style:transform="scale(3.1) translateY(.1em)">shop</h1>
    <h1 class='store' style:transform="scale(3.1) translateY(.4em)">shop</h1>
    <h1 class='word'>Shop</h1>
    <h1 class='store' style:transform="scale(3.1) translateY(.7em)">shop</h1>
</div>

<style lang="scss">
    .shop-btn{
        display: flex;
        flex-direction: column;
        text-align: center;
        position: relative;
        cursor: pointer;
        .store{
            opacity: .25;
        }
        .word{
            position: absolute;
            z-index: 1;
            text-shadow: 0 0 0.3em var(--color-dark);
            margin:1.3em 0em 0em .5em;
            font-size:2.7em;
        }
    }
</style>
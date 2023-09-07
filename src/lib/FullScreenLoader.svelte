<script lang="ts">
    export let heading = "Loading...";
    export let description = "";

    let elem: HTMLDivElement;

    export const close = async () => {
        return new Promise<void>((res, rej)=>{
            const ANIM = elem.animate([
                {},
                {opacity: 0}
            ], {
                duration: 500,
                fill: "forwards",
            });
            ANIM.onfinish = ()=>{res()};

        });
    }
</script>

<div bind:this={elem}>
    <h1>{heading}</h1>
    <p>{description}</p>
    <slot></slot>
</div>
<svelte:options accessors={true}/>

<style lang="scss">

    div {
        width: 100vw;
        height: 100vh;
        z-index: 2;
        background: var(--color-background-translucent);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fade-in 0.3s forwards;
    }
    p {
        max-width: 75ch;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

</style>
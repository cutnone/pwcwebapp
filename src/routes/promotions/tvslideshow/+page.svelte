<script lang="ts">
    import { wait } from "$lib/UTILS";
	import { onMount } from "svelte";
	import { expoOut, expoIn, backIn } from 'svelte/easing';
	import PointCounter from "$lib/data_visualization/NumberCounter.svelte";
    import { fade, fly, scale } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    let pointCounter: PointCounter;
    let interactionsContainer: HTMLDivElement;
    let canContinue = false;
    let showContinue = false;
    let stepIndex = -1;
    let currentStep = [];

    const baseDelay = 500;
    const multiplier = 700;
    const animDuration = 1000;

    async function donePresenting() {
        await wait(currentStep.length*multiplier+baseDelay+(animDuration/3.5));
    }
    
    let steps = [
        ["These are your points."],
        ["Well, they would be...", "...if you had any."],
        ["Tap this:"],
        ["That’s still not a lot,", "but that’s okay for now."],
        ["You and your team have one goal:","Collect more points than anyone else."],
        ["Get your team together now,", "so you don't miss a moment."],
        ["The event starts in [unknown] days."]
    ]

    async function standardStepEvent() {
        await wait(10);
        await donePresenting();
        canContinue = true;
        showContinue = true;
    }

    const stepEvents = [
        standardStepEvent,
        standardStepEvent,
        async ()=>{
            await wait(currentStep.length*multiplier);
            const btn = document.createElement("button");
            interactionsContainer.appendChild(btn);
            btn.innerHTML = "+10";
            btn.style.transform = "scale(0)";
            btn.style.opacity = "0"
            void(btn.offsetWidth);
            btn.style.transform = "";
            btn.style.opacity = ""
            btn.addEventListener("click", async ()=>{
                btn.style.transitionTimingFunction = "cubic-bezier(0.5, -0.3, 0.75, 0)"
                btn.style.transitionProperty = "all";
                btn.style.transform = "scale(0)";
                btn.style.opacity = "0";
                await wait(200);
                pointCounter.value = 10, 1000;
                await wait(pointCounter.duration);
                btn.remove();
                next();
            })
        },
        standardStepEvent,
        standardStepEvent,
        standardStepEvent,
        async ()=>{
            await wait(currentStep.length*multiplier);
            const text = document.createElement("h1");
            text.innerHTML = "(there would be a sign in with google button here but there isn't yet)";
            text.style.fontSize = "0.5em";
            interactionsContainer.insertAdjacentElement("beforeend", text);
        },
    ]

    

    $: {
        if (stepIndex >= 0) {
            currentStep = steps[stepIndex];
        }
    }

    

    
    onMount(async()=>{
        await wait(1200);
        next();
    });

    function next() {
        stepIndex++;
        canContinue = false;
        showContinue = false;
        if (stepEvents[stepIndex]) stepEvents[stepIndex]();
    }

    function click() {
        if (canContinue) {
            next();
        }
    }

   
    

</script>

<main on:click={click} on:keypress={click}>
    <h1 class="point-counter">
        <PointCounter icon={true} value={0} bind:this={pointCounter}/>
    </h1>
    <div bind:this={interactionsContainer} class="bits">
        <div class="lines">
            {#each currentStep as step, index (step)}
                <h1 in:fly={{y: 25, duration: animDuration, delay: index*multiplier+baseDelay, easing: expoOut}} out:fly={{y: -25, delay: index*100, easing: expoIn}} animate:flip>{step}</h1>
            {/each}
        </div>
    </div>
</main>
{#if showContinue}
    <h3 on:click={click} on:keypress={click} in:fade out:scale={{easing: backIn, opacity:0}} class="continue-prompt">Tap to continue</h3>
{/if}

<svelte:head>
    <title>What's This?</title>
</svelte:head>

<style lang="scss">

    .point-counter {
        font-size: min(30vw, 200px);
    }

    main {
        margin: 20px;
        width: calc(100vw - 40px);
        height: calc(100vh - 40px);
        justify-content: center;
    }

    * {
        user-select: none;
    }

    main, main > *, main .lines {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: visible;
    }

    main > h1 {
        justify-content: flex-end;
        height: 50%;
        animation: points-in 1s 1s backwards;
    }

    main > div {
        height: 50%;
    }

    h1 {
        font-size: max(0.7em, 4vw);
        text-align: center;
    }

    @keyframes points-in {
        0% {
            opacity: 0;
            transform: scale(0.7);
        }
    }

    .continue-prompt {
        position: fixed;
        width: 100vw;
        bottom: 0;
        margin-bottom: 3em;
        text-align: center;
    }

    .bits {
        gap: 0.7em;
        font-size: min(2em, 7vw);
    }

</style>
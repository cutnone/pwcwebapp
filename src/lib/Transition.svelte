<script lang="ts">
    import { fade } from "svelte/transition";
    import {afterNavigate, beforeNavigate, goto} from "$app/navigation";
    import {onMount} from "svelte"
    import {wait} from "$lib/UTILS";
    import {expoOut} from "svelte/easing";
    import {history, pushHistory} from "$lib/data/UserInfoStores";

    let transition_state: number = 0; // 0 - waiting, 1 - transitioning, 2 - ready to navigate.
    let visible: boolean = false;

    const TRANSITION_DURATION = 400;

    beforeNavigate(async (e)=>{
        if (e.type === "unload") return;
        
        if (transition_state == 2) return;
        visible = false;
        transition_state = 1;
        e.cancel();
        await wait(TRANSITION_DURATION+100);

        transition_state = 2;
        if (e.to) goto(e.to.url, {replaceState: true});
        else goto(e.from.url, {replaceState: true});
        transition_state = 0;
    });

    afterNavigate(async (e)=>{
        if (e.from?.url) {
            if (!$pushHistory) {
                $history.pop();
            }
            else {
                if (e.to?.url.toString().endsWith("/dashboard")) $history.length = 0;
                $history.push(e.from.url.toString());
            }
            history.set($history);
            pushHistory.set(true);
        };
        visible = true;
    });

    onMount(()=>{
        visible = true;
    })

</script>

{#if visible}
    <div
        in:fade={{duration: TRANSITION_DURATION}}
        out:fade={{duration: TRANSITION_DURATION, easing: expoOut}}
    >
        <slot></slot>
    </div>
{/if}

<style lang="scss">
    div {
        /* animation: in 2s forwards cubic-bezier(0.5, 0, 0.7, 1); */
        position: absolute;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        /* backdrop-filter: blur(10px);
        pointer-events: none; */
    }

    /* @keyframes in {
        100% {
            background-color: #00000000;
            backdrop-filter: blur(0);
        }
    } */
</style>
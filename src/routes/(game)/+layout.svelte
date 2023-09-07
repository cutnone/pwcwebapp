<script lang="ts">
    import { history, pushHistory} from "$lib/data/UserInfoStores";
    import {yourPoints} from "$lib/data/LiveData"
	import Icon from "$lib/Icon.svelte";
	import NumberCounter from "$lib/data_visualization/NumberCounter.svelte";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    

</script>


    <nav>
        <span class="relative-nav">
            {#if (!$history[$history.length-1].endsWith("/dashboard"))}
                <button tabindex="0" class="back-button" on:click={()=>{
                        pushHistory.set(false); goto($history[$history.length-1], {replaceState: true});
                    }}>
                    <span>
                        <Icon name="angle-left"/>
                    </span>
                </button>
            {/if}
            <a class="home-button" href="/dashboard">
                <span>
                    <Icon name="home"/>
                </span>
            </a>
        </span>
        <span class="points">
            <NumberCounter value={$yourPoints} icon={true}/>
        </span>
    </nav>
    <main>
            <slot></slot>
    </main>
<style lang="scss">

    nav {
        position: fixed;
        top: 0;
        width: calc(100vw - 8px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1;
        background: linear-gradient(to bottom, var(--color-background), var(--color-background-translucent) 75%, var(--color-background-transparent));
        padding: 1rem;
        .relative-nav {
            display: inline-flex;
            gap: min(2em, 7vw);
        }
        .home-button, .back-button {
            font-size: 1.5em;
            cursor: pointer;
            border: none;
            background: none;
            height: 3ch;
            vertical-align: middle;
            > span {
                align-items: center;
                display: flex;
                height: 100%;
            }
            &:hover, &:focus-visible {
                > span {
                    transform: scale(1.1);
                }
            }
            
            &:focus-visible {
                outline: none;
                > span {
                    filter: var(--accessibility-glow);
                }
            }
        }
        .back-button {
            padding: 0;
            &:active {
                > span {
                    transform: translateX(-5px) scale(0.9);
                }
            }
        }
        .home-button {
            &:active {
                > span {
                    transform: scale(0.9);
                }
            }
        }
        .points {
            font-size: 1.6em;
            font-weight: bold;
        }
    }

    main {
        height: 100%;
        height: var(--viewport-height);
        // height: -webkit-fill-available;
        // height: fill-available;
        // height: stretch;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0 1rem 3rem 1rem;
        padding-top: calc(3.5ch + 2.5rem);
    }

</style>
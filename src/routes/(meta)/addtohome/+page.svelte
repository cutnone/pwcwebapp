<script lang="ts">
	import { goto } from "$app/navigation";
	import { showAreYouSure } from "$lib/UTILS";

    const UA = navigator.userAgent;
    let platform = "";
    if (/\b(iPad|iPhone|iPod)\b/.test(UA)) platform = "iOS";
    if (/Android.*Chrome|Chrome.*Android/.test(UA)) platform = "Android";

    let androidInst: HTMLElement;

    $: if (androidInst && (platform === "Android")) {
        setTimeout(()=>{
            androidInst.scrollIntoView();
        }, 1000);
        
    }
</script>

<main>
    <header>
        <h1>Add Collections to your Home Screen</h1>
        <h2>It's super easy.</h2>
        <br/>
        <a href="#" on:click|preventDefault={()=>{androidInst.scrollIntoView();}}>See Android Instructions</a>
    </header>
    <section class="instructions">
        <section class="ios">
            <h1>iOS (on Safari)</h1>
            <ol>
                <li>
                    Tap the share button at the bottom of the screen:
                    <img src="/images/addToHsHelp/ios/1.png" alt="Tap the middle button. It looks like a box with an arrow pointing up.">
                </li>
                <li>
                    Scroll down, then press "Add to Home Screen":
                    <img src="/images/addToHsHelp/ios/2.png" alt="Tap the 'Add to Home Screen' button. It has an icon that looks like a plus sign in a box.">
                </li>
                <li>
                    Rename it if you want, then press 'Add':
                    <img src="/images/addToHsHelp/ios/3.png" alt="Tap the 'Add' button in the top right.">
                </li>
                <li>
                    If you don't see it on your home screen, check your app library.
                </li>
            </ol>
            <button class="outline" on:click={async ()=>{if (await showAreYouSure("All Set?", "Click \"Yup\" to return to the dashboard.", "Yup", "Nevermind"))goto("/dashboard", {replaceState: true})}}>Done</button>
        </section>
        <section class="android" bind:this={androidInst}>
            <h1>Android (on Google Chrome)</h1>
            <ol>
                <li>
                    Tap the 3-dot icon at the top-right of the screen:
                    <img src="/images/addToHsHelp/android/1.jpg" alt="Tap the icon that looks like 3 dots stacked on top of each other.">
                </li>
                <li>
                    Scroll down, then press "Install app":
                    <img src="/images/addToHsHelp/android/2.jpg" alt="Tap the 'Install app' button. It has an icon that looks like a phone with an arrow pointing into it.">
                </li>
                <li>
                    Tap 'Install':
                    <img src="/images/addToHsHelp/android/3.jpg" alt="Tap the 'Install' button in the bottom right of the popup.">
                </li>
                <li>
                    If you don't see it on your home screen, check your app drawer.
                </li>
            </ol>
            <button class="outline" on:click={async ()=>{if (await showAreYouSure("All Set?", "Click \"Yup\" to return to the dashboard.", "Yup", "Nevermind"))goto("/dashboard", {replaceState: true})}}>Done</button>
        </section>
    </section>

    


</main>

<svelte:head>
    <title>Add to Home Screen | PWC</title>
</svelte:head>


<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        height: 100%;
        height: var(--viewport-height);
        overflow-y: scroll;
        overflow-x: hidden;
        header {
            text-align: center;
        }
    }
    section, ol {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 0;
    }

    li {
        align-self: stretch;
        &::marker {
            font-weight: bold;
            font-size: 1.5em;
        }
    }
    
    .ios, .android {
        gap: 1em;
        width: 100%;
    }
    
    ol {
        padding: 0;
        width: 100%;
    }

    .instructions {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: min(45ch, 100%);
        h1 {
            font-size: 1.5em;
        }
    }

    h1 {
        color: var(--color-white);
    }
    
    .ios {
        border-bottom: solid 1px var(--color-main-translucent);
    }

    img {
        border: 2px solid var(--color-main-translucent);
        border-radius: 1rem;
        display: block;
        width: min(20em, 100%);
        margin: 1em auto;
    }
</style>
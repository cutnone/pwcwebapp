<script lang="ts">
    import Transition from "$lib/Transition.svelte";
	import { onMount } from "svelte";
    import {themeData} from "$lib/data/UserInfoStores";
	import { goto } from "$app/navigation";
    import "$lib/global_styles/styles.scss";
    const updateViewportHeight = () => {
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    };

    onMount(()=>{
        window.addEventListener('resize', updateViewportHeight);
        setInterval(updateViewportHeight, 500);
        themeData.subscribe((THEME)=>{
            (document.querySelector("meta[name=\"theme-color\"]") as HTMLMetaElement).content = THEME.colorBackground;
            const rootStyle = (document.querySelector(":root") as HTMLElement).style;
            rootStyle.setProperty("--color-white", THEME.colorWhite);
            rootStyle.setProperty("--color-black", THEME.colorBlack);
            rootStyle.setProperty("--color-main", THEME.colorText);
            rootStyle.setProperty("--color-main-translucent", THEME.colorText+"99");
            rootStyle.setProperty("--color-main-more-translucent", THEME.colorText+"55");
            rootStyle.setProperty("--color-main-even-more-translucent", THEME.colorText+"22");
            rootStyle.setProperty("--color-subtle", THEME.colorSubtle);
            rootStyle.setProperty("--color-dark", THEME.colorDark);
            rootStyle.setProperty("--color-background", THEME.colorBackground);
            rootStyle.setProperty("--color-background-translucent", THEME.colorBackground+"99");
            rootStyle.setProperty("--color-background-transparent", THEME.colorBackground+"00");
            if (THEME.pageBackground) rootStyle.setProperty("--page-background", THEME.pageBackground);
        })
        updateViewportHeight();
    });

</script>


<Transition>
    <slot></slot>
</Transition>
<svelte:head>
    <title>PW Collections</title>
</svelte:head>
<style lang="scss">

    :global(body) {
        background: var(--page-background);
        > * {
            overflow: auto;
        }
    }

</style>
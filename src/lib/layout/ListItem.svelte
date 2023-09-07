<script lang="ts">
    import {goto} from "$app/navigation";
    export let complete: boolean = false;
    export let completeMessage: string = "Complete";
    export let accent: boolean = false;
    export let href: string = null;

    function doLink() {
        if (href) {
            goto(href, {replaceState: true});
        }
    }

</script>

<li on:click={doLink} on:keypress={doLink} class="main {complete ? "complete" : ""} {accent ? "accent" : ""} {(href) ? "clickable" : ""}">
    {#if complete}
        <div class="complete-message">{completeMessage}</div>
    {/if}
    <div class="content">
        <span class="title">
                <slot name="left"></slot>
        </span>
        <span class="quick-info"><slot name="right"></slot></span>
    </div>
</li>

<style lang="scss">
    .main {
        display: flex;
        flex-direction: column;
        padding: 0.5em;
        border-top: 1px solid var(--color-main-translucent);
        &.clickable {
            cursor: pointer;
        }
        &.clickable:hover {
            filter: brightness(2);
        }
        &.clickable:active {
            filter: none;
        }
    }
    .complete {
        .title {
            text-decoration: line-through;
        }
    }
    .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 1em;
    }
    .quick-info {
        
        text-align: right;
        white-space: nowrap;
        height: min-content;
    }
    .title {
        display: inline-block;
        min-width: 0;
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .quick-info, .complete .title, .complete-message {
        color: var(--color-main-translucent);
    }
    .accent .content {
        filter: drop-shadow(0px 0px 5px var(--color-main-translucent));
    }
</style>
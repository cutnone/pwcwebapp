<script lang="ts">
    export let rowspan = 1;
    export let colspan = rowspan;
    export let first: boolean = false;
    export let clickable: boolean = false;
    let button: HTMLButtonElement;
</script>

<button
    bind:this={button}
    style="grid-row-end: span {rowspan}; grid-column-end: span {colspan};"
    class="clear-style outer {first ? "first": ""} {clickable ? "clickable": ""}"
>
    <div class="inner">
        <slot button={button}></slot>
    </div>
</button>

<style lang="scss">

    .outer {
        overflow: hidden;
        background-color: var(--color-dark);
        border-radius: 2rem;
        border: none;
    }
    .inner {
        height: 100%;
    }

    .first {
        grid-row-start: 1;
        grid-column-start: 1;
    }

    .clickable {
        transform: scale(1);
        transform: scale(1);
        &:hover, &:focus-visible {
            background-color: var(--color-subtle);
            transform: scale(1.05);
            .inner {
                transform: scale(0.9);
            }
        }
        &:focus-visible {
            outline: solid 1px var(--color-white);
        }
        &:active {
            background-color: var(--color-subtle);
            transform: scale(1.1);
            .inner {
                transform: scale(0.8);
            }
        }
    }
    .outer:disabled {
        pointer-events: none;
    }
</style>
<script lang="ts">
    export let complete: boolean = false;
    export let completeMessage: string = "Complete";
    export let inProgress: boolean = false;
    export let inProgressMessage: string = "In Progress";
    export let quickInfo: string = ""

</script>

<li class="main {complete ? "complete" : ""}">
    {#if (complete || inProgress)}
        <div class="complete-message">{(complete) ? completeMessage : inProgressMessage}</div>
    {/if}
    <div class="content">
        <span class="title">
                <slot></slot>
        </span>
        <span class="quick-info">{quickInfo}</span>
    </div>
</li>

<style lang="scss">
    .main {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        border-top: 1px solid var(--color-main-translucent);
    }
    .complete {
        text-align: left;
        .title {
            text-decoration: line-through;
        }
    }
    .content {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 1em;
    }
    .quick-info {
        
        text-align: right; 
        height: min-content;
        width: 40%;
    }
    .title {
        display: inline-block;
        text-align: left;
    }
    .complete .title, .complete-message {
        text-align: left;

    }
    .quick-info, .complete .title, .complete-message {
        color: var(--color-main-translucent);
    }
</style>
<script lang="ts">
	import { teamsMap } from '$lib/data/LiveData';
	import { goto } from "$app/navigation";
	import NumberCounter from "$lib/data_visualization/NumberCounter.svelte";
	import Icon from "$lib/Icon.svelte";

    export let id: number;
</script>
<span
    on:keypress
    on:click={() => {
        goto("/teams/"+id, {replaceState: true});
    }}
    class="team"
>
    <span class="icon">
        <Icon name="bookmark" />
    </span>
    <div class="info">
        <h2>{$teamsMap[id]?.name || "No Team"}</h2>
        {#if ($teamsMap[id]?.points !== undefined)}
            <NumberCounter value={$teamsMap[id]?.points} icon={true} />
        {/if}
    </div>
</span>

<style lang="scss">
    .team {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: .7em;
        font-weight: bold;
        vertical-align: middle;
        min-width: 0ch;
        max-width: max-content;
        flex-grow: 1;
		&:hover,
		&:focus-visible {
            transform: scale(1.05);
		}
		&:focus-visible {
            filter: var(--accessibility-glow);
			outline: none;
		}
		&:active {
            transform: scale(0.95);
		}
		.icon {
            font-size: 1.5em;
            display: inline-flex;
            align-items: center;
		}
        h2 {
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .info {
            min-width: 0;
            max-width: max-content;
            flex-grow: 1;
        }
    }
</style>
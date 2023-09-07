<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import NumberCounter from "$lib/data_visualization/NumberCounter.svelte";
    import LiveData, {getPlayerStore} from "$lib/data/LiveData";
	import TeamQuickInfo from "$lib/widgets/teams/TeamQuickInfo.svelte";
	import ProfilePicture from "$lib/widgets/players/ProfilePicture.svelte";
	import LineChart from "$lib/data_visualization/LineChart.svelte";
    const ID = parseInt($page.params.id);
    if (ID !== ID /* check for NaN */) {
        goto("/teams", {replaceState: true});
    }
    
    const PLAYER_STORE = LiveData.getLive(`players/${ID}`);

</script>

<svelte:head>
    <title>{$PLAYER_STORE?.preferredName} {$PLAYER_STORE?.familyName} | PWC</title>
</svelte:head>
<header>
    {#if $PLAYER_STORE}
        <h1><ProfilePicture playerId={ID}/> <abbr title={$PLAYER_STORE.preferredName+' '+$PLAYER_STORE.familyName}>{$PLAYER_STORE.preferredName} {$PLAYER_STORE.familyName}</abbr></h1>
        <div class="sub-info">
  
            <TeamQuickInfo id={$PLAYER_STORE.team}/>
            <span class="divider">|</span>
            <span class="points"><NumberCounter value={$PLAYER_STORE.points} icon={true}/></span>
        </div>
    {:else}
        <h1>Loading...</h1>
    {/if}
</header>
<main>

    <section class="graph-section">
        <LineChart asDates={true} apiPath={`stats/players/${ID}/points`}/>
        <!-- <canvas>Line graph here</canvas> -->
    </section>
    <section class="badges-section">
        <h1>Badges</h1>
        <p>You instinct tells you that badges would be here, but they don't really exist. They're just a figment of your imagination. Badges aren't real.</p>
    </section>
    

</main>

<style lang="scss">

    span {
        font-weight: bold;
    }
    .icon {
		display: inline-flex;
		align-items: center;
		font-size: 0.7em;
	}
    .list-right {
		display: flex;
		gap: 0.2em;
	}
    h2 {
        margin-bottom: .5em;
    }

    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 2em;
        font-size: min(3vw, 1em);
        gap: 1em;
        h1 {
            font-size: 3em;
            margin: 0;
            line-height: 1em;
            color: var(--color-white);
            width: 100%;
            max-width: max-content;
            abbr {
                color: var(--color-white);
                text-decoration: none;
                min-width: none;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .graph-section {
        height: 20em;
        background: var(--color-dark);
        flex-grow: 1;
        min-width: 66%;
        max-width: 100%;
    }
    .badges-section {
        flex-grow: 1;
    }


    main {
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex-wrap: wrap;
        margin: auto;
        max-width: 60rem;
        gap: 2em;
        margin-top: auto;
    }

    .sub-info {
        display: flex;
        gap: .5em;
        align-items: center;
        font-size: .8em;
        justify-content: center;
        width: 100%;
        max-width: max-content;
        .divider {
            color: var(--color-main-translucent);
        }
    }

    .flag {
        font-size: .8em;
    }
    .name {
        color: var(--color-white);
    }

    .team {
        display: flex;
        align-items: center;
        gap: .5em;
    }

    .team-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .divider {
        font-size: 2em;
        font-weight: 100;
    }
    .points {
        font-size: 2em;
    }
    .team-icon {
        font-size: 1.3em;
    }

    header h1 {
        display: flex;
        align-items: center;
        gap: .3em;
    }

</style>
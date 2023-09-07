<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import NumberCounter from "$lib/data_visualization/NumberCounter.svelte";
	import Icon from "$lib/Icon.svelte";
	import List from "$lib/layout/List.svelte";
	import ListItem from "$lib/layout/ListItem.svelte";
    import LiveData, {getPlayerStore, getTeamStore, teamsMap} from "$lib/data/LiveData";
	import { onDestroy } from "svelte";
	import { showAlert, showAreYouSure, textPrompt } from "$lib/UTILS";
	import { yourData } from "$lib/data/LiveData";
	import LineChart from "$lib/data_visualization/LineChart.svelte";
	import BackendClient from "$lib/Backend.client";
	import Essential from "$lib/data/Essential";
    const ID = parseInt($page.params.id);
    if (isNaN(ID)) {
        goto("/teams", {replaceState: true});
    }
    
    const TEAM_STORE = LiveData.getLive(`teams/${ID}`);

    let MEMBERS: Map<number, any> = new Map();
    const MEMBERS_UNSUB: Map<number, Function> = new Map();

    let isLeader = false;
    $: isLeader = ($TEAM_STORE?.leader === Essential.yourId);

    let isMember = false;
    $: isMember = ($yourData?.team === ID);

    TEAM_STORE.subscribe((v)=>{
        console.log("TS", v);
        if (!v) return;
        
        const members: any[] = v.members;
        
        const REMOVE = [];
        for (const M of MEMBERS.keys()) {            
            if (!members.find((v)=>{return v === M})) {
                REMOVE.push(M);
            }
        }
        console.log(REMOVE);
        
        for (const M of REMOVE) {
            MEMBERS_UNSUB.get(M)();
            MEMBERS_UNSUB.delete(M);
            MEMBERS.delete(M);
        }
        for (const M of members) {
            if (!MEMBERS.has(M)) {
                console.log("ADDING", M);
                
                MEMBERS_UNSUB.set(M, LiveData.getLive(`players/${M}`).subscribe((v)=>{ 
                    console.log(v);
                    
                    if (v && Object.keys(v).length === 0) return;
                    MEMBERS.set(M, v);
                    MEMBERS = MEMBERS;
                }))
            }
        }

        
        
    });

    let joinCode = null;
    async function refreshJoinCode() {
        const VALUE = await BackendClient.get(`/teams/get-join-code?teamId=${ID}`);
        if (!VALUE.ok) return;
        joinCode = await VALUE.raw.text()
    }

    async function renameTeam() {
        const NAME = await textPrompt({
            title: `Rename ${$teamsMap[ID]?.name}`, 
            description: "Enter a new team name below. It must be 24 characters or under.", 
            submitButtonText: "Rename", 
            closeButtonText: `Cancel`,
            placeholder: `${$teamsMap[ID]?.name}`,
        });
        if (!NAME) return;
        if (NAME.trim() === "") {showAlert("Invalid Team Name", "You can't just put spaces lol"); return;}
        if (NAME.length > 24) {showAlert("Invalid Team Name", "It must be 24 characters of under."); return;}
        BackendClient.put("/teams/rename", {
            team: ID,
            name: NAME.trim()
        })
    }

    async function kickMember(member) {
        if (await showAreYouSure(`Kick ${member.preferredName}?`, "They will be removed from this team, but can rejoin. Regenerate the join code to prevent this.")) {
            BackendClient.delete("/teams/kick", {
                team: ID,
                member: member.id
            })
        }
    }

    async function regenerateJoinCode() {
        if (await showAreYouSure("Are you sure?", "Regenerating the join code will make the current join code invalid.", "Regenerate", "Nevermind")) {
            await BackendClient.put("/teams/regenerate-join-code", {})
            refreshJoinCode();
        }
    }

    async function leaveTeam() {
        if (!(await showAreYouSure("Are You Sure?", "If the team reaches the maximum member count in your absence, you will not be able to rejoin unless someone leaves."))) return; 
        const RES = await BackendClient.post("/teams/leave", {})
        if (RES.ok) goto("/pregame", {replaceState: true}); 
        else showAlert("Error", "Something went wrong.");
    }

    refreshJoinCode();

    onDestroy(()=>{
        for (const u of MEMBERS_UNSUB.values()) {
            u();
        }
    })

</script>

<svelte:head>
	<title>{$teamsMap[ID]?.name} | PWC</title>
</svelte:head>
<header>
    {#if $teamsMap[ID]}
        <h1><span class="icon"><Icon name="bookmark"/></span> <abbr title={$teamsMap[ID]?.name}>{$teamsMap[ID]?.name}</abbr></h1>
        <div class="sub-info"><span>{MEMBERS.size} Member{MEMBERS.size > 1 ? "s" : ""}</span><span class="divider">|</span><span><NumberCounter value={$teamsMap[ID].points} icon={true}/></span></div>
        {#if (isLeader && joinCode)}
            <button on:click={()=>{
                window.navigator.clipboard.writeText(joinCode);
                showAlert("Copied to Clipboard!", "");
            }}>Join Code: {joinCode}</button>
        {/if}

        
    {:else}
        <h1>Loading...</h1>
    {/if}
</header>
<main>

    <section class="graph-section">
        <LineChart asDates={true} apiPath={`stats/teams/${ID}/points`}/>
        <!-- <canvas>Line graph here</canvas> -->
    </section>
    <section class="members-section">
        <h2>Top of the Team</h2>
        <List>
            {#if (![...MEMBERS.values()].includes(undefined))}
                {#each [...MEMBERS.values()].sort((a, b)=>{return b.points-a.points}) as MEMBER, index (MEMBER.id)}
                    <ListItem accent={MEMBER.id === $yourData?.id} href={"/players/"+MEMBER.id}>
                        <span slot="left">#{index+1} 
                            {#if ($TEAM_STORE.leader === MEMBER.id)}
                                <span class="flag">
                                    <Icon name="flag-alt"/>
                                </span>
                            {/if} 
                            <span class={"name"}>
                                {MEMBER.preferredName} 
                                {MEMBER.familyName}
                            </span></span>
                        <span class="list-right" slot="right">
                            <span class="points">
                                {MEMBER.points.toLocaleString()}
                                <span class="icon">
                                    <Icon/>
                                </span>

                            </span>
                            {#if (isLeader && MEMBER.id !== $yourData?.id)}
                                <button 
                                    on:click|stopPropagation={()=>{kickMember(MEMBER)}} 
                                    class="small outline"
                                >X</button>
                            {/if}
                            
                        </span>
                    </ListItem>
                {/each}
            {:else}
                <ListItem>
                    <span slot="left">Loading members...</span>
                </ListItem>
            {/if}
        </List>
    </section>
    {#if (isMember)}
        <div class="actions">
            {#if (isLeader)}
                <button class="outline" on:click={renameTeam}>Rename</button>
                <button 
                    class="outline" 
                    on:click={regenerateJoinCode}
                >Regenerate Join Code</button>
            {/if}
            <button 
                class="outline" 
                on:click={leaveTeam}
            >Leave Team</button>
        </div>
    {/if}

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
        gap: 1em;
        align-items: center;
        .points {
            display: flex;
            gap: 0.2em;
            
        }
	}
    h2 {
        margin-bottom: .5em;
    }

    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 2em;
        font-size: min(3vw, 1em);
        h1 {
            font-size: 3em;
            margin: 0;
            line-height: 1em;
            display: flex;
            gap: 1rem;
            width: 100%;
            max-width: max-content;
            abbr {
                color: var(--color-white);
                text-decoration: none;
                min-width: 0;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                width: min-content;
            }
        }
        gap: .5em;
    }

    .graph-section {
        height: 20em;
        background: var(--color-dark);
        flex-grow: 1;
        min-width: 66%;
        max-width: 100%;
    }
    .members-section {
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

    .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1em;
    }
</style>
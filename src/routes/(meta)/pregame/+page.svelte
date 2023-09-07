<script lang="ts">
	import { yourTeam } from '$lib/data/LiveData';
	import { showAlert, textPrompt, showAreYouSure } from '$lib/UTILS';
	import { fade } from 'svelte/transition';
	import {getTeamStore, teamsList, teamsMap} from "$lib/data/LiveData";
	import List from '$lib/layout/List.svelte';
	import ListItem from '$lib/layout/ListItem.svelte';
	import { nextEvent } from '$lib/data/LiveData';
	import Essential from '$lib/data/Essential';
	import BackendClient from '$lib/Backend.client';
	let input = '';
	let joinButton: HTMLButtonElement;
	let createButton: HTMLButtonElement;
	let leaveButton: HTMLButtonElement;

	let teamStore;


	let unit: string = "days";
    let amount: number = 0;
    $: if ($nextEvent) {
    
        // unit = $nextEvent.timeLeft.unit;
        amount = $nextEvent.timeLeft.amount;
        unit = $nextEvent.timeLeft.unit;
    }

	$: if ($yourTeam) (async ()=>{
		teamStore = await getTeamStore($yourTeam);
		
	})();
	
	async function click() {
		joinButton.disabled = true;
		createButton.disabled = true;
		const RES = await BackendClient.post("/teams/join", input)
		switch (RES.status) {
			case 200: break;
			case 404: showAlert('Invalid Code', "That team doesn't exist!", "Try Again"); break;
			case 409: showAlert('Team Full', "That team already has the maximum number of members.", "Okay"); break;
			default: showAlert('Whoops', "An error occurred: "+RES.statusText, "Try Again");break;
		}
		if (!RES.ok) {
			joinButton.disabled = false;
			createButton.disabled = false;
		}
		
	}

	async function createTeam() {
		const NAME = (await textPrompt({
			title: "Create a Team",
			description: "To create a team, you must enter a name no longer than 24 characters.",
			closeButtonText: "Cancel",
			submitButtonText: "Submit",
			placeholder: "enter team name...",
		}))?.trim();
		joinButton.disabled = true;
		createButton.disabled = true;
		if (NAME === null || NAME === undefined) return;
		if (NAME === "") {
			await showAlert("Name Too Short!", "Enter a name from 1-24 characters.", "Try Again");
			createTeam();
			return;
		}
		if (NAME.length > 24) {
			await showAlert("Name Too Long!", "Enter a name from 1-24 characters.", "Try Again");
			createTeam();
			return;
		}
		const RES = await BackendClient.post("/teams/create", NAME)
		if (!RES.ok) {
			showAlert("Whoops", "Something went wrong.");
			joinButton.disabled = false;
			createButton.disabled = false;
		}
	}

	async function leaveTeam() {
		if (!(await showAreYouSure("Are You Sure?", "If someone else joins in your absence, you may not be able to rejoin."))) return; 
		leaveButton.disabled = true; 
		const RES = await BackendClient.post("/teams/leave", {});
		if (!RES.ok) {
			showAlert("Error", "Something went wrong.");
			leaveButton.disabled = false; 
		} 
	}

	let trDelay = 0;
	
	// THIS SHOULDN'T BE DONE HERE
	// SocketManager.socket.on("gameStateChange", (state)=>{
	// 	if (state === "IN_GAME") {
	// 		if ($yourTeam) goto("/dashboard", {replaceState: true});
	// 	}
	// })

</script>


{#if ($yourTeam && $teamStore && $teamsMap[$yourTeam])}
	<main on:transitionend={()=>{trDelay = 1000}} in:fade={{delay: trDelay}} out:fade={{}}>
	
		<div class="title">
			<h1>Pregame</h1>
			{#if ($nextEvent?.name === "Game Start")}
				<h2>The game starts in {amount} {unit.substring(0, (amount == 1) ? unit.length-1 : undefined)}.</h2>
			{/if}
		</div>

		<div class="your-team info-box">
			<h2>Your Team</h2>
			<h1 class="team-name">{$teamsMap[$yourTeam].name}</h1>
			<div class="info">
				<div class="members">
					<h1>{$teamsMap[$yourTeam].members}/6</h1>
					<h4>Members</h4>
				</div>
				{#if ($teamStore.leader === Essential.yourId)}
					{#await (BackendClient.get(`/teams/get-join-code?teamId=${$yourTeam}`))}
						<div>Loading join code...</div>
					{:then value}
						{#await value.raw.text()}
							<div>Loading join code...</div>
						{:then code} 
							<button on:click={()=>{
								window.navigator.clipboard.writeText(code);
								showAlert("Copied to Clipboard!", "");
							}}>Join Code: {code}</button>
						{/await}
					{/await}
				{/if}
				<button bind:this={leaveButton} on:click={leaveTeam} class="outline">Leave</button>
			</div>
		</div>
		<div class="other-teams info-box">
			<h1>Other Teams</h1>
			<div class="list">
				<List>
					{#each [...$teamsList].sort((a, b)=>{return b.members - a.members}) as TEAM (TEAM.id)}
						{#if (TEAM.id !== $yourTeam)}
							<ListItem>
								<span slot="left">
									{TEAM.name}
								</span>
								<span slot="right" class="subtle">
									{TEAM.members} member{TEAM.members!==1 ? "s" : ""}
								</span>
							</ListItem>
							
						{/if}
					{/each}
				</List>
			</div>
		</div>
	</main>
{:else if ($yourTeam === 0)}
	<main on:transitionend={()=>{trDelay = 1000}} in:fade={{delay: trDelay}} out:fade={{}}>
		<div>
			<h1>Join a Team</h1>
			<h2>or make your own!</h2>
		</div>
		<div class="space" />
		<form on:submit={(e)=>{e.preventDefault()}} class="input">
			<h3>Join a Team</h3>
			<input type="text" on:submit={click} placeholder="enter join code..." bind:value={input} />
			<button bind:this={joinButton} on:click={click}>Go</button>
		</form>
		<div class="or">
			<span />
			<h3>or</h3>
			<span />
		</div>
		<button bind:this={createButton} on:click={createTeam} class="outline">Create a Team</button>
	</main>
{/if}

<svelte:head>
	<title>Pregame | PWC</title>
</svelte:head>

<style lang="scss">
	main {
		text-align: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		margin: 0 1em;
	}
	.input {
		border-radius: 1em;
		margin: 0.75em auto 0.75em auto;
		background-color: var(--color-dark);
		text-align: center;
		align-self: stretch;
		align-items: center;
		padding: 2em;
		display: flex;
		flex-direction: column;
		width: min(90%, 20em);
		gap: 1em;
		font-size: 1.4em;
		h3 {
			color: var(--color-white);
			font-size: 1.3em;
		}
	}
	.space {
		height: 2em;
	}
	.or {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 0.5em;
		span {
			height: 1px;
			border: 1px solid var(--color-main-translucent);
			display: inline-block;
			flex-grow: 1;
		}
	}
	h1 {
		margin-top: 1em;
	}


	.your-team {
		.team-name {
			margin-bottom: .1em;
		}
		.info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: .5em;
			.members h1 {
				margin: 0;
				text-align: left;
				color: var(--color-main);
			}
		}
	}

	.other-teams {
		h1 {
			font-size: 1.5em;
		}
	}

	.info-box {
		width: min(24em, 100%);
		background: var(--color-dark);
		padding: 1em;
		border-radius: 1em;
		display: flex;
		flex-direction: column;
		h1 {
			color: var(--color-white);
			margin: 0;
			margin-bottom: .5em;
		}
		max-height: 20em;
		overflow: hidden;
	}
	.list {
		overflow-y: scroll;
		font-weight: bold;
		.subtle {
			color: var(--color-main-translucent);
		}
	}
	.title {
		margin-bottom: 1.5em;
	}
</style>

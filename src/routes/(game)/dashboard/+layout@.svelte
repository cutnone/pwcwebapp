<script lang="ts">
	import { yourPoints, yourTeam } from '$lib/data/LiveData';
	import NumberCounter from '$lib/data_visualization/NumberCounter.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import TeamQuickInfo from '$lib/widgets/teams/TeamQuickInfo.svelte';
	import ProfilePicture from '$lib/widgets/players/ProfilePicture.svelte';
	import { showAreYouSure } from '$lib/UTILS';
	import Essential from '$lib/data/Essential';

	let previous: string = '/';

	let pid = Essential.yourId;
	if (!pid) {
		Essential.setupPromise.then((v)=>{
			pid = v.yourId;
		})
	}
	

	afterNavigate((e) => {
		if (e.from?.url) previous = e.from.url.toString();
	});

	const UA = navigator.userAgent;
    if (!localStorage.getItem("homeScreenPrompted")) {
        if (
               /\b(iPad|iPhone|iPod)\b/.test(UA)
            || /Android.*Chrome|Chrome.*Android/.test(UA)
        ) {
			(async ()=>{
				const DO = await showAreYouSure("Wait a Minute!", "Want to play in full screen? How about quick access to the game? If so, you're in luck: You can add this app to your home screen.", "Let's do it.", "No thanks.")
				if (DO) {
					goto("/addtohome", {replaceState: true});
				}
			})();
            localStorage.setItem("homeScreenPrompted", "true");
        } else {
            localStorage.setItem("homeScreenPrompted", "true");
        }
    }

</script>

<nav>
	<TeamQuickInfo id={$yourTeam}/>
	<span class="right-nav">
		<span class="points">
			<span class="counter">
				<NumberCounter value={$yourPoints} icon={true} />
			</span>
			<p>Your Points</p>
		</span>
		<div class="profile-button" on:keypress on:click={()=>{goto(`/players/${Essential.yourId}`, {replaceState: true})}}>
			<ProfilePicture playerId={pid}/>
		</div>
	</span>
</nav>
<main>
	<div>
		<slot />
	</div>
</main>

<style lang="scss">
	.icon {
		height: 3.1ch;
		display: inline-flex;
		align-items: center;
	}

	.your-team {
		display: inline-flex;
		align-items: center;
		gap: 1em;
		font-weight: bold;
		vertical-align: middle;
		.icon {
			font-size: 1.5em;
		}
	}

	.your-team,
	.profile-button {
		cursor: pointer;
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
	}

	nav {
		position: fixed;
		top: 0;
		width: calc(100vw - 8px);
		font-size: min(3vw, 1rem);
		display: flex;
		height: 6rem;
		justify-content: space-between;
		align-items: center;
		z-index: 1;
		gap: 1em;
		background: linear-gradient(
			to bottom,
			var(--color-background),
			var(--color-background-translucent) 75%,
			var(--color-background-transparent) 
		);
		padding: 0.5em calc(2rem - 5px) 0.5em 2rem;
		.points {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			font-size: .3em;
			span {
				font-size: 2em;
			}
			font-weight: bold;
		}
		.right-nav {
			display: flex;
			align-items: center;
			gap: .4em;
			font-size: 3em;
		}
		.profile-button {
			display: flex;
			align-items: center;
		}
	}

	main {
		height: var(--viewport-height);
		overflow-y: scroll;
		div {
			padding-top: 5rem;
		}
	}
</style>

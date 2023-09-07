<script lang="ts">
	import PlaceCounter from '$lib/widgets/dashboard/TeamRank.svelte';
	import Widget from '$lib/widgets/dashboard/GridWidget.svelte';
	import TimeLeft from '$lib/widgets/dashboard/TimeLeft.svelte';
	import EventsWidget from '$lib/widgets/dashboard/EventsWidget.svelte';
	import Minigames from '$lib/widgets/dashboard/Minigames.svelte';
	import { yourPoints } from '$lib/data/LiveData';
	import Modal from '$lib/interaction/Modal.svelte';
	import ShopButton from '$lib/widgets/dashboard/ShopButton.svelte';
	let modal: Modal;
	let btn: HTMLButtonElement;
</script>

<main>
	<section class="widgets">
		<Widget clickable={true} first={true} let:button><PlaceCounter button={button}/></Widget>
		<Widget clickable={true} let:button><TimeLeft button={button}/></Widget>
		<Widget rowspan={2} colspan={2}><EventsWidget /></Widget>
		<!-- <Widget clickable={true} let:button><Minigames button={button}/></Widget> -->
		<Widget clickable={true} let:button><ShopButton button={button}/></Widget>
	</section>
	<Modal on:open={btn.blur} bind:this={modal}
		><button bind:this={btn} on:click={modal.hide}>Close</button></Modal
	>
</main>
<svelte:head><title>{$yourPoints.toLocaleString()} • | PW Collections</title></svelte:head>

<style lang="scss">
	.widgets {
		margin: auto;
		display: grid;
		padding: 1rem;
		width: min(100%, 1000px);
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr) minmax(8rem, 1fr));
		grid-auto-rows: 1fr;
		gap: 1rem;
		grid-auto-flow: dense;

		&::before {
			content: '';
			width: 0;
			padding-bottom: 100%;
			grid-row: 1 / 1;
			grid-column: 1 / 1;
		}
	}

	main {
		width: 100%;
		height: 100%;
		overflow: auto;
	}
</style>

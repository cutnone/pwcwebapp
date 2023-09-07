<script lang="ts">
	import { onMount } from "svelte";
	import BarChart from "$lib/data_visualization/BarChart.svelte";
	import {yourTeam} from "$lib/data/LiveData";
	import List from "$lib/layout/List.svelte";
	import ListItem from "$lib/layout/ListItem.svelte";
	import Icon from "$lib/Icon.svelte";
	import {teamsList} from "$lib/data/LiveData";

	let recordsOnGraph = 0;
	let chartWidth = 0;
	let data = []
	$: {
		const tempData: any[] = [];
		for (let i in $teamsList) {
			const t = $teamsList[i];
			const team = {
				accent: (t.id === $yourTeam),
				label: t.name,
				value: t.points,
				id: t.id,
				url: "/teams/"+t.id,
			}
			
			tempData[i] = team;
		}
		data = tempData;
		
	}
	$: {
		recordsOnGraph = Math.max(5, Math.min(Math.floor(chartWidth/150), data.length));
	}
	onMount(()=>{
		recordsOnGraph = 4;
	});
	
</script>

<svelte:head>
	<title>Rankings | PW Collections</title>
</svelte:head>
<h1 class="title">Rankings</h1>
<div bind:offsetWidth={chartWidth} class="chart">
	<BarChart data={data.slice(0, recordsOnGraph).reverse()}/>
</div>
<div class="list">
	<List>
		{#each (data) as entry (entry.id)}
			<div> <!-- animate:flip={{easing: expoInOut, duration: 500}} -->
				<ListItem href={"/teams/"+entry.id} accent={entry.accent}>
					<span slot="left">#{data.indexOf(entry)+1} <span class={"team-name "+(entry.accent ? "your-team-name" : "")}>{entry.label}</span></span>
					<span class="list-right" slot="right">{entry.value.toLocaleString()}<span class="icon"><Icon/></span></span>
				</ListItem>
			</div>
		{/each}
	</List>
</div>

<style lang="scss">
	.title {
		position: absolute;
		top: 4rem;
		font-size: min(8vw, 4rem);
	}
	.chart {
		height: min(50vmin, 30em);
		width: 100%;
		margin: 2rem auto 0 auto;
		font-size: min(2vw, 1em);
	}
	.list {
		margin: 1em auto 0 auto;
		width: min(100%, 40em);
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
	.team-name {
		color: var(--color-white);
	}
	
</style>

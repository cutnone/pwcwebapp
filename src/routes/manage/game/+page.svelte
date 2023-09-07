<script lang="ts">
	import BackendClient from "$lib/Backend.client";
	import { showAreYouSure } from "$lib/UTILS";
	import LiveData from "$lib/data/LiveData";
    import {DateTime, Duration} from "luxon";
	import { onDestroy, onMount } from "svelte";

    let start: string;
    let end: string;
    let maxShopMat: number;
    let maxShopSlots: number;

    let gameData = LiveData.getLive("gameData");

    function updateData(v) {
        gameData = v;
        
    }

    function updateGame() {
        const UPDATES: any = {};
        if (start) UPDATES.start = DateTime.fromISO(start).setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toISO();
        if (end) UPDATES.end = DateTime.fromISO(end).setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toISO();
        if (maxShopMat) UPDATES.maxShopMat = maxShopMat;
        if (maxShopSlots) UPDATES.maxShopSlots = maxShopSlots;
        BackendClient.post("/manage/game/update", UPDATES)
        start = undefined;
        end = undefined;
        maxShopMat = undefined;
        maxShopSlots = undefined;
    }
    
    async function resetGame() {
        if (!(await showAreYouSure("Are you sure?", "Resetting the game could make a lot of people mad lol"))) return;
        BackendClient.post("/manage/game/reset", {});
    }
</script>

<main>

    <h1>Current Game Data</h1>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>

                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Status</td>
                    <td>{$gameData.status}</td>
                </tr>
                <tr>
                    <td>Elapsed</td>
                    <td>{Duration.fromMillis($gameData.elapsed)?.shiftTo("days", "hours", "minutes", "seconds").toFormat("d:hh:mm:ss")}</td>
                </tr>
                <tr>
                    <td>Start Date</td>
                    <td>{DateTime.fromISO($gameData.start).toLocaleString({timeStyle: "long", dateStyle: "short"})}</td>
                </tr>
                <tr>
                    <td>End Date</td>
                    <td>{DateTime.fromISO($gameData.end).toLocaleString({timeStyle: "long", dateStyle: "short"})}</td>
                </tr>
                <tr>
                    <td>Shop Space</td>
                    <td>{$gameData.data?.shop.space.toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Shop MatPool Size</td>
                    <td>{$gameData.data?.shop.materialPool.size.toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Shop MatPool Value</td>
                    <td>{$gameData.data?.shop.materialPool.value.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <br/>
    <h1>Update Game</h1>
    <form action="">
        <label for="">Start</label>
        <input type="datetime-local" name="" id="" bind:value={start}>
        <label for="">End</label>
        <input type="datetime-local" name="" id="" bind:value={end}>
        <label for="">Max Shop Material</label>
        <input type="number" name="" id="" bind:value={maxShopMat}>
        <label for="">Max Shop Slots</label>
        <input type="number" name="" id="" bind:value={maxShopSlots}>
        <button on:click|preventDefault={updateGame}>Update Game</button>
    </form>

    <button class="outline" on:click={resetGame}>Reset Game</button>

</main>

<style lang="scss">
    table * {
        border: 1px solid var(--color-main);
    }
    td, th {
        padding: .5em;
    }
    table {
        border-collapse: collapse;
    }
</style>
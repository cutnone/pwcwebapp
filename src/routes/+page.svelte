<script lang="ts">
	import SignInButton from "$lib/interaction/SignInButton.svelte";
</script>
<svelte:head>
    <title>PW Collections</title>
</svelte:head>

<main>
	<h1>PW Collections</h1>
	<h2>Sign in with school email:</h2>
	<SignInButton/>

</main>

<style lang="scss">
	
	main {
		font-size: 2em;
		width: 100%;
		height: 100%;
		display: flex;
		font-size: min(5vw, 2rem);
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>

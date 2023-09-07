<script>
    
</script>

<svelte:head>
    <title>Minigames | PW Collections</title>
</svelte:head>
<main>
    <h1 class='center'>Minigames</h1>
    <div class='center'>
        <a href='/minigames/hangman'><span class='center'>Hangman</span></a>
        <a href='/minigames/trivia'><span class='center'>Trivia</span></a>
        <a href='/minigames/hangman'><span class='center'>To Be Determined</span></a>
        <a href='/minigames/hangman'><span class='center'>To Be Determined</span></a>


    </div>


</main>
<style lang="scss">
    .center{
        display:flex;
        justify-content: center;
        width:100%;
        flex-wrap:wrap;
        gap:.5em;

    }
    a{
        // stuff here
        background-color:var(--color-dark);
        display:display-block;
        padding:3em;
        border-radius:2em;
        text-decoration:none;
        width:10em;
        height:10em;
        
    }
    a:hover{
        transform:scale(1.05);
    }
    div{
        display:flex;
        gap:20em;
        
    }

</style>
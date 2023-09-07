<script lang="ts">
	import type Channel from "$lib/data/Channel";
	import SocketManager from "src/deprecated/SocketManager";
    import {showAlert} from "$lib/UTILS"
	import { onDestroy, onMount } from "svelte";
    let letters = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];
    // 50 words
    let word = "";
    let guessedLetters = [];
    let lives;
    let end = true;
    let channel: Channel;
    //Lives
    function runGame(){
        lives = 5;
        end = false;
        guessedLetters = [];
    }
    runGame();
    function keyPress(letter){
        guess(letter);
        guessedLetters.push(letter);
        guessedLetters = guessedLetters;
    }

    function guess(letter: string) {        
        channel.send("guess", letter);
    }

    onMount(async ()=>{
        channel = SocketManager.connectTo("activity");
        channel.on("restart", (wordLength)=>{
            word = "";
            guessedLetters = [];
            for (let i = 0; i < wordLength; i++) word+="_";
            end = false;
        }) 
        channel.on("reveal", (letter: string, indexes: number[])=>{
            for (const I of indexes) {         
                word = word.substring(0, I)+letter+((word.length <= I) ? "" : word.substring(I+1));
            }
        });
        channel.on("setLives", (_lives)=>{
            lives = _lives;
        });
        channel.on("loss", (word, pointChange: number)=>{
            showAlert("You Lost.","The word was "+word+". "+pointChange.toLocaleString());
            end = true;
        });
        channel.on("win", (word, pointChange: number)=>{
            showAlert("+"+pointChange.toLocaleString(),"You won! Nice job!");
            end = true;
        })
        SocketManager.queueEmit("minigames/hangman/start")
    });
    onDestroy(()=>{
        SocketManager.disconnectFrom("hangman");
    })
</script>

<!-- Body -->
<main>
    <h1>Hangman</h1>
    <div class="middle-content">
        <h3 class="center">
            {#each word as letter}
            <!-- letter count will display selected letter -->
                <span>{letter}</span>
            {/each}
        </h3>
        <div class="info">
            <!-- <h4>Words: {words.length}</h4> -->
            <!-- Displays # of words-->
            <h4>Lives: {lives}</h4>
        </div>
        <h4 class=.center>Guessed Letters: {guessedLetters.toString()}</h4>
    </div>
    <div class="keyboard">
        <div class="keyboard-row">
            {#each letters.slice(0, 10) as letter}
                <button style:width="2.7em" style:height='3.5em' disabled={guessedLetters.includes(letter) || end} on:click={()=>{keyPress(letter)}}>{letter}</button>
            {/each}
        </div>
        <div class="keyboard-row">
            {#each letters.slice(10, 19) as letter}
                <button style:width="2.7em" style:height='3.5em' disabled={guessedLetters.includes(letter) || end} on:click={()=>{keyPress(letter)}}>{letter}</button>
            {/each}
        </div>
        <div class="keyboard-row">
            {#each letters.slice(19, 26) as letter}
                <button style:width="2.7em"  style:height='3.5em' disabled={guessedLetters.includes(letter) || end} on:click={()=>{keyPress(letter)}}>{letter}</button>
            {/each}
        </div>
    </div>
</main>
<svelte:head><title>Hangman | PWC</title></svelte:head>

<style lang="scss">
    h1{
        text-align: center;
    }
    h3{
        font-size:8vw;
    }
    .center{
        display:flex;
        justify-content: center;
        width:100%;
        flex-wrap:wrap;
        gap:.5em;

    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        // ignore this it's just weird shit i gotta deal with
        height: 100%;
        // height: -webkit-fill-available;
        // height: fill-available;
        // height: stretch;
    }

    .keyboard {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        font-size: min(3vw, 1em);
        gap: .5em;
        margin-bottom: 1em;
        .keyboard-row {
            display: flex;
            justify-content: center;
            gap: .5em;

        }
    }

    .middle-content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .info {
        display: flex;
        gap: 1em;
    }

</style>
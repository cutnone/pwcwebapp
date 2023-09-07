<script>
    import {showAlert} from "$lib/UTILS"
    function rules(){
        showAlert("How to Play:","You will see a question along with the desired answer format (in parenthesis). Type your answer and press submit!","Got it!")
    }
    let questions = [{question:"1",answer:"1"},{question:"2",answer:"2"},{question:"3",answer:"3"}];
    let number = Math.floor(Math.random()*questions.length);
    let ask = questions[number];
    let value;
    function checkAnswer(){
        if(value === ask.answer){
            showAlert("Correct!","You got it! The answer was "+ask.answer+"!","Cool!");
        }else{
            showAlert("Incorrect!","That's not right... The answer was "+ask.answer+"!","Aw Shucks...");
        }
        number = Math.floor(Math.random()*questions.length);
        ask = questions[number];
        value='';
    }
</script>
<h2 class='center'>Trivia</h2>
<button on:click={()=>{rules()}}>Instructions</button>
<h3 class='center'>{ask.question}</h3>
<br/>
<span class='center'>
    <input type="text" placeholder='Input Response Here' bind:value/>
    <button on:click={()=>{checkAnswer()}}>Submit</button>
</span>
<style>
    .center{
        display:flex;
        justify-content: center;
        width:100%;
        flex-wrap:wrap;
        gap:.5em;

    }
</style>
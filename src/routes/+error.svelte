<script>
  import { page } from '$app/stores';

  const messages = {
    404: "That ain't a thing, bub.",
    403: "No players past this point.",
    500: "You broke the server.",
  }

</script>

<main>
  <section>
    <h1>{$page.status}</h1>
    <h2>{(messages[$page.status]) ? messages[$page.status] : $page.error.message}</h2>
    <!-- <h3>{$page.error.message}</h3> -->
    <a href="/dashboard"><button>Go Back Home</button></a>
  </section>

</main>


<style lang="scss">
  main {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
  section {
    font-size: min(5vw, 1.5rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
    h1 {
      font-size: 3em;
    }
  }

</style>
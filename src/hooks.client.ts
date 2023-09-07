
import Essential from "$lib/data/Essential";
import type { HandleClientError } from "@sveltejs/kit";

Essential.setup()

export const handleError: HandleClientError = (e) => {
    console.log(e.error);
    console.log(e.event);
  }

// setTimeout(()=>{
//     socket.emit("theme_change", "sky-dark");
// }, 5000);
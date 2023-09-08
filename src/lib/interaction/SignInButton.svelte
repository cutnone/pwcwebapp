<script lang="ts" context="module">
    declare const google: any;
</script>

<script lang="ts">
    import JWT from "jwt-decode";
	import { goto } from "$app/navigation";
    import Cookies from "js-cookie";
    import { showAlert } from "$lib/UTILS";
	import Essential from "$lib/data/Essential";
	import BackendClient from "$lib/Backend.client";
    let status = "[Signin status]";
    
    
    async function handleCredentialResponse(response) {
        
        status = "waiting for login"
        
        const res = await BackendClient.post("/login-attempt", response)
        if (res.status === 403) {
            status = "403"
            google.accounts.id.revoke((JWT(response.credential) as any).sub, done => {
                Cookies.remove("token");
                showAlert("Invalid Email","Please use your school email! (Ending in \"colonialsd.org\")","Got it");
            });
        } else if (res.ok) {
            status = "setting cookie";
            Cookies.set("token", response.credential, {
                expires: new Date(Date.now().valueOf()+5*24*60*60*1000),
                // expires in 5 days
            });
            
            await Essential.setup()
            goto("/pregame", {replaceState: true});

        } else {
            showAlert("Uh Oh","An error occurred: "+res.status);            
        }
    }

    

    function setup() {
        google.accounts.id.initialize({
            client_id: "508210784978-bl2omnk57tm6abcsv6bgsm1t989eulth.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
            { 
                theme: "outline", 
                size: "large" 
            }  // customization attributes
        );
        google.accounts.id.prompt(); // also display the One Tap dialog
    }

</script>

<svelte:head>
    <script on:load={setup} src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>
<!-- Beelow is signin :D -->
<div id="buttonDiv"></div>
<!-- <p>{status}</p> -->


<style>

</style>
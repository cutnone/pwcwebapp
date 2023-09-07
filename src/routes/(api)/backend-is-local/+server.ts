import BackendServer from "$lib/Backend.server"

export const GET = async () => {
    return new Response((await BackendServer.isLocal()) + "")
}
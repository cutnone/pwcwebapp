
import FullScreenLoader from "./FullScreenLoader.svelte";
import Alert from "./interaction/modal_presets/AlertModal.svelte";
import AreYouSureModal from "./interaction/modal_presets/AreYouSureModal.svelte";
import TextModal from "./interaction/modal_presets/TextModal.svelte";

export async function wait(duration: number) {
    await new Promise<void>((resolve) => {
        setTimeout(resolve, duration);
    })
}

export async function showAlert(title = "Alert", content = "No info", closeButtonText = "Close") {
    return new Promise<void>((res) => {
        // @ts-ignore
        const MODAL: Alert = new Alert({
            target: document.querySelector("body"),
            props: {
                title: title,
                message: content,
                buttonText: closeButtonText,
            }
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        MODAL.show();

        // @ts-ignore
        MODAL.$on("close", () => {
            // @ts-ignore
            MODAL.$destroy();
            res();
        });
    })

}

export async function showAreYouSure(title = "Alert", content = "No info", yesButtonText = "Yes", noButtonText = "No"): Promise<boolean> {
    return new Promise<boolean>((res) => {
        // @ts-ignore
        const MODAL: AreYouSureModal = new AreYouSureModal({
            target: document.querySelector("body"),
            props: {
                title: title,
                message: content,
                yesButtonText,
                noButtonText,
            }
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        MODAL.show();

        // @ts-ignore
        MODAL.$on("close", () => {
            const CHOICE = MODAL.choice;
            // @ts-ignore
            MODAL.$destroy();

            res(CHOICE);
        });
    })
}

export async function textPrompt(settings: {
    title?: string,
    description?: string,
    submitButtonText?: string,
    placeholder?: string,
    closeButtonText?: string,
}) {
    return new Promise<string>((res) => {
        // @ts-ignore
        const MODAL: TextModal = new TextModal({
            target: document.querySelector("body"),
            props: {
                title: settings.title ?? "Enter Text",
                message: settings.description ?? "",
                submitButtonText: settings.submitButtonText ?? "Submit",
                placeholder: settings.placeholder ?? "",
                closeButtonText: settings.closeButtonText,
            }
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        MODAL.show();

        // @ts-ignore
        MODAL.$on("close", () => {
            const VAL = MODAL.value;
            // @ts-ignore
            MODAL.$destroy();
            res(VAL);
        });
    })
}

export function showLoader(heading = "Alert", description = "") {
    // @ts-ignore
    const OVERLAY: FullScreenLoader = new FullScreenLoader({
        target: document.querySelector("body"),
        props: {
            heading,
            description,
        }
    });
    return async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await OVERLAY.close();
        // @ts-ignore
        OVERLAY.$destroy();
    };


}

export function capitalizeName(name: string): string {
    const CAPITALIZE_ON = [" ", "-"];
    const start = name.toLowerCase();
    let returnable = "";
    let capitalizeNext = true;
    for (const char of start) {
        if (CAPITALIZE_ON.includes(char)) {
            capitalizeNext = true;
            returnable += char;
        } else {
            returnable += capitalizeNext ? char.toUpperCase() : char;
            capitalizeNext = false;
        }
    }
    return returnable;
}


// from https://stackoverflow.com/a/34749873
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
*/
function isObject(item) {
    return (item && typeof item === 'object');
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
*/
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

export function deleteUndefined(obj: any) {
    for (const [k, v] of Object.entries(obj)) {
        if (v === null) delete obj[k];
        else if (v && typeof v === "object") {
            obj[k] = deleteUndefined(v);
        }
    }
    return obj;
}

export function debounce(func: (...args: any[])=>any, time = 100) {
    let timeout;
    return (...args: any[])=>{
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            func(...args)
        }, time)
    }
}

export function cooldown(func: (...args: any[])=>any, time = 100) {
    let enabled = true;
    return (...args: any[])=>{
        if (!enabled) return;
        enabled = false;
        func(...args)
        setTimeout(()=>{
            enabled = true;
        }, time)
    }
}

// THIS WILL BE DONE A DIFFERENT WAY
// export async function prepareSpecialListeners() {
//     SocketManager.fullEventProxy.on("gameStateChange", async (state) => {
//         if (state === "ENDED") {
//             (await import("$app/navigation")).goto("/pregame", { replaceState: true })
//         }
//     });
//     SocketManager.fullEventProxy.on("pointPopup", async (data) => {
//         await showAlert(`+${data.value.toLocaleString()}`, "You caught a point popup! There are 3 of these every day (outside of instructional time). Each is worth either 2,000 or 5,000 points.");
//         SocketManager.queueEmit("claim/pointPopup", (res) => {
//             if (res === 1) {
//                 showAlert("Whoops", "Either you already claimed that popup on a different device, or the time window to claim it has expired.", "Dismiss");
//             } else console.log(res);

//         })
//     });
// }

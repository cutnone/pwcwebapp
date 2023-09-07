<script lang="ts">
	import { onDestroy, onMount } from "svelte";
    import * as CHARTJS from "chart.js";
    import * as LUXON from "luxon";
	import LiveData from "$lib/data/LiveData";
    export let apiPath: string = null;
    export let asDates: boolean = false;

    let canvas: HTMLCanvasElement;
    let width: number = 0;
    let height: number = 0;
    let ctx;
    let chart: CHARTJS.Chart<"line", {}, unknown>;
    let data = LiveData.getLive(apiPath, {})
    let computed = getComputedStyle(document.querySelector(":root"))
    CHARTJS.Chart.defaults.interaction.mode = "nearest";
    CHARTJS.defaults.font = {
        family: "'Nunito'",
        size: 12,
    }
    $: {
        if (canvas) {
            canvas.height = canvas.parentElement.offsetHeight;
            canvas.width = canvas.parentElement.offsetWidth;
        }
    }

    $: setData($data);
    
    $: {
        
        if (canvas && !chart) {
            CHARTJS.Chart.register(...CHARTJS.registerables)
            ctx = canvas.getContext("2d");
            chart = new CHARTJS.Chart(ctx, {
                type: "line",
                data: {
                    datasets: [{
                        label: 'Points',
                        data: {},
                        fill: false,
                        borderColor: computed.getPropertyValue("--color-main"),
                        tension: 0,
                        pointStyle: "circle",
                        pointRadius: 0,
                    }],
                },
                options: {
                    interaction: {
                        intersect: false,

                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: 10,
                    },
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true,
                                boxWidth: 10,
                                boxHeight: 7,
                            }
                        },
                        tooltip: {
                            xAlign: "center",
                            yAlign: "top",
                        }
                    },
                    color: computed.getPropertyValue("--color-white"),
                    scales: {
                        x: {
                            ticks: {
                                maxRotation: 0,
                                autoSkip: true,
                                color: computed.getPropertyValue("--color-main"),
                            },
                            grid: {
                                color: computed.getPropertyValue("--color-main-more-translucent"),
                            }
                        },
                        y: {
                            ticks: {
                                color: computed.getPropertyValue("--color-main"),

                            },
                            grid: {
                                color: computed.getPropertyValue("--color-main-more-translucent"),
                            }
                        }
                    },
                    
                    
                }
            })
        };
    }

    function setData(...v) {
        if (!chart) return;
        let tmp = v[0];
        let FORMATTED = {};
        if (asDates) {
            for (const [k, v] of Object.entries(tmp)) {
                const DATE = LUXON.DateTime.fromMillis(parseInt(k), {
                    zone: "UTC"
                }).toLocal().toLocaleString(LUXON.DateTime.DATETIME_SHORT);
                
                FORMATTED[DATE] = v;
            }

        } else {
            FORMATTED = tmp;
        }
        chart.data.datasets[0].data = FORMATTED;
        chart.update();
    }


</script>

<canvas bind:this={canvas} bind:offsetWidth={width} bind:offsetHeight={height}></canvas>

<style lang="scss">
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
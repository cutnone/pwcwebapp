import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import sass from "sass";


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			implementation: sass,
		},
	}),

	kit: {
		adapter: adapter(),
		files: {
			lib: "./src/lib",
		},
		csrf: {
			checkOrigin: false,
		}
		
	}
};

export default config;

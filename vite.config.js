import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	// Set base to '/' for custom domain or '/repo-name/' for GitHub Pages
	base: '/hikmet-penceresi/',
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  base: process.env.VITE_BASE_PATH || '/kue-lestari-company-profile',
})

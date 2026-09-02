import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'src/pages/about.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
        projects: resolve(__dirname, 'src/pages/projects.html'),
        detailProject: resolve(__dirname, 'src/pages/detail-project.html'),
      },
    },
  },
})
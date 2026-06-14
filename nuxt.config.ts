// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    css: ['~/assets/styles/main.scss', '~/assets/fonts/fa/css/all.css'],
    modules: [],

    runtimeConfig: {
        public: {
            BASE_URL: 'https://api.retail.itl.digital/',
        },
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "@/assets/styles/helpers/_vars.scss" as *;
                        @use "@/assets/styles/helpers/_mixins.scss" as *;
                        @use "@/assets/styles/helpers/_media.scss" as *;
                    `,
                },
            },
        },
    },

})

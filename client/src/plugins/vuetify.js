import 'vuetify/styles'
import { createVuetify } from 'vuetify'
// import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            light: {
                colors: {
                    primary: "#FF1744",
                    background: '#f3f6fe',
                }
            },
            dark: {
                colors: {
                    primary: "#FFC107",
                }
            }
        }
    }
})
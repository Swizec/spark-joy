import { ThemeProvider } from "theme-ui";
import { deep } from "@theme-ui/presets";
import merge from "lodash.merge";

const theme = merge(deep, {
    container: {
        width: 800,
    },
});

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;

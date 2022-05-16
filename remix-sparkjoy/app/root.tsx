import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import { system } from "@theme-ui/presets";
import { Container, merge, ThemeProvider } from "theme-ui";
import { jsx, InitializeColorMode } from "theme-ui";

export const meta: MetaFunction = () => {
    return { title: "Sparking Joy" };
};

const theme = merge(system, {
    sizes: {
        container: 900,
    },
    layout: {
        container: {
            py: 4,
            px: [2, 0],
        },
    },
    text: {
        heading: {
            textAlign: "center",
        },
    },
    buttons: {
        primary: {
            cursor: "pointer",
        },
    },
});

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Meta />
                <Links />
                {typeof document === "undefined"
                    ? jsx(InitializeColorMode, { key: "theme-ui-no-flash" })
                    : null}
            </head>
            <body>
                <ThemeProvider theme={theme}>
                    <Container>
                        <Outlet />
                    </Container>
                </ThemeProvider>
                <ScrollRestoration />
                <Scripts />
                {process.env.NODE_ENV === "development" && <LiveReload />}
            </body>
        </html>
    );
}

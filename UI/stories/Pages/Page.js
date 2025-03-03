const style = `
<style>
    /* Mimic CSS Grid behaviour of <body> in Survey pages. */
    #storybook-root {
        display: grid;
        gap: var(--space-4);
        grid-template-areas:
            '. header .'
            '. main .'
            '. footer .';
        grid-template-columns:
            1fr minmax(var(--page-min-width), var(--page-max-width))
            1fr;
        grid-template-rows: var(--header-min-height) 1fr var(--footer-min-height);
        min-block-size: 100vh;
    }
</style>
`;

export const PageHtml = () => `
${style}

<header class="header">
    <p>Page header content goes inside <code>&lt;header&gt;</code>.</p>
</header>

<main class="surroundcontent">
    <form action="#">

        <o-question class="l-stack">
            <div class="l-cover"><!-- cover --></div>

            <div class="l-row">
                <div class="l-column">
                    <div>QUESTION GOES HERE...</div>
                </div>

                <div class="l-column">
                    <o-response>
                        <div>
                            FORM CONTROL(S) GO HERE...
                        </div>
                    </o-response>
                </div>
            </div>

        </o-question>

    </form>
</main>

<footer class="footer">
    <p>Page footer content goes inside <code>&lt;footer&gt;</code>.</p>
</footer>
`;

export const PageHtml = () => `
<div class="page">
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
</div>
`;

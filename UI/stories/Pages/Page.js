const style = `
<style>
    .sb-show-main.sb-main-padded {
        padding: 0;
    }
</style>
`;

export const PageHtml = () => `
${style}

<form action="#">
    <header class="header">
        <p>Page header content goes inside <code>&lt;header&gt;</code>.</p>
    </header>

    <main class="surroundcontent">

        <o-question class="l-stack">
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

    </main>

    <footer class="footer l-stack">
        <div class="m-button-group">
            <input type="submit" class="a-button-next" value="Next">
            <div class="m-button-group">
                <input type="submit" class="a-button-prev" value="Previous">
                <input type="submit" class="a-button-stop" value="Stop">
            </div>
        </div>

        <nav class="m-page-links" aria-label="Footer links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms and Conditions</a>
            <a href="#">Unsubscribe</a>
        </nav>
    </footer>
</form>
`;

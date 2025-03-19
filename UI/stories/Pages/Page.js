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
        <img alt="Ipsos" src="ipsoslogo192.png" height="192" width="192" />
    </header>

    <main class="surroundcontent">

        <o-question>
            <div class="l-row">
                <div class="l-column">
                    <div>QUESTION GOES HERE...</div>
                </div>

                <div class="l-column">
                    <o-response>
                        <div>
                            FORM CONTROL(S) GO HERE... e.g.<br>
                            <input type="text" />
                        </div>
                    </o-response>
                </div>
            </div>

        </o-question>

    </main>

    <footer class="footer">
        <div class="m-button-group">
            <input type="submit" class="a-button-next" value="Next" />
            <div class="m-button-group">
                <input type="submit" class="a-button-prev" value="Previous" />
                <input type="submit" class="a-button-stop" value="Stop" />
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

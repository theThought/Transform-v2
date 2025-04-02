const style = `
<style>
    .sb-show-main.sb-main-padded {
        padding: 0;
    }
</style>
`;

export const PageHtml = (): string => `
${style}

<form action="#">
    <header class="header">
        <img alt="Ipsos" src="ipsoslogo192.png" height="192" width="192" />
    </header>

    <main class="surroundcontent">

        <o-question>
            <div class="l-row">
                <div class="l-column">
                    <div>
                        <label for="_Q0" id="_Q0_label" class="a-label-question">
                            Q0 - using a <code>&lt;label&gt;</code> - with additional <code>id</code> for use with <code>ARIA</code>.
                        </label>
                    </div>
                </div>

                <div class="l-column">
                    <o-response>
                        <div>
                            <m-singleline
                                data-question-id="_Q0"
                                data-question-group="_Q0_Text"
                            >
                                <span class="a-label-pre"></span>
                                <input
                                    type="text"
                                    id="_Q0"
                                    class="a-singleline"
                                />
                                <span class="a-label-post"></span>
                            </m-singleline>
                        </div>
                    </o-response>
                </div>
            </div>

        </o-question>

        <o-question>
            <div class="l-row">
                <div class="l-column">
                    <div>
                        <label for="_Q1" id="_Q1_label" class="a-label-question">
                            Q1 - using a <code>&lt;label&gt;</code> - with additional <code>id</code> for use with <code>ARIA</code>.
                        </label>
                    </div>
                </div>

                <div class="l-column">
                    <o-response>
                        <div>
                            <m-singleline
                                data-question-id="_Q1"
                                data-question-group="_Q1_Text"
                            >
                                <span class="a-label-pre"></span>
                                <input
                                    type="text"
                                    id="_Q1"
                                    class="a-singleline"
                                />
                                <span class="a-label-post"></span>
                            </m-singleline>
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

document.addEventListener("DOMContentLoaded", function() {
    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
        const pagePath = window.location.pathname;
        const selectedLanguage = pagePath.includes("/fi/") ? "fi" : "en";
        languageSelect.value = selectedLanguage;

        languageSelect.addEventListener("change", function() {
            const selectedLanguage = this.value;
            const pagePath = window.location.pathname;
            const currentPage = pagePath.substring(pagePath.lastIndexOf('/') + 1);
            const currentDirectory = pagePath.substring(0, pagePath.lastIndexOf('/') + 1);
            let newPath;

            if (selectedLanguage === "en") {
                if (currentPage.endsWith("_fi.html")) {
                    newPath = currentDirectory.replace("/fi/", "/en/") + currentPage.replace("_fi.html", ".html");
                } else {
                    newPath = pagePath.replace(".html", ".html").replace("_fi", "");
                }
            } else {
                if (!currentPage.endsWith("_fi.html")) {
                    newPath = currentDirectory.replace("/en/", "/fi/") + currentPage.replace(".html", "_fi.html");
                } else {
                    newPath = pagePath;
                }
            }

            window.location.href = newPath;
        });
    } else {
        console.error("Language select element not found!");
    }
});

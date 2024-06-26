document.addEventListener("DOMContentLoaded", function() {
    const finnishFlag = document.getElementById("finnish-flag");
    const englishFlag = document.getElementById("english-flag");
    const finnishFlagMobile = document.getElementById("finnish-flag-mobile");
    const englishFlagMobile = document.getElementById("english-flag-mobile");

    if (finnishFlag && englishFlag) {
        const pagePath = window.location.pathname;
        const selectedLanguage = pagePath.includes("/fi/") ? "fi" : "en";

        if (selectedLanguage === "fi") {
            finnishFlag.classList.add("selected-flag");
        } else {
            englishFlag.classList.add("selected-flag");
        }

        [finnishFlag, englishFlag, finnishFlagMobile, englishFlagMobile].forEach(flag => {
            flag.addEventListener("click", function() {
                const selectedLanguage = this.dataset.language;
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

                // Update the 'intendedDestination' in the session storage
                const intendedDestination = sessionStorage.getItem("intendedDestination");
                if (intendedDestination) {
                    let newDestination;
                    if (selectedLanguage === "en") {
                        newDestination = intendedDestination.replace("/fi/", "/en/").replace("_fi.html", ".html");
                    } else {
                        newDestination = intendedDestination.replace("/en/", "/fi/").replace(".html", "_fi.html");
                    }
                    sessionStorage.setItem("intendedDestination", newDestination);
                }

                // Remove the 'selected-flag' class from both flags
                finnishFlag.classList.remove("selected-flag");
                englishFlag.classList.remove("selected-flag");
                finnishFlagMobile.classList.remove("selected-flag");
                englishFlagMobile.classList.remove("selected-flag");

                // Add the 'selected-flag' class to the clicked flag
                this.classList.add("selected-flag");

                window.location.href = newPath;
            });
        });
    } else {
        console.error("Language select element not found!");
    }
});
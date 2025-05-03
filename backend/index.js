document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");

    // Fonction pour injecter les backgrounds dans les boutons classe
    function injectBackgroundImages() {
        const links = menu.querySelectorAll("a.classe");
        links.forEach(link => {
            const className = link.classList[1];
            if (!link.style.backgroundImage || link.style.backgroundImage === "none") {
                link.style.backgroundImage = `url('../image/${capitalize(className)}.png')`;
                link.style.backgroundSize = "100%";
                link.style.backgroundPosition = "center";
                link.style.backgroundRepeat = "no-repeat";
            }
        });
    }

    // Toujours injecter les images dès le chargement de la page (utile pour desktop)
    injectBackgroundImages();

    // Si le bouton existe (mobile), on ajoute le toggle et on regère les images
    if (menuToggle && menu) {
        menuToggle.addEventListener("click", () => {
            menu.classList.toggle("hidden");

            // Reinjecter si besoin
            injectBackgroundImages();
        });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});

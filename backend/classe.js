document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get("nom");
    if (!table) return;

    let currentData = {};

    // Chargement des données depuis MongoDB Atlas via API PHP
    fetch(`../api.php?classe=${table}`)
        .then(res => res.json())
        .then(data => {
            currentData = data;

            // Remplir les informations de la classe
            document.getElementById("titre-classe").textContent = data.titre;
            document.getElementById("version-classe").textContent = data.version;
            document.getElementById("skin1").src = "../" + data.images.imgSkin1;
            document.getElementById("skin2").src = "../" + data.images.imgSkin2;
            document.getElementById("image-zenith").src = "../" + data.images.imgZenith;
            document.getElementById("rotation").src = "../" + data.images.imgRotation;
            document.getElementById("code-deck").textContent = data.codeDeck;
            document.getElementById("code-apti").textContent = data.codeApti;
            document.getElementById("lien-zenith").href = data.lienZenith;
            document.getElementById("lien-zenith").textContent = "Lien";

            document.getElementById("role").innerHTML = "<strong><u>Rôle :</u></strong><br>" + data.role;
            document.getElementById("fort").innerHTML = "<strong><u>Point Fort :</u></strong><br>" + data.fort;
            document.getElementById("neutre").innerHTML = "<strong><u>Point Neutre :</u></strong><br>" + data.neutre;
            document.getElementById("faible").innerHTML = "<strong><u>Point Faible :</u></strong><br>" + data.faible;

            document.getElementById("burstT2").textContent = data.burstT2;
            document.getElementById("burstT3").textContent = data.burstT3;
            document.getElementById("moyenne").textContent = ((parseFloat(data.burstT3) / 3).toFixed(2));
        })
        .catch(err => {
            document.querySelector("main").innerHTML = "<p>Erreur de chargement des données.</p>";
            console.error("Erreur fetch API :", err);
        });

    // Gérer l'ouverture de la popup
    const openBtn = document.getElementById("openModalBtn");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            const popup = document.getElementById("popup-form");
            if (popup) popup.style.display = "block";

            // Pré-remplir le formulaire avec les données existantes
            document.getElementById("form-titre").value = currentData.titre || "";
            document.getElementById("form-version").value = currentData.version || "";
            document.getElementById("form-code-deck").value = currentData.codeDeck || "";
            document.getElementById("form-code-apti").value = currentData.codeApti || "";
            document.getElementById("form-lien-zenith").value = currentData.lienZenith || "";
            document.getElementById("form-role").value = currentData.role || "";
            document.getElementById("form-fort").value = currentData.fort || "";
            document.getElementById("form-neutre").value = currentData.neutre || "";
            document.getElementById("form-faible").value = currentData.faible || "";
            document.getElementById("form-burstT2").value = currentData.burstT2 || "";
            document.getElementById("form-burstT3").value = currentData.burstT3 || "";
        });
    }

    // Gérer la fermeture de la popup
    const closeBtn = document.getElementById("close-form");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            const popup = document.getElementById("popup-form");
            if (popup) popup.style.display = "none";
        });
    }

    const cancelBtn = document.getElementById("cancel-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            const popup = document.getElementById("popup-form");
            if (popup) popup.style.display = "none";
        });
    }

    // Gérer la soumission du formulaire de modification
    const form = document.getElementById("form-modifier");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("classe", table);
            formData.append("titre", document.getElementById("form-titre").value);
            formData.append("version", document.getElementById("form-version").value);
            formData.append("codeDeck", document.getElementById("form-code-deck").value);
            formData.append("codeApti", document.getElementById("form-code-apti").value);
            formData.append("lienZenith", document.getElementById("form-lien-zenith").value);
            formData.append("role", document.getElementById("form-role").value);
            formData.append("fort", document.getElementById("form-fort").value);
            formData.append("neutre", document.getElementById("form-neutre").value);
            formData.append("faible", document.getElementById("form-faible").value);
            formData.append("burstT2", document.getElementById("form-burstT2").value);
            formData.append("burstT3", document.getElementById("form-burstT3").value);

            // Ajout des fichiers uniquement s'ils ont été modifiés
            const img1 = document.getElementById("form-img1").files[0];
            const img2 = document.getElementById("form-img2").files[0];
            const imgZenith = document.getElementById("form-imgZen").files[0];
            const imgRotation = document.getElementById("form-rotation").files[0];

            if (img1) formData.append("imgSkin1", img1);
            if (img2) formData.append("imgSkin2", img2);
            if (imgZenith) formData.append("imgZenith", imgZenith);
            if (imgRotation) formData.append("imgRotation", imgRotation);

            try {
                const response = await fetch('../update_classe.php', {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    alert("Mise à jour réussie !");
                    location.reload();
                } else {
                    alert("Erreur lors de la mise à jour : " + result.message);
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
                alert("Erreur réseau lors de la mise à jour");
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get("nom");
    if (!table) return;

    let currentData = {};

    fetch(`backend/api.php?classe=${table}`)
        .then(res => res.json())
        .then(data => {
            currentData = data;

            document.getElementById("titre-classe").textContent = data.Titre;
            document.getElementById("version-classe").textContent = data.Version;
            document.getElementById("skin1").src = data.Image_cra;
            document.getElementById("skin2").src = data.Image_cra_skin;
            document.getElementById("image-zenith").src = data.Image_zenith_wakfu;
            document.getElementById("code-deck").textContent = data.Code_deck;
            document.getElementById("code-apti").textContent = data.Code_apti;
            document.getElementById("lien-zenith").href = data.Lien_zenith;
            document.getElementById("lien-zenith").textContent = "Lien";

            document.getElementById("role").innerHTML = "<strong><u>Rôle :</u></strong><br>" + data.Role;
            document.getElementById("fort").innerHTML = "<strong><u>Point Fort :</u></strong><br>" + data.PointFort;
            document.getElementById("neutre").innerHTML = "<strong><u>Point Neutre :</u></strong><br>" + data.PointNeutre;
            document.getElementById("faible").innerHTML = "<strong><u>Point Faible :</u></strong><br>" + data["Point Faible"];

            document.getElementById("burstT2").textContent = data.BurstT2;
            document.getElementById("burstT3").textContent = data.Burst_T1_T3;
            document.getElementById("moyenne").textContent = (parseFloat(data.Burst_T1_T3) / 3).toFixed(2);
            document.getElementById("rotation").src = data.img_rotation_opti_detaille;
        })
        .catch(err => {
            document.querySelector("main").innerHTML = "<p>Erreur de chargement des données.</p>";
            console.error(err);
        });

    // Ouvrir le formulaire si le bouton existe
    const openBtn = document.getElementById("openModalBtn");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            const popup = document.getElementById("popup-form");
            if (popup) popup.style.display = "block";

            // Remplir les champs
            document.getElementById("form-titre").value = currentData.Titre;
            document.getElementById("form-version").value = currentData.Version;
            document.getElementById("form-code-deck").value = currentData.Code_deck;
            document.getElementById("form-code-apti").value = currentData.Code_apti;
            document.getElementById("form-lien-zenith").value = currentData.Lien_zenith;
            document.getElementById("form-role").value = currentData.Role;
            document.getElementById("form-fort").value = currentData.PointFort;
            document.getElementById("form-neutre").value = currentData.PointNeutre;
            document.getElementById("form-faible").value = currentData["Point Faible"];
            document.getElementById("form-burstT2").value = currentData.BurstT2;
            document.getElementById("form-burstT3").value = currentData.Burst_T1_T3;
        });
    }

    // Fermer la popup
    const closeBtn = document.getElementById("close-form");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            const popup = document.getElementById("popup-form");
            if (popup) popup.style.display = "none";
        });
    }

    // Bouton annuler
    const cancelBtn = document.getElementById("cancel-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            const popup = document.getElementById("popup-form");
            if (popup) popup.style.display = "none";
        });
    }

    // Soumission du formulaire
    const form = document.getElementById("form-modifier");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("classe", table);
            formData.append("Titre", document.getElementById("form-titre").value);
            formData.append("Version", document.getElementById("form-version").value);
            formData.append("Code_deck", document.getElementById("form-code-deck").value);
            formData.append("Code_apti", document.getElementById("form-code-apti").value);
            formData.append("Lien_zenith", document.getElementById("form-lien-zenith").value);
            formData.append("Role", document.getElementById("form-role").value);
            formData.append("PointFort", document.getElementById("form-fort").value);
            formData.append("PointNeutre", document.getElementById("form-neutre").value);
            formData.append("PointFaible", document.getElementById("form-faible").value);
            formData.append("BurstT2", document.getElementById("form-burstT2").value);
            formData.append("Burst_T1_T3", document.getElementById("form-burstT3").value);

            // Fichiers uniquement s'ils sont changés
            const img1 = document.getElementById("form-img1").files[0];
            const img2 = document.getElementById("form-img2").files[0];
            const imgZen = document.getElementById("form-imgZen").files[0];
            const imgRot = document.getElementById("form-rotation").files[0];

            if (img1) formData.append("Image_cra", img1);
            if (img2) formData.append("Image_cra_skin", img2);
            if (imgZen) formData.append("Image_zenith_wakfu", imgZen);
            if (imgRot) formData.append("img_rotation_opti_detaille", imgRot);

            try {
                const response = await fetch('backend/update_classe.php', {
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
                alert("Erreur réseau");
            }
        });
    }
});

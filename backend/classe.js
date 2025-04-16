document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get("nom");

    if (!table) return;

    fetch(`backend/api.php?classe=${table}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("titre-classe").textContent = data.Titre;
            document.getElementById("version-classe").textContent = data.Version;
            document.getElementById("skin1").src = data.Image_cra;
            document.getElementById("skin2").src = data.Image_cra_skin;
            document.getElementById("image-zenith").src = data.Image_zenith_wakfu;
            document.getElementById("code-deck").textContent = data.Code_deck;
            document.getElementById("code-apti").textContent = data.Code_apti;
            document.getElementById("lien-zenith").href = data.Lien_zenith;
            document.getElementById("role").textContent = data.Role;
            document.getElementById("fort").textContent = data.PointFort;
            document.getElementById("neutre").textContent = data.PointNeutre;
            document.getElementById("faible").textContent = data.PointFaible;
            document.getElementById("burstT2").textContent = data.BurstT2;
            document.getElementById("burstT3").textContent = data.Burst_T1_T3;
            document.getElementById("moyenne").textContent = (parseInt(data.Burst_T1_T3) / 3).toFixed(2);
            document.getElementById("rotation").src = data.img_rotation_opti_detaille;
        })
        .catch(err => {
            document.querySelector(".container").innerHTML = "<p>Erreur lors du chargement des données.</p>";
            console.error(err);
        });
});

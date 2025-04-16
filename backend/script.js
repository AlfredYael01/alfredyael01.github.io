document.addEventListener('DOMContentLoaded', function () {
    const letters = document.querySelectorAll('.title span');
    letters.forEach((span, index) => {
        span.style.setProperty('--i', index);
    });

    // Gère le son (déjà présent)
    const video = document.getElementById('intro-video');
    const soundToggle = document.getElementById('sound-toggle');

    video.muted = true;
    video.volume = 0.3;
    video.play().catch(() => {});

    let volumeLevel = 0.3;

    soundToggle.addEventListener('click', () => {
        if (volumeLevel === 1) {
            video.volume = 0.3;
            volumeLevel = 0.3;
            soundToggle.textContent = '🔉 Son réduit (click pour encore baisser)';
        } else if (volumeLevel === 0.3) {
            video.volume = 0.1;
            volumeLevel = 0.1;
            soundToggle.textContent = '🔈 Son très faible (click pour couper)';
        } else if (volumeLevel === 0.1) {
            video.volume = 0;
            volumeLevel = 0;
            soundToggle.textContent = '🔇 Son désactivé (click pour réactiver)';
        } else {
            video.volume = 0.3;
            volumeLevel = 0.3;
            soundToggle.textContent = '🔊 Son activé (click pour réduire)';
        }

        video.muted = false;
        video.play();
    });
});
const enterBtn = document.getElementById('enter-btn');

if (enterBtn) {
    enterBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = enterBtn.href;
        }, 800); // durée de l'animation
    });
}


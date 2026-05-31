document.addEventListener("DOMContentLoaded", () => {
    // جلب البيانات من السيرفر
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // تحديث النصوص والروابط
            document.getElementById('openingDate').innerText = data.openingDate;
            document.getElementById('phoneBtn').href = `tel:${data.phone}`;
            document.getElementById('whatsappBtn').href = data.whatsapp;
            document.getElementById('facebookBtn').href = data.facebook;
            document.getElementById('instagramBtn').href = data.instagram;
            document.getElementById('mapBtn').href = data.mapLink;

            // تحريك العداد (Animated Counter)
            animateCounter("customerCounter", data.customerCount, 2000);
        })
        .catch(error => console.error('Error loading data:', error));
});

// دالة تحريك العداد
function animateCounter(id, target, duration) {
    let obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * target);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
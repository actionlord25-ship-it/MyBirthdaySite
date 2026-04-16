import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, get, update, remove }
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyBKurmGWnVun0hmyAKDmsp-9eNa6oL9s2Y",
    authDomain: "my-birtday-project.firebaseapp.com",
    projectId: "my-birtday-project",
    storageBucket: "my-birtday-project.firebasestorage.app",
    messagingSenderId: "44371812910",
    appId: "1:44371812910:web:cf0dcbfc8968bca6a6f5bf",
    measurementId: "G-8R7XF8MRD4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===== GLOBAL FUNCTIONS =====
window.toggleDark = () => document.body.classList.toggle("dark");

window.copyLink = () => {
    navigator.clipboard.writeText(location.href);
    alert("Link copied 🎉");
};

window.shareWhatsApp = () => {
    let url = encodeURIComponent(location.href);
    window.open(`https://wa.me/?text=🎉 Wish me here ${url}`);
};

window.setAmount = (val) => {
    document.getElementById("amount").value = val;
};

// ===== COUNTDOWN =====
let birthday = new Date("April 28, 2026").getTime();

setInterval(() => {
    let diff = birthday - Date.now();
    
    let d = Math.floor(diff / (1000 * 60 * 60 * 24));
    let h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    document.getElementById("countdown").innerText =
        `⏳ ${d}d ${h}h left`;
}, 1000);

// ===== WAIT FOR DOM =====
document.addEventListener("DOMContentLoaded", () => {
    
    const wishForm = document.getElementById("wishForm");
    const wishesDiv = document.getElementById("wishes");
    const wishCount = document.getElementById("wishCount");
    
    // ===== SEND WISH =====
    wishForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("message").value.trim();
        
        if (!name || !message) {
            alert("Please fill all fields");
            return;
        }
        
        push(ref(db, "wishes"), {
            name: name,
            message: message
        });
        
        alert("Wish sent 🎉");
        
        setTimeout(() => {
            if (confirm("Share with friends?")) {
                window.shareWhatsApp();
            }
        }, 1000);
        
        wishForm.reset();
    });
    
    // ===== LOAD WISHES =====
    onChildAdded(ref(db, "wishes"), (snap) => {
        
        let data = snap.val();
        let id = snap.key;
        
        let div = document.createElement("div");
        div.className = "wish";
        
        div.innerHTML = `
            <b>${data.name}</b>
            <p>${data.message}</p>
            <button onclick="deleteWish('${id}')" 
                class="deleteBtn" style="display:none">
                Delete
            </button>
        `;
        
        wishesDiv.prepend(div);
        
        // update count
        let count = document.querySelectorAll(".wish").length;
        wishCount.innerText = `🔥 ${count} People have sent wishes`;
    });
    
});

// ===== ADMIN =====
let admin = false;

window.enableAdmin = () => {
    const pass = document.getElementById("adminPass").value;
    
    if (pass === "Admin-1234") {
        admin = true;
        
        document.querySelectorAll(".deleteBtn")
            .forEach(btn => btn.style.display = "block");
        
        alert("Admin mode ON");
    } else {
        alert("Wrong password");
    }
};

window.deleteWish = (id) => {
    if (!admin) return;
    remove(ref(db, "wishes/" + id));
};

// ===== PAYSTACK =====
window.payWithPaystack = () => {
    
    const email = document.getElementById("email").value;
    const amount = document.getElementById("amount").value;
    
    if (!email || !amount) {
        alert("Enter email and amount");
        return;
    }
    
    let handler = PaystackPop.setup({
        key: "pk_live_76ee9f9b01fe4c22bac53ee17c8cc59eaae2b6e0", // ⚠️ replace with your test key first
        email: email,
        amount: amount * 100,
        currency: "NGN",
        
        callback: () => alert("Payment successful 🎉"),
        onClose: () => alert("Payment cancelled")
    });
    
    handler.openIframe();
};

// ===== DOWNLOAD CSV =====
window.downloadGuestbook = async () => {
    
    let snap = await get(ref(db, "wishes"));
    let data = snap.val() || {};
    
    let csv = "Name,Message\n";
    
    for (let k in data) {
        csv += `${data[k].name},${data[k].message}\n`;
    }
    
    let blob = new Blob([csv], { type: "text/csv" });
    
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "wishes.csv";
    a.click();
};

// ===== IMAGE MODAL =====
window.openModal = (img) => {
    document.getElementById("imageModal").style.display = "block";
    document.getElementById("fullImage").src = img.src;
};

window.closeModal = () => {
    document.getElementById("imageModal").style.display = "none";
};

window.onclick = (e) => {
    let modal = document.getElementById("imageModal");
    if (e.target === modal) {
        modal.style.display = "none";
    }
};

// ===== SAFE ADS =====
window.watchAds = () => {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log("Ad already loaded");
    }
};100

window.addEventListener("load", () => {
    document.querySelectorAll(".adsbygoogle").forEach(ad => {
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {}
    });
});

/*
(adsbygoogle = window.adsbygoogle || []).push({});
     (adsbygoogle = window.adsbygoogle || []).push({});
     (adsbygoogle = window.adsbygoogle || []).push({});
     */
document.addEventListener("DOMContentLoaded", () => {
    // 0. GET GUEST NAME FROM URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('to');
    if (guestNameParam) {
        const guestNameElement = document.getElementById("guest-name");
        if (guestNameElement) {
            guestNameElement.innerText = guestNameParam;
        }
    }

    // 1. GATE OPENING & AUDIO CONTROL
    const coverGate = document.getElementById("cover-gate");
    const btnOpen = document.getElementById("btn-open");
    const mainContent = document.getElementById("main-content");
    const bgMusic = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-btn");
    const musicIcon = musicBtn.querySelector("i");
    
    // Prevent scrolling while cover is open
    document.body.classList.add("modal-open");

    // Open Invitation Click Event
    btnOpen.addEventListener("click", () => {
        // Play music
        bgMusic.play().then(() => {
            musicBtn.classList.add("playing");
            musicIcon.className = "fas fa-music";
        }).catch(err => {
            console.log("Audio autoplay was blocked by browser. User interaction required.");
        });

        // Hide Cover Gate with slide up animation
        coverGate.style.transform = "translateY(-100%)";
        coverGate.style.opacity = "0";
        setTimeout(() => {
            coverGate.style.display = "none";
            document.body.classList.remove("modal-open");
        }, 1200);

        // Show Main Content
        mainContent.style.display = "block";
        
        // Trigger flower animation
        setTimeout(() => {
            const flowerDeco = document.getElementById("flower-deco");
            if(flowerDeco) flowerDeco.classList.add("show");
        }, 1200);
        
        // Trigger initial reveal animations
        reveal();
    });

    // Toggle Music Play/Pause
    musicBtn.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.classList.add("playing");
            musicIcon.className = "fas fa-music";
            showToast("Musik dimainkan");
        } else {
            bgMusic.pause();
            musicBtn.classList.remove("playing");
            musicIcon.className = "fas fa-pause";
            showToast("Musik dihentikan");
        }
    });

    // 2. COUNTDOWN TIMER
    // Set wedding date (e.g. October 10, 2026, 09:00:00)
    const weddingDate = new Date("2026-10-10T09:00:00").getTime();
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference <= 0) {
            document.getElementById("countdown-timer").innerHTML = "<div class='countdown-item' style='min-width: 100%'><span class='countdown-number'>Hari Bahagia Telah Tiba!</span></div>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    };
    
    // Run countdown once immediately, then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 3. COPY CLIPBOARD FUNCTION
    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast("Nomor rekening berhasil disalin!");
        }).catch(err => {
            console.error("Gagal menyalin teks: ", err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast("Nomor rekening berhasil disalin!");
            } catch (err) {
                showToast("Gagal menyalin nomor rekening.");
            }
            document.body.removeChild(textArea);
        });
    };

    // Show Custom Toast
    const toast = document.getElementById("toast");
    const showToast = (message) => {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    };

    // 4. RSVP & WISHES GUESTBOOK (AJAX)
    const rsvpForm = document.getElementById("rsvp-form");
    const wishesList = document.getElementById("wishes-list");
    const submitBtn = rsvpForm.querySelector(".btn-submit");

    // Fetch existing wishes on page load
    const fetchWishes = () => {
        fetch("wishes.json")
            .then(res => res.json())
            .then(response => {
                // Adjust if JSON format differs
                const data = response.data || response;
                renderWishes(data);
            })
            .catch(err => {
                console.error("Error fetching wishes: ", err);
            });
    };

    // Render wishes into container
    const renderWishes = (wishes) => {
        if (wishes.length === 0) {
            wishesList.innerHTML = `<p style="text-align: center; opacity: 0.6; padding: 20px;">Belum ada ucapan doa restu.</p>`;
            return;
        }

        wishesList.innerHTML = wishes.map(wish => {
            const statusLabel = wish.kehadiran === 'hadir' ? 'Hadir' : (wish.kehadiran === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu-ragu');
            const statusClass = wish.kehadiran === 'hadir' ? 'status-hadir' : 'status-tidak';
            
            // Format timestamp into simple reading
            let formattedDate = '';
            try {
                const dateObj = new Date(wish.timestamp.replace(/-/g, "/"));
                formattedDate = dateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                formattedDate = wish.timestamp;
            }

            return `
                <div class="wish-item">
                    <div class="wish-header">
                        <span class="wish-name">${escapeHtml(wish.nama)}</span>
                        <span class="wish-status ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="wish-text">"${escapeHtml(wish.ucapan)}"</div>
                    <div class="wish-time">${formattedDate}</div>
                </div>
            `;
        }).join('');
    };

    // Submit RSVP and Wish
    rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nama = document.getElementById("nama").value.trim();
        const kehadiran = document.querySelector('input[name="kehadiran"]:checked')?.value;
        const ucapan = document.getElementById("ucapan").value.trim();

        if (!nama || !kehadiran || !ucapan) {
            showToast("Harap isi semua field!");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Mengirim...";

        const payload = { nama, kehadiran, ucapan };

        // Simulasi karena di GitHub Pages tidak ada backend PHP
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = "Kirim Doa Restu";
            
            showToast("Ucapan & RSVP berhasil dikirim! (Mode Statis)");
            rsvpForm.reset();
            
            // Tambahkan ucapan baru ke daftar sebagai simulasi
            const now = new Date();
            const newWish = {
                nama: payload.nama,
                kehadiran: payload.kehadiran,
                ucapan: payload.ucapan,
                timestamp: now.toISOString()
            };
            
            // Ambil wishes yang ada, tambahkan yang baru, render ulang (mock)
            const currentWishesHTML = wishesList.innerHTML;
            const newWishHTML = `
                <div class="wish-item">
                    <div class="wish-header">
                        <span class="wish-name">${escapeHtml(newWish.nama)}</span>
                        <span class="wish-status ${newWish.kehadiran === 'hadir' ? 'status-hadir' : 'status-tidak'}">${newWish.kehadiran === 'hadir' ? 'Hadir' : 'Tidak Hadir'}</span>
                    </div>
                    <div class="wish-text">"${escapeHtml(newWish.ucapan)}"</div>
                    <div class="wish-time">Baru saja</div>
                </div>
            `;
            
            if (wishesList.querySelector("p")) {
                wishesList.innerHTML = newWishHTML;
            } else {
                wishesList.innerHTML = newWishHTML + currentWishesHTML;
            }
            
            const checkedRadio = document.querySelector('input[name="kehadiran"]:checked');
            if (checkedRadio) checkedRadio.checked = false;
            
        }, 1000);
    });

    // Helper: Escape HTML to prevent XSS
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    };

    // Load initial wishes
    fetchWishes();

    // 5. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(".reveal");

    const reveal = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100; // Trigger element when 100px visible

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add("active");
            }
        });
    };

    // Watch scrolls
    window.addEventListener("scroll", reveal);

    // 6. FLOWER DECORATION OBSERVER
    const terimaKasih = document.getElementById("terima-kasih");
    const flowerDeco = document.getElementById("flower-deco");
    
    if (terimaKasih && flowerDeco) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Masuk area penutup, sembunyikan bunga
                    flowerDeco.classList.add("hide");
                } else {
                    // Keluar dari area penutup, tampilkan lagi
                    flowerDeco.classList.remove("hide");
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(terimaKasih);
    }
});

/* ==================== LEGENDA KOMENTAR ====================
   [BOOTSTRAP JS] = baris yang memakai JavaScript/API Bootstrap (objek "bootstrap.*")
   [BOOTSTRAP CSS] = baris JavaScript yang menambah/melepas KELAS Bootstrap (d-none, fade, show, is-valid, invisible, dll)
   [CUSTOM] = logika buatan sendiri (bukan fitur Bootstrap)
   Catatan: Bootstrap JS dimuat dari index.html (bootstrap.bundle.min.js) SEBELUM file ini, sehingga objek "bootstrap" bisa dipakai di sini.
   ========================================================== */
/* ==========================================================
   PENGATURAN FOTO. Ubah nama file dan keterangan di sini.
   Semua file foto ditaruh di folder "foto/".
   Hapus satu baris { src, ket } untuk mengurangi foto,
   atau salin satu baris untuk menambah foto.
   ========================================================== */
// [CUSTOM] daftar foto (diatur manual)
const FOTO = {
    profil: 'foto/profil.jpeg', // dipakai di Beranda, Tentang, dan kartu identitas
    galeri: {
        sd: {
            judul: 'Foto masa SD di SD Negeri 1 Contoh', foto: [
                { src: 'foto/sd-1.jpg', ket: 'Hari pertama masuk sekolah' },
                { src: 'foto/sd-2.jpg', ket: 'Bersama teman sekelas' },
                { src: 'foto/sd-3.jpg', ket: 'Perpisahan kelas 6' }
            ]
        },
        smp: {
            judul: 'Foto masa SMP di SMP Negeri 2 Contoh', foto: [
                { src: 'foto/smp-1.jpg', ket: 'Masa pengenalan lingkungan sekolah' },
                { src: 'foto/smp-2.jpg', ket: 'Kegiatan ekstrakurikuler' },
                { src: 'foto/smp-3.jpg', ket: 'Wisuda kelulusan' }
            ]
        },
        sma: {
            judul: 'Foto masa SMA di SMA Negeri 3 Contoh', foto: [
                { src: 'foto/sma-1.jpg', ket: 'Hari pertama di SMA' },
                { src: 'foto/sma-2.jpg', ket: 'Study tour bersama kelas' },
                { src: 'foto/sma-3.jpg', ket: 'Foto kelulusan' }
            ]
        },
        kuliah: {
            judul: 'Foto masa kuliah di Universitas Contoh', foto: [
                { src: 'foto/kuliah-1.jpeg', ket: 'Hari pertama kuliah' },
                { src: 'foto/kuliah-2.jpeg', ket: 'Kerja kelompok bersama teman' },
                { src: 'foto/kuliah-3.jpeg', ket: 'Kegiatan kampus' }
            ]
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // [CUSTOM] + [BOOTSTRAP CSS]: pasang foto; kelas 'object-fit-cover' dan 'invisible' berasal dari Bootstrap
    // Foto profil di semua tempat. Jika file tidak ada, huruf/ikon awal tetap tampil.
    $$('.photo-slot').forEach(slot => {
        const img = new Image();
        img.alt = 'Foto Abdal';
        img.className = 'object-fit-cover';
        img.addEventListener('load', () => {
            $$(':scope > span, :scope > i', slot).forEach(e => e.classList.add('invisible'));
            slot.appendChild(img);
        });
        img.src = FOTO[slot.dataset.photo];
    });

    // [CUSTOM] GALERI FOTO: membangun Bootstrap Carousel dari daftar FOTO.galeri
    // Galeri foto pendidikan
    const gal = $('#galModal'), galBody = $('#galBody'), galCount = $('#galCount');
    const missing = src => {
        const d = document.createElement('div');
        d.className = 'd-flex flex-column align-items-center justify-content-center text-center text-secondary p-3';
        d.innerHTML = '<i class="bi bi-image fs-1 text-primary"></i><p class="mb-1">Foto belum ditemukan.</p><small>Taruh file di <code></code> lalu muat ulang halaman.</small>';
        $('code', d).textContent = src;
        return d;
    };
    $$('.btn-gallery').forEach(btn => btn.addEventListener('click', () => {
        const g = FOTO.galeri[btn.dataset.level];
        $('#galTitle').textContent = g.judul;
        galBody.innerHTML = ''; galCount.textContent = '';
        if (!g.foto.length) {
            galBody.innerHTML = '<p class="text-center text-secondary py-5 mb-0"><i class="bi bi-images fs-1 d-block text-primary"></i>Belum ada foto untuk jenjang ini.</p>';
        } else {
            const car = document.createElement('div');
            car.className = 'carousel slide'; car.id = 'galCarousel';
            const inner = document.createElement('div'); inner.className = 'carousel-inner rounded-3';
            g.foto.forEach((f, i) => {
                const item = document.createElement('div');
                item.className = 'carousel-item' + (i ? '' : ' active');
                const frame = document.createElement('div'); frame.className = 'ratio ratio-4x3 bg-black';
                const img = new Image(); img.alt = f.ket; img.src = f.src; img.className = 'object-fit-contain';
                img.addEventListener('error', () => img.replaceWith(missing(f.src)));
                frame.appendChild(img); item.appendChild(frame); inner.appendChild(item);
            });
            car.appendChild(inner);
            if (g.foto.length > 1) {
                car.insertAdjacentHTML('beforeend',
                    '<button class="carousel-control-prev" type="button" data-bs-target="#galCarousel" data-bs-slide="prev" aria-label="Foto sebelumnya"><span class="carousel-control-prev-icon"></span></button>' +
                    '<button class="carousel-control-next" type="button" data-bs-target="#galCarousel" data-bs-slide="next" aria-label="Foto berikutnya"><span class="carousel-control-next-icon"></span></button>');
            }
            galBody.appendChild(car);
            const setInfo = i => galCount.textContent = `Foto ${i + 1} dari ${g.foto.length}: ${g.foto[i].ket}`;
            setInfo(0);
            car.addEventListener('slid.bs.carousel', e => setInfo(e.to));
            // [BOOTSTRAP JS] Carousel: mengaktifkan geser foto (tombol prev/next, swipe di HP, keyboard)
            new bootstrap.Carousel(car, { ride: false, touch: true });
        }
        // [BOOTSTRAP JS] Modal: membuka dialog galeri dari JavaScript
        bootstrap.Modal.getOrCreateInstance(gal).show();
    }));

    $('#year').textContent = new Date().getFullYear();

    // [BOOTSTRAP CSS] 'd-none' = kelas Bootstrap untuk menyembunyikan elemen; di sini ditambah/dilepas saat scroll
    // Tombol kembali ke atas
    const toTop = $('#toTop');
    addEventListener('scroll', () => toTop.classList.toggle('d-none', scrollY < 600), { passive: true });
    toTop.addEventListener('click', () => scrollTo({ top: 0 }));

    // [BOOTSTRAP JS] Collapse: menutup menu burger lewat kode
    // Tutup menu burger setelah link diklik (mobile)
    const menu = $('#nav');
    $$('.nav-link, .btn', menu).forEach(a => a.addEventListener('click', () => {
        if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }));

    // [CUSTOM] efek mengetik; [BOOTSTRAP CSS] 'opacity-0' membuat tanda | berkedip
    // Efek mengetik di hero
    const words = ['seorang mahasiswa baik', 'fans King Emyu', 'Pria sejati juga Setia'];
    const typed = $('#typed'), caret = $('#caret');
    let w = 0, c = 0, del = false;
    setInterval(() => caret.classList.toggle('opacity-0'), 500);
    (function tick() {
        if (reduce) { typed.textContent = words[0]; return; }
        const word = words[w];
        typed.textContent = word.slice(0, c);
        if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
        if (del && c === 0) { del = false; w = (w + 1) % words.length; }
        c += del ? -1 : 1;
        setTimeout(tick, del ? 45 : 90);
    })();

    // [BOOTSTRAP CSS] kelas 'fade' dan 'show' (transisi opacity bawaan Bootstrap) + [CUSTOM] IntersectionObserver & hitung angka
    // Muncul perlahan saat di-scroll (memakai kelas fade/show bawaan Bootstrap) + hitung angka
    const countUp = el => {
        const target = +el.dataset.count, suf = el.dataset.suffix || '';
        if (reduce) { el.textContent = target + suf; return; }
        const start = performance.now();
        (function step(t) {
            const p = Math.min((t - start) / 1200, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
            if (p < 1) requestAnimationFrame(step);
        })(start);
    };
    const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('show');
        $$('[data-count]', e.target).forEach(countUp);
        io.unobserve(e.target);
    }), { threshold: .15 });
    $$('[data-reveal]').forEach(el => { el.classList.add('fade'); io.observe(el); });

    // [BOOTSTRAP CSS] 'shadow-lg' = kelas bayangan Bootstrap, ditambah saat kursor menyentuh kartu
    // Efek bayangan saat kartu disentuh kursor
    $$('.hover-card').forEach(card => {
        const on = () => card.classList.add('shadow-lg');
        const off = () => card.classList.remove('shadow-lg');
        card.addEventListener('mouseenter', on); card.addEventListener('mouseleave', off);
        card.addEventListener('focusin', on); card.addEventListener('focusout', off);
    });

    // Modal detail kepribadian (isi dinamis dari data-*)
    const dm = $('#detailModal');
    $$('.btn-detail').forEach(btn => btn.addEventListener('click', () => {
        const d = btn.dataset;
        $('#dmTitle').textContent = d.title;
        $('#dmDesc').textContent = d.desc;
        $('#dmThumb').className = 'd-flex align-items-center justify-content-center py-5 fs-1 ' + d.bg;
        $('#dmThumb').innerHTML = '<i class="bi ' + d.icon + '"></i>';
        // [BOOTSTRAP JS] Modal: membuka dialog detail kepribadian
        bootstrap.Modal.getOrCreateInstance(dm).show();
    }));

    // [CUSTOM] tombol hitung dukungan MU (bukan fitur Bootstrap)
    // Tombol dukung MU
    let cheers = 0;
    const cheer = $('#cheer'), cc = $('#cheerCount'), cm = $('#cheerMsg');
    const msgs = ['Mantap, terus dukung!', 'Glory! Satu dukungan lagi!', 'Semangat Red Devils!', 'Dukunganmu terasa sampai Old Trafford!'];
    cheer.addEventListener('click', () => {
        cc.textContent = ++cheers;
        cm.textContent = cheers % 5 === 0 ? 'Luar biasa, ' + cheers + ' dukungan untuk MU!' : msgs[cheers % msgs.length];
    });

    // [BOOTSTRAP CSS + JS] VALIDASI FORM: 'is-valid' / 'is-invalid' memunculkan .valid-feedback / .invalid-feedback bawaan Bootstrap;
    // 'd-none' menyembunyikan spinner; bootstrap.Toast menampilkan notifikasi sukses
    // Validasi form + umpan balik
    const form = $('#contactForm'), pesan = $('#pesan'), count = $('#count');
    // [BOOTSTRAP JS] Toast: objek notifikasi (ditampilkan nanti dengan toast.show())
    const toast = bootstrap.Toast.getOrCreateInstance($('#okToast'), { delay: 4500 });
    pesan.addEventListener('input', () => count.textContent = `${pesan.value.length} / 300`);

    const check = el => {
        const ok = el.checkValidity() && el.value.trim().length > 0;
        el.classList.toggle('is-valid', ok);
        el.classList.toggle('is-invalid', !ok);
    };
    $$('.form-control', form).forEach(el => {
        el.addEventListener('blur', () => check(el));
        el.addEventListener('input', () => { if (el.classList.contains('is-invalid') || el.classList.contains('is-valid')) check(el); });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fields = $$('.form-control', form);
        fields.forEach(check);
        const bad = fields.find(f => f.classList.contains('is-invalid'));
        if (bad) { bad.focus(); return; }

        const btn = $('button[type=submit]', form), label = $('.label', btn), spin = $('.spinner-border', btn);
        btn.disabled = true; spin.classList.remove('d-none'); label.textContent = 'Mengirim...';
        setTimeout(() => {
            $('#toastMsg').textContent = `Terima kasih, ${$('#nama').value.trim()}! Pesanmu sudah terkirim.`;
            toast.show(); // [BOOTSTRAP JS] tampilkan Toast
            form.reset();
            fields.forEach(f => f.classList.remove('is-valid', 'is-invalid'));
            count.textContent = '0 / 300';
            btn.disabled = false; spin.classList.add('d-none'); label.textContent = 'Kirim pesan';
        }, 900);
    });
});

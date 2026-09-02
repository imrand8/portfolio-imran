import './style.css'
import { createClient } from '@supabase/supabase-js'

// ==========================================
// 1. SUPABASE INITIALIZATION
// ==========================================
const supabaseUrl = 'https://qitjxnkgwhtpzqbubaax.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdGp4bmtnd2h0cHpxYnViYWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MDgxMDEsImV4cCI6MjEwMjA4NDEwMX0.Vmze1Mq-Tc43COVYRGyxrLxWn7PEUgLmkDHs0z59JHs';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. LOAD HEADER & FOOTER (Dipanggil Pertama)
// ==========================================
async function loadComponents() {
  try {
    const headerRes = await fetch('/components/header.html');
    if (headerRes.ok) {
        const headerHtml = await headerRes.text();
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) headerPlaceholder.innerHTML = headerHtml;
    }

    const footerRes = await fetch('/components/footer.html');
    if (footerRes.ok) {
        const footerHtml = await footerRes.text();
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;
    }

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(`
      #header-placeholder nav div.hidden a, 
      #header-placeholder nav [role="dialog"] a,
      #footer-nav-links a
    `);
    
    navLinks.forEach(link => {
        if (!link.hasAttribute('href') || link.id === 'theme-toggle') return;
        const linkPath = new URL(link.href).pathname;
        const isHome = (currentPath === '/' || currentPath === '/index.html') && (linkPath === '/' || linkPath === '/index.html');
        const isMatch = currentPath === linkPath || isHome;

        if (isMatch) {
            link.classList.add('text-violet-600');
            link.classList.remove('text-gray-500', 'text-gray-600', 'dark:text-gray-400', 'hover:text-violet-600');
            if (link.closest('[role="dialog"]')) {
               link.classList.add('font-bold');
               link.classList.remove('font-semibold');
            }
        } else {
            link.classList.remove('text-violet-600');
            link.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:text-violet-600');
            if (link.closest('[role="dialog"]')) {
               link.classList.add('font-semibold');
               link.classList.remove('font-bold');
            }
        }
    });

    // Inisialisasi Fitur
    initDarkMode(); 
    initMobileMenu(); // <--- TAMBAHKAN PEMANGGILAN INI

  } catch (error) {
    console.error('Gagal memuat komponen:', error);
  }
}

loadComponents();

// ==========================================
// 3. FUNGSI DARK MODE
// ==========================================
function initDarkMode() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');
  const htmlRoot = document.getElementById('html-root');

  if (!themeToggleBtn) return; 

  function updateIcon() {
    if (htmlRoot.classList.contains('dark')) {
      lightIcon.classList.remove('hidden');
      darkIcon.classList.add('hidden');
    } else {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    }
  }

  // Cek preferensi awal
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      htmlRoot.classList.add('dark');
  } else {
      htmlRoot.classList.remove('dark');
  }
  updateIcon();

  // Event klik
  themeToggleBtn.addEventListener('click', function() {
      htmlRoot.classList.toggle('dark');
      if (htmlRoot.classList.contains('dark')) {
          localStorage.setItem('color-theme', 'dark');
      } else {
          localStorage.setItem('color-theme', 'light');
      }
      updateIcon();
  });
}

// ==========================================
// 4. RENDER PROYEK (BERANDA / INDEX.HTML)
// ==========================================
async function tampilkanProyekBeranda() {
  const wadahProyek = document.getElementById('projects-container');
  if (!wadahProyek) return; // Keluar jika bukan di halaman Home

  const { data, error } = await supabase.from('projects').select('*').limit(4);

  if (error) {
    wadahProyek.innerHTML = `<p class="text-red-500 font-medium">Gagal memuat data. Periksa koneksi Supabase.</p>`;
    return;
  }

  wadahProyek.innerHTML = '';
  data.forEach((proyek, index) => {
    const imgPlaceholder = 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop';
    const fotoProyek = proyek.image_url || imgPlaceholder;

    let colSpanClass = "";
    if (index % 4 === 0) colSpanClass = "lg:col-span-5";
    else if (index % 4 === 1) colSpanClass = "lg:col-span-7";
    else if (index % 4 === 2) colSpanClass = "lg:col-span-7";
    else if (index % 4 === 3) colSpanClass = "lg:col-span-5";

    const card = `
      <div class="group flex flex-col ${colSpanClass}">
        
        <!-- HAPUS lg:aspect-auto lg:h-[380px] dan GANTI menjadi aspect-[16/10] atau aspect-video -->
        <div class="relative w-full aspect-[4/3] lg:aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-200 dark:from-[#13131a] dark:to-[#0a0a0f] rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center p-6 sm:p-10 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
          
          <div class="absolute top-0 right-0 w-64 h-64 bg-violet-400/20 dark:bg-violet-600/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          <div class="absolute bottom-0 left-0 w-56 h-56 bg-fuchsia-400/20 dark:bg-fuchsia-600/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 24px 24px;"></div>
          
          ${renderProjectMedia(fotoProyek, proyek.title)}
        </div>
        
        <!-- Sisa kodenya tetap sama -->
        <div class="flex items-center gap-3 mb-3 px-2">
          <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors tracking-tight">${proyek.title}</h3>
          ${proyek.live_link ? `<a href="${proyek.live_link}" target="_blank" class="text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>` : ''}
        </div>
        <p class="text-gray-500 dark:text-gray-400 font-medium leading-relaxed px-2 line-clamp-3">${proyek.description}</p>
      </div>
    `;

    wadahProyek.innerHTML += card;
  });
}

tampilkanProyekBeranda();

// ==========================================
// 5. RENDER STICKY CARDS (HALAMAN PROJECTS.HTML)
// ==========================================
async function tampilkanDaftarProyekSticky() {
  const stickyContainer = document.getElementById('sticky-container');
  if (!stickyContainer) return; 

  const { data, error } = await supabase.from('projects').select('*');

  if (error) {
    stickyContainer.innerHTML = `<p class="text-red-500 font-medium">Gagal memuat data.</p>`;
    return;
  }

  stickyContainer.innerHTML = '';
  
  data.forEach((proyek, index) => {
    const imgPlaceholder = 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop';
    const fotoProyek = proyek.image_url || imgPlaceholder;
    
    const topPosition = 100; 
    const zIndex = 10 + index;
    const detailLink = `/src/pages/detail-project.html?id=${proyek.id}`;

    // SEMUA KARTU RATA mendapat pb-[50vh].
    // Celah 50vh di kartu terakhir akan ditutupi oleh footer berkat -mt-[50vh] di HTML.
    const paddingClass = "pb-[50vh]";

    const card = `
      <div class="sticky w-full bg-white dark:bg-[#0a0a0a] pt-12 ${paddingClass} transition-colors duration-300" 
           style="top: ${topPosition}px; z-index: ${zIndex};">
        
        <!-- FLEX CONTAINER: Atas-bawah di HP (flex-col), Kiri-kanan di Laptop (lg:flex-row) -->
        <div class="w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          <!-- SISI KIRI: Gambar Proyek (Lebar 60% di layar besar) -->
          <a href="${detailLink}" class="block relative w-full lg:w-[60%] aspect-video bg-gray-100 dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 transition-transform duration-500 hover:scale-[1.01] shrink-0">
             <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-violet-600 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
             <div class="absolute top-20 -left-20 w-64 h-64 bg-violet-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
             
             ${renderProjectMedia(fotoProyek, proyek.title)}
          </a>
          
          <!-- SISI KANAN: Teks Judul dan Deskripsi (Lebar 40% di layar besar) -->
          <div class="w-full lg:w-[40%] text-left">
             <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight">${proyek.title}</h2>
             <p class="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed">${proyek.description}</p>
          </div>

        </div>
        
      </div>
    `;
    
    stickyContainer.innerHTML += card;
  });
}

tampilkanDaftarProyekSticky();

// ==========================================
// 6. RENDER & LOGIKA TAB EXPERIENCE (BERANDA)
// ==========================================
async function tampilkanExperienceHome() {
  const tabsContainer = document.getElementById('home-exp-tabs');
  const contentsContainer = document.getElementById('home-exp-contents');
  const tabIndicator = document.getElementById('tab-indicator');
  
  if (!tabsContainer || !contentsContainer) return; 

  // Ambil data dari tabel experiences
  const { data, error } = await supabase.from('experiences').select('*').order('id', { ascending: true });

  if (error) {
    contentsContainer.innerHTML = `<p class="text-red-500 font-medium">Gagal memuat data pengalaman.</p>`;
    return;
  }

  // Render Data
  data.forEach((exp, index) => {
    const targetId = `exp-home-${index}`;
    const isActive = index === 0;

    // 1. Render Tombol Tab Kiri
    const btnClass = isActive 
      ? 'tab-btn text-left font-bold text-lg text-violet-600 transition-colors'
      : 'tab-btn text-left font-medium text-lg text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors';
    
    // Kita gunakan nama organisasi sebagai nama tombol
    const btnHtml = `<button data-target="${targetId}" class="${btnClass}">${exp.organization}</button>`;
    tabsContainer.insertAdjacentHTML('beforeend', btnHtml);

    // 2. Render Konten Kanan
    const contentClass = isActive 
      ? 'tab-content transition-opacity duration-500 opacity-100 absolute top-0 left-0 w-full'
      : 'tab-content transition-opacity duration-500 opacity-0 pointer-events-none absolute top-0 left-0 w-full';

    // Fallback: Jika short_desc kosong di Supabase, pakai teks ini sementara
    const summaryText = exp.short_desc || "Fokus pada optimalisasi proses digital, merancang solusi yang efisien, serta berkolaborasi dengan tim untuk mencapai target proyek secara maksimal.";

    const contentHtml = `
      <div id="${targetId}" class="${contentClass}">
        <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">${exp.role} <span class="text-violet-600">@ ${exp.organization}</span></h3>
        <p class="text-gray-400 text-sm mb-6 font-medium">${exp.period}</p>
        
        <div class="space-y-3 text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base leading-relaxed">
          <p>${summaryText}</p>
        </div>

        <!-- TOMBOL VIEW DETAIL TAMBAHAN -->
        <div class="mt-8">
           <a href="/src/pages/about.html" class="inline-flex items-center gap-2 text-violet-600 font-bold hover:text-violet-500 transition-colors group">
              Lihat Detail Pengalaman
              <svg class="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
           </a>
        </div>
      </div>
    `;
    contentsContainer.insertAdjacentHTML('beforeend', contentHtml);
  });

  // 3. Pasang Event Listener Klik untuk Animasi Pindah Tab
  const tabBtns = document.querySelectorAll('#home-exp-tabs .tab-btn');
  const tabContents = document.querySelectorAll('#home-exp-contents .tab-content');

  if (tabBtns.length > 0 && tabIndicator) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Reset warna semua tombol
        tabBtns.forEach(t => {
          t.classList.remove('text-violet-600', 'font-bold');
          t.classList.add('text-gray-400', 'font-medium', 'dark:text-gray-500');
        });

        // Sembunyikan semua konten
        tabContents.forEach(c => {
          c.classList.remove('opacity-100');
          c.classList.add('opacity-0', 'pointer-events-none');
        });

        // Warnai tombol yang aktif
        this.classList.remove('text-gray-400', 'font-medium', 'dark:text-gray-500');
        this.classList.add('text-violet-600', 'font-bold');

        // Munculkan konten yang sesuai
        const targetId = this.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.remove('opacity-0', 'pointer-events-none');
            targetContent.classList.add('opacity-100');
        }

        // Geser indikator garis ungu
        tabIndicator.style.top = `${this.offsetTop}px`;
      });
    });
  }
}

tampilkanExperienceHome();

// Helper Function untuk Merender Gambar, Video, atau Figma Embed
function renderProjectMedia(url, altText = 'Preview') {
  if (!url || url.includes('EMPTY')) {
    const fallbackImg = 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop';
    return `<img src="${fallbackImg}" alt="${altText}" class="w-full h-full object-cover">`;
  }

  // Hapus query parameter (?...) untuk pengecekan ekstensi file
  const cleanUrl = url.split('?')[0].toLowerCase();

  // 1. Cek Embed / Prototype Figma
  if (url.includes('figma.com')) {
    const embedUrl = url.includes('embed_host') 
      ? url 
      : `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    
    return `
      <iframe 
        class="w-full h-full min-h-[400px] border-0 rounded-2xl" 
        src="${embedUrl}" 
        allowfullscreen>
      </iframe>
    `;
  }

  // 2. Cek File Video (.mp4 / .webm)
  if (cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || url.includes('/videos/')) {
    return `
      <video autoplay loop muted playsinline class="w-full h-full object-cover rounded-2xl">
        <source src="${url}" type="video/mp4" />
        Browser Anda tidak mendukung tag video.
      </video>
    `;
  }

  // 3. Fallback: Gambar Statis
  return `<img src="${url}" alt="${altText}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">`;
}

// ==========================================
// 7. RENDER DETAIL PROJECT (HALAMAN DETAIL-PROJECT.HTML)
// ==========================================
async function tampilkanDetailProyek() {
  const detailContainer = document.getElementById('project-detail-container');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    detailContainer.innerHTML = `<p class="text-center text-xl font-medium mt-20">Proyek tidak ditemukan.</p>`;
    return;
  }

  const { data: proyek, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
  const { data: moreProjects } = await supabase.from('projects').select('*').neq('id', projectId).limit(2);

  if (error || !proyek) {
    detailContainer.innerHTML = `<p class="text-center text-red-500 text-xl font-medium mt-20">Gagal memuat data proyek.</p>`;
    return;
  }

  // Fallback Data
  const fotoCover = proyek.image_url && proyek.image_url !== 'EMPTY' 
    ? proyek.image_url 
    : 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop';
    
  const clientName = proyek.client || "Client Name";
  const projectYear = proyek.year || "2026";
  const projectRole = proyek.role || "Web Developer";
  
  const supervisorName = (proyek.supervisor_name && proyek.supervisor_name !== 'EMPTY') ? proyek.supervisor_name : clientName;
  const supervisorLabel = (proyek.supervisor_label && proyek.supervisor_label !== 'EMPTY') ? proyek.supervisor_label : "Project Owner";
  const clientInitial = (supervisorName || 'U').charAt(0).toUpperCase();
  const testimonialText = proyek.testimonial || "Kerja sama yang luar biasa dengan hasil yang sangat memuaskan.";

  const aboutText = proyek.about_project || "Penjelasan detail mengenai proyek ini belum ditambahkan.";
  const clientDescText = proyek.client_description || "Penjelasan mengenai klien atau latar belakang proyek belum ditambahkan.";
  const challengesText = proyek.challenges || "Penjelasan mengenai tantangan yang dihadapi belum ditambahkan.";
  const resultsText = proyek.results || "Penjelasan mengenai hasil akhir belum ditambahkan.";

  // Ambil 3 Media Gallery dari Supabase (Bisa berisi URL Gambar, MP4 Video, atau Link Figma)
  let media1 = fotoCover, media2 = fotoCover, media3 = fotoCover;
  if (proyek.gallery && Array.isArray(proyek.gallery) && proyek.gallery.length >= 3) {
      if(proyek.gallery[0] && !proyek.gallery[0].includes('EMPTY')) media1 = proyek.gallery[0];
      if(proyek.gallery[1] && !proyek.gallery[1].includes('EMPTY')) media2 = proyek.gallery[1];
      if(proyek.gallery[2] && !proyek.gallery[2].includes('EMPTY')) media3 = proyek.gallery[2];
  }

  // Section More Projects
  let moreProjectsHtml = '';
  if (moreProjects && moreProjects.length > 0) {
      moreProjectsHtml = moreProjects.map(p => {
          const imgP = p.image_url && p.image_url !== 'EMPTY' ? p.image_url : fotoCover;
          return `
            <a href="/src/pages/detail-project.html?id=${p.id}" class="group block">
                <div class="relative w-full aspect-video bg-gray-100 dark:bg-[#121212] rounded-3xl overflow-hidden mb-6 border border-gray-200 dark:border-white/5">
                    ${renderProjectMedia(imgP, p.title)} <!-- GANTI TAG <img... /> DENGAN INI -->
                </div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2 group-hover:text-violet-600 transition-colors">
                    ${p.title} 
                    <svg class="w-6 h-6 text-violet-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
                </h3>
                <p class="text-gray-500 dark:text-gray-400 line-clamp-2">${p.description}</p>
            </a>
          `;
      }).join('');
  }

  const htmlContent = `
    <!-- Header Title Proyek -->
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="text-center md:text-left flex-1">
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">${proyek.title}<span class="text-violet-600">.</span></h1>
        <p class="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-4xl leading-relaxed mx-auto md:mx-0">${proyek.description}</p>
      </div>
      
      ${proyek.live_link && proyek.live_link !== 'EMPTY' ? `
      <div class="flex justify-center md:justify-end pb-2">
        <a href="${proyek.live_link}" target="_blank" class="group inline-flex items-center gap-3 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(124,58,237,0.39)]">
          Visit Live Project
          <svg class="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
        </a>
      </div>
      ` : `
      <div class="flex justify-center md:justify-end pb-2">
        <a href="#preview-section" class="group inline-flex items-center gap-3 text-violet-600 font-bold hover:text-violet-500 transition-colors text-lg">
          Explore Detail
          <svg class="w-6 h-6 transform group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </a>
      </div>
      `}
    </div>

    <!-- Main Cover Image (Top Hero) -->
    <div class="w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-video bg-gray-100 dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] overflow-hidden mb-20 relative">
       <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-violet-600 rounded-full blur-[100px] opacity-40 pointer-events-none z-0"></div>
       <div class="absolute top-20 -left-20 w-64 h-64 bg-violet-500 rounded-full blur-[80px] opacity-20 pointer-events-none z-0"></div>
       <div class="relative z-10 w-full h-full">
          ${renderProjectMedia(fotoCover, proyek.title)}
       </div>
    </div>

    <!-- Details Sidebar & Case Study -->
    <div class="flex flex-col md:flex-row gap-12 lg:gap-20 mb-24 relative items-start">
      <div class="w-full md:w-[30%] lg:w-1/4 sticky top-32">
        <div class="border-2 border-violet-200 dark:border-violet-700/50 rounded-[1.5rem] p-6 lg:p-8 bg-white dark:bg-[#0a0a0a] shadow-[0_0_15px_rgba(124,58,237,0.05)]">
          <div class="flex flex-col gap-6">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Client</p>
              <p class="font-bold text-gray-900 dark:text-white text-base">${clientName}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Year</p>
              <p class="font-bold text-gray-900 dark:text-white text-base">${projectYear}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">My Role</p>
              <p class="font-bold text-gray-900 dark:text-white text-base">${projectRole}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full md:w-[70%] lg:w-3/4 space-y-12 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
        <section>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">About The Project</h2>
          <p>${aboutText}</p>
        </section>
        <section>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Our Client</h2>
          <p>${clientDescText}</p>
        </section>
        <section>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Challenges</h2>
          <p>${challengesText}</p>
        </section>
        <section>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Results</h2>
          <p>${resultsText}</p>
        </section>
      </div>
    </div>

    <!-- PREVIEW INTERAKTIF 3 MEDIA (FIGMA / VIDEO / GAMBAR) -->
    <div id="preview-section" class="mb-24">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Project Preview & Demo<span class="text-violet-600">.</span></h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Preview 1 (Atas Kiri) -->
            <div class="w-full aspect-video bg-gray-100 dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5">
                ${renderProjectMedia(media1, 'Preview 1')}
            </div>

            <!-- Preview 2 (Atas Kanan) -->
            <div class="w-full aspect-video bg-gray-100 dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5">
                ${renderProjectMedia(media2, 'Preview 2')}
            </div>

            <!-- Preview 3 (Bawah Full/Interaktif Figma Prototype) -->
            <div class="w-full md:col-span-2 aspect-[16/9] md:aspect-[21/9] bg-gray-100 dark:bg-[#121212] rounded-3xl overflow-hidden mt-2 border border-gray-200 dark:border-white/5">
                ${renderProjectMedia(media3, 'Interactive Demo')}
            </div>
        </div>
    </div>

    <!-- Testimonial Section -->
    <div class="w-full max-w-5xl mx-auto mb-32 border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 md:p-14 bg-gray-50 dark:bg-[#121212]">
      <p class="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-8 italic">
        "${testimonialText}"
      </p>
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-violet-100 overflow-hidden flex items-center justify-center text-violet-600 font-bold text-xl">
           ${clientInitial}
        </div>
        <div>
          <p class="font-bold text-gray-900 dark:text-white text-lg">${supervisorName}</p>
          <p class="text-violet-600 font-medium text-sm">${supervisorLabel}</p>
        </div>
      </div>
    </div>

    <!-- More Projects Section -->
    ${moreProjectsHtml ? `
        <div class="pt-10 border-t border-gray-200 dark:border-white/10">
            <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-12 tracking-tight">More Projects<span class="text-violet-600">.</span></h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                ${moreProjectsHtml}
            </div>
        </div>
    ` : ''}
  `;

  detailContainer.innerHTML = htmlContent;
}

// Jalankan fungsi
tampilkanDetailProyek();

// ==========================================
// 8. RENDER 3D INTERACTIVE GLOBE (HALAMAN ABOUT)
// ==========================================
import createGlobe from 'https://esm.sh/cobe';

function initInteractiveGlobe() {
  const canvas = document.getElementById('cobe-canvas');
  if (!canvas) return; 

  let phi = 4.8; // Menghadap Asia & Indonesia
  let pointerInteracting = null;
  let pointerInteractionMovement = 0;
  
  // Ambil elemen root HTML tempat class 'dark' disematkan
  const htmlRoot = document.getElementById('html-root');

  const globe = createGlobe(canvas, {
    devicePixelRatio: 2,
    width: 800 * 2, 
    height: 800 * 2,
    phi: 0,
    theta: -0.1, 
    dark: 0, // Nilai awal, akan dioverride di bawah
    diffuse: 1.2,
    mapSamples: 16000, 
    mapBrightness: 6,
    baseColor: [1, 1, 1], 
    markerColor: [124 / 255, 58 / 255, 237 / 255], 
    glowColor: [1, 1, 1], 
    markers: [
      // Titik Koordinat Pacitan, Jawa Timur
      { location: [-8.1986, 111.0961], size: 0.15 } 
    ],
    onRender: (state) => {
      // KUNCI UTAMA: Cek tema secara real-time setiap frame
      const isDarkMode = htmlRoot.classList.contains('dark');
      
      // Jika Dark Mode: Bola Hitam (1), Titik Terang, Glow Gelap
      // Jika Light Mode: Bola Putih (0), Titik Gelap, Glow Terang
      state.dark = isDarkMode ? 1 : 0;
      state.baseColor = isDarkMode ? [1, 1, 1] : [0.1, 0.1, 0.1];
      state.glowColor = isDarkMode ? [0.05, 0.05, 0.05] : [0.9, 0.9, 0.9];

      // Animasi berputar
      if (pointerInteracting === null) {
        phi += 0.003;
      }
      state.phi = phi + pointerInteractionMovement;
    }
  });

  // Munculkan globe
  setTimeout(() => canvas.classList.remove('opacity-0'), 100);

  // LOGIKA GESER (DRAG)
  canvas.addEventListener('pointerdown', (e) => {
    pointerInteracting = e.clientX - pointerInteractionMovement;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('pointerup', () => {
    if (pointerInteracting !== null) {
      phi += pointerInteractionMovement;
      pointerInteractionMovement = 0;
      pointerInteracting = null;
      canvas.style.cursor = 'grab';
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (pointerInteracting !== null) {
      const delta = e.clientX - pointerInteracting;
      pointerInteractionMovement = delta * 0.01;
    }
  });
}

initInteractiveGlobe();

// ==========================================
// 9. ANIMASI SCROLL TIMELINE (HALAMAN ABOUT)
// ==========================================
function initTimelineScrollAnimation() {
  const container = document.getElementById('experience-container');
  const progressBar = document.getElementById('experience-progress-bar');
  
  if (!container || !progressBar) return;

  window.addEventListener('scroll', () => {
    const containerRect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Mulai animasi saat bagian atas container muncul di 60% layar dari atas
    const startOffset = windowHeight * 0.6; 
    
    let scrollPercentage = 0;

    if (containerRect.top > startOffset) {
      scrollPercentage = 0;
    } else if (containerRect.bottom < startOffset) {
      scrollPercentage = 100;
    } else {
      const distanceScrolled = startOffset - containerRect.top;
      const totalDistance = containerRect.height;
      scrollPercentage = (distanceScrolled / totalDistance) * 100;
      scrollPercentage = Math.max(0, Math.min(100, scrollPercentage));
    }

    // PERBAIKAN GARIS UNGU:
    // Kurangi jarak travel maksimal (misal dikurangi 150px) agar garis berhenti pas di item terakhir, tidak bablas ke margin bawah.
    const paddingBawah = 150; 
    const maxTravelDistance = Math.max(0, container.offsetHeight - progressBar.offsetHeight - paddingBawah);
    
    const translateY = (scrollPercentage / 100) * maxTravelDistance;

    progressBar.style.transform = `translateY(${translateY}px)`;
  });
}

// Panggil fungsi animasinya (Tunda sedikit agar elemen dari Supabase selesai di-render dulu)
setTimeout(initTimelineScrollAnimation, 1000);


// ==========================================
// 10. RENDER EXPERIENCE TIMELINE (HALAMAN ABOUT.HTML)
// ==========================================
async function tampilkanExperienceAbout() {
  const wrapper = document.getElementById('experience-list-wrapper');
  if (!wrapper) return; 

  const { data, error } = await supabase.from('experiences').select('*').order('id', { ascending: true });

  if (error) {
    wrapper.innerHTML = `<p class="text-red-500 font-medium ml-20">Gagal memuat data pengalaman.</p>`;
    return;
  }

  wrapper.innerHTML = ''; 

  data.forEach((exp, index) => {
    const number = String(index + 1).padStart(2, '0');
    
    // PERBAIKAN CHECKLIST: 
    // Mengubah JSON Array menjadi elemen dengan ikon Check/Bullet yang rapi
    let responsibilitiesHtml = '';
    if (Array.isArray(exp.responsibilities)) {
       responsibilitiesHtml = exp.responsibilities.map(item => `
         <div class="flex items-start gap-3">
            <!-- Ikon Checklist Ungu -->
            <svg class="w-5 h-5 text-violet-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p class="flex-1 text-gray-600 dark:text-gray-400 leading-relaxed">${item}</p>
         </div>
       `).join('');
    } else {
       responsibilitiesHtml = `<p>${exp.responsibilities || ''}</p>`; 
    }

    let supervisorText = '';
    if (exp.supervisor_label && exp.supervisor_name) {
        supervisorText = `<span class="mx-2">•</span> ${exp.supervisor_label}: <span class="text-gray-700 dark:text-gray-300 font-bold">${exp.supervisor_name}</span>`;
    }

    const card = `
      <div class="flex gap-6 md:gap-10 relative z-20 experience-item mb-12">
        <div class="flex flex-col items-center w-12 md:w-16 shrink-0 bg-white dark:bg-[#0a0a0a] py-2 self-start rounded-xl">
          <span class="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mt-1">${number}</span>
        </div>
        <div class="flex flex-col pt-1 w-full">
          <span class="text-violet-600 font-semibold text-sm md:text-base tracking-wide mb-1">${exp.role}</span>
          <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">${exp.organization}</h3>
          
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">
             ${exp.period || ''} ${supervisorText}
          </p>

          <!-- Wadah Checklist -->
          <div class="space-y-4 text-sm md:text-base">
            ${responsibilitiesHtml}
          </div>
        </div>
      </div>
    `;
    
    wrapper.innerHTML += card;
  });
}

tampilkanExperienceAbout();

// ==========================================
// 11. RENDER MY STORY (HOME & ABOUT)
// ==========================================
async function tampilkanMyStory() {
  // Cek apakah kita sedang di halaman Home atau About
  const homeContainer = document.getElementById('home-story-container');
  const aboutContainer = document.getElementById('about-story-container');
  
  // Kalau tidak ada keduanya (misal di halaman Projects), langsung keluar
  if (!homeContainer && !aboutContainer) return;

  // Ambil semua data dari tabel 'stories'
  const { data, error } = await supabase.from('stories').select('*');

  if (error) {
    console.error("Gagal memuat My Story:", error);
    if (homeContainer) homeContainer.innerHTML = `<p class="text-red-500 font-medium">Gagal memuat cerita.</p>`;
    if (aboutContainer) aboutContainer.innerHTML = `<p class="text-red-500 font-medium">Gagal memuat cerita.</p>`;
    return;
  }

  // Pisahkan data berdasarkan kolom 'page'
  const homeStory = data.find(story => story.page === 'home');
  const aboutStory = data.find(story => story.page === 'about');

  // Fungsi khusus untuk menyusun Array JSON menjadi paragraf <p>
  const renderParagraphs = (storyData, container) => {
    if (storyData && Array.isArray(storyData.paragraphs)) {
      const html = storyData.paragraphs.map(p => `<p>${p}</p>`).join('');
      container.innerHTML = html;
    }
  };

  // Suntikkan ke HTML sesuai halaman yang sedang aktif
  if (homeContainer) renderParagraphs(homeStory, homeContainer);
  if (aboutContainer) renderParagraphs(aboutStory, aboutContainer);
}

// Panggil fungsinya
tampilkanMyStory();

// ==========================================
// LOGIKA ACTIVE NAV LINK (TAMBAHAN BARU)
// ==========================================
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a, #mobile-menu a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Reset warna aktif ungu
    link.classList.remove('text-violet-600');

    // Cek kecocokan halaman (Halaman Utama vs Halaman Lain)
    const isHome = (currentPath === '/' || currentPath.endsWith('index.html')) && (href === '/' || href.endsWith('index.html'));
    const isCurrentPage = href !== '/' && currentPath.endsWith(href);

    if (isHome || isCurrentPage) {
      link.classList.add('text-violet-600');
      link.classList.remove('text-gray-500', 'dark:text-gray-400', 'text-gray-700', 'dark:text-gray-300');
    }
  });
}

// ==========================================
// LOGIKA MOBILE MENU
// ==========================================
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileBtn || !mobileMenu) return;

  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = mobileMenu.classList.contains('hidden');
    
    if (isHidden) {
      // Buka Menu
      mobileMenu.classList.remove('hidden');
      setTimeout(() => {
        mobileMenu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none', '-translate-y-2');
        mobileMenu.classList.add('opacity-100', 'scale-100', 'pointer-events-auto', 'translate-y-0');
      }, 10);
    } else {
      // Tutup Menu
      closeMenu();
    }
  });

  function closeMenu() {
    mobileMenu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto', 'translate-y-0');
    mobileMenu.classList.add('opacity-0', 'scale-95', 'pointer-events-none', '-translate-y-2');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 300);
  }

  // Tutup jika klik di luar area menu
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
    }
  });
}

// ==========================================
// CARA PEMANGGILAN (Inisialisasi Header)
// ==========================================
// Jika kamu mengimpor header via fetch / layout loader:
async function loadHeader() {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  const response = await fetch('/src/components/header.html'); // Sesuaikan path component header kamu
  const html = await response.text();
  placeholder.innerHTML = html;

  // JALANKAN KEDUA FUNGSI SETELAH HEADER MUNCUL
  initMobileMenu();
  setActiveNavLink();
}

loadHeader();
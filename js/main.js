/* =====================================================
   صنایع رقومی هانا® — تعاملی مشترک
   ====================================================== */

(function () {
    'use strict';

    // 1 · SCROLL PROGRESS BAR
    const پیشرفت = document.createElement('div');
    پیشرفت.className = 'پیشرفت-اسکرول';
    document.body.appendChild(پیشرفت);

    // 2 · CURSOR GLOW
    const درخشش = document.createElement('div');
    درخشش.className = 'درخشش-نشانگر';
    document.body.appendChild(درخشش);

    let درخششX = 0, درخششY = 0;

    document.addEventListener('mousemove', (e) => {
        درخششX = e.clientX;
        درخششY = e.clientY;
        درخشش.style.left = درخششX + 'px';
        درخشش.style.top = درخششY + 'px';
    });

    // 3 · SCROLL HANDLERS
    const سربرگ = document.querySelector('.سر-برگ');
    const بازگشت = document.createElement('a');
    بازگشت.href = '#top';
    بازگشت.className = 'بازگشت-بالا';
    بازگشت.innerHTML = '↑';
    بازگشت.setAttribute('aria-label', 'بازگشت به بالا');
    document.body.appendChild(بازگشت);

    function onScroll() {
        const اسکرول = window.scrollY;
        const ارتفاع = document.documentElement.scrollHeight - window.innerHeight;
        const درصد = (اسکرول / ارتفاع) * 100;
        پیشرفت.style.width = درصد + '%';

        if (سربرگ) {
            if (اسکرول > 60) سربرگ.classList.add('فشرده');
            else سربرگ.classList.remove('فشرده');
        }

        if (اسکرول > 500) بازگشت.classList.add('نمایان');
        else بازگشت.classList.remove('نمایان');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 4 · MOBILE DRAWER
    const منودکمه = document.querySelector('.منو-دکمه');
    const کشو = document.querySelector('.کشو');
    const پرده = document.querySelector('.پرده-کشو');
    const بستن = document.querySelector('.کشو-بستن');

    function بازکردن() {
        if (کشو) کشو.classList.add('باز');
        if (پرده) پرده.classList.add('باز');
        document.body.style.overflow = 'hidden';
    }

    function بستنکشو() {
        if (کشو) کشو.classList.remove('باز');
        if (پرده) پرده.classList.remove('باز');
        document.body.style.overflow = '';
    }

    if (منودکمه) منودکمه.addEventListener('click', بازکردن);
    if (بستن) بستن.addEventListener('click', بستنکشو);
    if (پرده) پرده.addEventListener('click', بستنکشو);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') بستنکشو();
    });

    // 5 · REVEAL ON SCROLL
    const آشکارساز = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('نمایان');
                آشکارساز.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.آشکار').forEach(el => آشکارساز.observe(el));

    // 6 · GALLERY FILTER
    const فیلترها = document.querySelectorAll('.فیلتر-دکمه');
    const قابها = document.querySelectorAll('.قاب[data-دسته]');

    فیلترها.forEach(btn => {
        btn.addEventListener('click', () => {
            const دسته = btn.dataset.فیلتر;
            فیلترها.forEach(b => b.classList.remove('فعال'));
            btn.classList.add('فعال');

            قابها.forEach(قاب => {
                if (دسته === 'همه' || قاب.dataset.دسته === دسته) {
                    قاب.classList.remove('پنهان');
                    قاب.style.animation = 'none';
                    setTimeout(() => قاب.style.animation = '', 10);
                } else {
                    قاب.classList.add('پنهان');
                }
            });
        });
    });

    // 7 · LIGHTBOX
    const نورقاب = document.querySelector('.نور-قاب');
    if (نورقاب) {
        const تصویرنور = نورقاب.querySelector('img');
        const بستننور = نورقاب.querySelector('.نور-بستن');

        document.querySelectorAll('.قاب').forEach(قاب => {
            قاب.addEventListener('click', () => {
                const img = قاب.querySelector('img');
                if (img) {
                    تصویرنور.src = img.src;
                    تصویرنور.alt = img.alt;
                    نورقاب.classList.add('باز');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function بستننورقاب() {
            نورقاب.classList.remove('باز');
            document.body.style.overflow = '';
        }

        if (بستننور) بستننور.addEventListener('click', بستننورقاب);
        نورقاب.addEventListener('click', (e) => {
            if (e.target === نورقاب) بستننورقاب();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') بستننورقاب();
        });
    }

    // 8 · SMOOTH ANCHOR SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#' || id === '#top') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // 9 · ACTIVE NAV LINK (based on filename)
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.پیوندها a, .کشو a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
            link.classList.add('فعال');
        }
    });

    // 10 · CLOSE LANGUAGE DROPDOWN ON CLICK OUTSIDE
    document.addEventListener('click', (e) => {
        const زبان = document.querySelector('.زبان');
        const ورودی = document.getElementById('زبان-ورودی');
        if (زبان && ورودی && !زبان.contains(e.target)) {
            ورودی.checked = false;
        }
    });

})();
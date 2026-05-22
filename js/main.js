;(function () {
	'use strict';

	// Full height for hero section
	function fullHeight() {
		const els = document.querySelectorAll('.js-fullheight');
		function setHeight() {
			els.forEach(el => el.style.height = window.innerHeight + 'px');
		}
		setHeight();
		window.addEventListener('resize', setHeight);
	}

	// Scroll-triggered animations using IntersectionObserver
	function contentWayPoint() {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !entry.target.classList.contains('animated-fast')) {
					entry.target.classList.add('item-animate');

					setTimeout(() => {
						const items = document.querySelectorAll('.animate-box.item-animate');
						items.forEach((el, k) => {
							setTimeout(() => {
								const effect = el.dataset.animateEffect;
								if (effect === 'fadeIn') {
									el.classList.add('fadeIn', 'animated-fast');
								} else if (effect === 'fadeInLeft') {
									el.classList.add('fadeInLeft', 'animated-fast');
								} else if (effect === 'fadeInRight') {
									el.classList.add('fadeInRight', 'animated-fast');
								} else {
									el.classList.add('fadeInUp', 'animated-fast');
								}
								el.classList.remove('item-animate');
							}, k * 100);
						});
					}, 50);
				}
			});
		}, { threshold: 0, rootMargin: '0px 0px -15% 0px' });

		document.querySelectorAll('.animate-box').forEach(el => observer.observe(el));
	}

	// Go to top button
	function goToTop() {
		const btn = document.querySelector('.js-gotop');
		const wrapper = document.querySelector('.js-top');

		if (btn) {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
		}

		if (wrapper) {
			window.addEventListener('scroll', () => {
				if (window.scrollY > 200) {
					wrapper.classList.add('active');
				} else {
					wrapper.classList.remove('active');
				}
			});
		}
	}

	// Modal close: reset iframe src to stop video playback
	function handleModalClose() {
		document.querySelectorAll('.modal').forEach(modal => {
			modal.addEventListener('hidden.bs.modal', () => {
				const iframe = modal.querySelector('iframe');
				if (iframe) {
					const src = iframe.getAttribute('src');
					iframe.setAttribute('src', '');
					setTimeout(() => iframe.setAttribute('src', src), 100);
				}
			});
		});
	}

	// JSON-LD structured data for SEO
	function addJsonLd() {
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "Samuel de Weerd",
			"jobTitle": "Data Scientist | AI engineer",
			"url": "https://www.samueldeweerd.nl",
			"image": "https://www.samueldeweerd.nl/images/samuel.jpg",
			"sameAs": [
				"https://www.linkedin.com/in/samuel-de-weerd-8a9717201/",
				"https://github.com/SamueldeWeerd",
				"https://www.instagram.com/samuel_deweird/",
				"https://www.youtube.com/@samuels_spinsels"
			],
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "Utrecht",
				"addressCountry": "NL"
			},
			"knowsAbout": ["Data Science", "Machine Learning", "AI", "Python", "GIS", "Software Development"]
		});
		document.head.appendChild(script);
	}

	// Portfolio filter buttons
	function setupFilterButtons() {
		const buttons = document.querySelectorAll('.filter-btn');
		const container = document.querySelector('.portfolio-list');
		if (!container) return;
		const items = Array.from(container.querySelectorAll('[data-category]'));

		buttons.forEach(button => {
			button.addEventListener('click', () => {
				buttons.forEach(btn => btn.classList.remove('active'));
				button.classList.add('active');

				const filter = button.getAttribute('data-filter');
				const filtered = items.filter(item => {
					const categories = item.getAttribute('data-category').split(' ');
					return filter === 'all' || categories.includes(filter);
				});

				container.innerHTML = '';
				filtered.forEach(item => container.appendChild(item));
			});
		});
	}

	// Navbar toggle
	function setupNavbarToggle() {
		const toggleButton = document.querySelector('.hamburger-icon');
		const navbarItems = document.querySelectorAll('.navbar-item');
		const navbar = document.querySelector('.floating-navbar');
		if (!toggleButton || !navbar) return;

		const toggleNavbar = () => {
			navbar.classList.toggle('hidden');
			navbar.classList.toggle('visible');
		};

		toggleButton.addEventListener('click', toggleNavbar);
		navbarItems.forEach(item => item.addEventListener('click', toggleNavbar));
	}

	// i18n: update content
	function updateContent(langData) {
		document.querySelectorAll('[data-i18n]').forEach(element => {
			const key = element.getAttribute('data-i18n');
			if (langData[key]) {
				element.innerHTML = langData[key];
			}
		});
	}

	// i18n: fetch language data (with fallback for file:// protocol)
	async function fetchLanguageData(lang) {
		try {
			const response = await fetch('translations/' + lang + '.json');
			if (!response.ok) throw new Error('HTTP ' + response.status);
			return await response.json();
		} catch (error) {
			console.error('Error fetching language data: ' + error.message);
			// Fallback: try with explicit path
			try {
				const base = document.querySelector('base');
				const basePath = base ? base.href : window.location.href.replace(/[^/]*$/, '');
				const response = await fetch(basePath + 'translations/' + lang + '.json');
				if (!response.ok) throw new Error('HTTP ' + response.status);
				return await response.json();
			} catch (e) {
				console.error('Fallback also failed: ' + e.message);
				return null;
			}
		}
	}

	// i18n: change language
	async function changeLanguage(lang) {
		localStorage.setItem('language', lang);
		document.documentElement.lang = lang;
		const langData = await fetchLanguageData(lang);
		if (langData) updateContent(langData);
	}

	// i18n: initialize — default to Dutch; reset stale 'en' from old site
	async function initializeLanguage() {
		if (!localStorage.getItem('site_v2')) {
			localStorage.removeItem('language');
			localStorage.setItem('site_v2', '1');
		}
		const lang = localStorage.getItem('language') || 'nl';
		await changeLanguage(lang);
	}

	// i18n: language selector click handlers
	function setupLanguageChange() {
		document.querySelectorAll('.language-selector').forEach(selector => {
			selector.addEventListener('click', (e) => {
				e.preventDefault();
				const lang = selector.getAttribute('data-lang');
				if (lang) changeLanguage(lang);
			});
		});
	}

	// Initialize everything on DOM ready
	document.addEventListener('DOMContentLoaded', () => {
		fullHeight();
		contentWayPoint();
		goToTop();
		handleModalClose();
		addJsonLd();
		setupFilterButtons();
		setupNavbarToggle();
		initializeLanguage();
		setupLanguageChange();
	});

}());

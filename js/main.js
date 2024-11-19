;(function () {
	
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	
	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}
	};

	// Parallax
	var parallax = function() {
		$(window).stellar();
	};

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 100, 'easeInOutExpo' );
					});
					
				}, 50);
				
			}

		} , { offset: '85%' } );
	};



	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};

	var pieChart = function() {
		$('.chart').easyPieChart({
			scaleColor: false,
			lineWidth: 4,
			lineCap: 'butt',
			barColor: '#FF9000',
			trackColor:	"#f5f5f5",
			size: 160,
			animate: 1000
		});
	};

	var skillsWayPoint = function() {
		if ($('#fh5co-skills').length > 0 ) {
			$('#fh5co-skills').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( pieChart , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}

	};


	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	// Modal Close Handler
	var handleModalClose = function() {
		$('.modal').on('hidden.bs.modal', function() {
			var $iframe = $(this).find('iframe');
			if ($iframe.length) {
				$iframe.attr('src', $iframe.attr('src'));
			}
		});
	};

	var addJsonLd = function() {
        const jsonLdScript = document.createElement('script');
        jsonLdScript.type = 'application/ld+json';
        jsonLdScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Creative Work",
            "name": "Samuel de Weerd",
            "jobTitle": "Multi-Disciplinary Digital Creator",
            "url": "https://www.samueldeweerd.nl",
            "image": "https://www.samueldeweerd/images/samuel.jpg",
            "sameAs": [
                "https://www.instagram.com/samuel_deweird/",
                "https://www.linkedin.com/in/samuel-de-weerd-8a9717201/",
                "https://github.com/SamueldeWeerd"
            ],
            "worksFor": {
                "@type": "WEB GAME APP ontwikkelaar",
                "name": "DTT"
            }
        });
        document.head.appendChild(jsonLdScript);
    };

	var setupFilterButtons = function() {
		const buttons = document.querySelectorAll('.filter-btn');
		const container = document.querySelector('.portfolio-list'); // Adjust the selector to your container for the `.desc` elements
		const items = Array.from(container.querySelectorAll('.col-md-3.text-center.col-padding.animate-box')); // Use an array for better manipulation
	
		buttons.forEach(button => {
			button.addEventListener('click', () => {
				// Remove active class from all buttons
				buttons.forEach(btn => btn.classList.remove('active'));
				// Add active class to the clicked button
				button.classList.add('active');
	
				const filter = button.getAttribute('data-filter');
	
				// Filter the items
				const filteredItems = items.filter(item => {
					const categories = item.getAttribute('data-category').split(' '); // Split multiple categories
					return filter === 'all' || categories.includes(filter);
				});
	
				// Clear the container
				container.innerHTML = '';
	
				// Add filtered items to the container
				filteredItems.forEach(item => {
					container.appendChild(item); // Append the parent element of `.desc` (e.g., `.col-md-3`)
				});

			});
		});
	};

    var setupNavbarToggle = function() {
        const toggleButton = document.querySelector('.hamburger-icon');
        const navbarItems = document.querySelectorAll('.navbar-item');
        const navbar = document.querySelector('.floating-navbar');

        const toggleNavbar = () => {
            navbar.classList.toggle('hidden');
            navbar.classList.toggle('visible');
        };

        toggleButton.addEventListener('click', toggleNavbar);
        navbarItems.forEach(item => {
            item.addEventListener('click', toggleNavbar);
        });
    };

	// Function to update content based on selected language
    var  updateContent = function(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = langData[key] || `[Missing translation for: ${key}]`;
    });
	}

	var initializeLanguage = async function() {
		const lang = localStorage.getItem('language') || 'en'; // Default to English
		await changeLanguage(lang);
	};

	// Function to set the language preference
	var setLanguagePreference = function(lang) {
    localStorage.setItem('language', lang);
    // location.reload();
	}
	
	// Function to fetch language data
	// Function to fetch language data
	var fetchLanguageData = async function(lang) {
		try {
			const response = await fetch(`translations/${lang}.json`);
			if (!response.ok) {
				throw new Error(`Failed to fetch language data: ${response.status} ${response.statusText}`);
			}
			const data = await response.json();
			console.log(data); // Log the parsed JSON object
			return data;
		} catch (error) {
			console.error(`Error fetching language data: ${error.message}`);
			return null; // Or handle the error in a way that suits your application
		}
	};


	// Function to change language
	var changeLanguage = async function(lang) {
		
    	await setLanguagePreference(lang);
    	const langData = await fetchLanguageData(lang);
		if (langData) {
			updateContent(langData);
		} else {
			console.error('Language data is not available');
		}
		
		console.log('changinglanguage');
	}

	var setupLanguageChange = function() {
		document.querySelectorAll('.language-selector').forEach(button => {
			button.addEventListener('click', event => {
				event.preventDefault();
				const lang = event.target.getAttribute('data-lang');
				console.log(lang);
				changeLanguage(lang);
			});
		});
	}

	$(function(){
		handleModalClose();
		contentWayPoint();
		goToTop();
		loaderPage();
		fullHeight();
		parallax();
		// pieChart();
		skillsWayPoint();
		addJsonLd();
		setupFilterButtons();
		setupNavbarToggle();
		initializeLanguage();
		setupLanguageChange();
	});
}());



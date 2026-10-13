$(document).ready(function () {
	$(document).on("scroll", onScroll);
	$(document).on("scroll", onScrollNavbar);

	$('a[href^="#"]').on('click', function (e) {
		e.preventDefault();
		$(document).off("scroll");

		$('a').each(function () {
			$(this).removeClass('navactive');
		})
		$(this).addClass('navactive');

		var target = this.hash;
		$target = $(target);
		$('html, body').stop().animate({
			'scrollTop': Math.max($target.offset().top - 90, 0) + 2
		}, 500, 'swing', function () {
			window.location.hash = target;
			$(document).on("scroll", onScroll);
			$(document).on("scroll", onScrollNavbar);
		});

		// Close mobile menu on anchor click
		$('.navbar-collapse').collapse('hide');
	});

	// Forms: enviar via WhatsApp (sem backend)
	$('.dj-order__form, .dj-contact__form').on('submit', function (e) {
		e.preventDefault();
		var lines = [this.getAttribute('data-wa-title') || 'Olá!'];
		$(this).find('[name]').each(function () {
			var value = $.trim($(this).val() || '');
			if (!value) return;
			var label = $(this).closest('.dj-field').find('span').first().text() || this.name;
			lines.push(label + ': ' + value);
		});
		window.open('https://wa.me/5511947106616?text=' + encodeURIComponent(lines.join('\n')), '_blank');
	});

	// Init Mixitup
	$('#portfolio').mixitup({
		targetSelector: '.item',
		transitionSpeed: 350
	});

	// Init datepicker
	$("#datepicker").datepicker();
});

function onScroll(event) {
	var scrollPosition = $(document).scrollTop();
	$('.nav li a').each(function () {
		var currentLink = $(this);
		var href = currentLink.attr("href");
		if (!href || href.charAt(0) !== '#') return;
		var refElement = $(href);
		if (refElement.length && refElement.position().top <= scrollPosition + 90 && refElement.position().top + refElement.height() > scrollPosition + 90) {
			$('ul.nav li a').removeClass("navactive");
			currentLink.addClass("navactive");
		} else {
			currentLink.removeClass("navactive");
		}
	});
}

function onScrollNavbar() {
	var scrollTop = $(document).scrollTop();
	if (scrollTop > 80) {
		$('.dj-navbar').addClass('scrolled');
	} else {
		$('.dj-navbar').removeClass('scrolled');
	}
}

import { tns } from "tiny-slider/src/tiny-slider";

document.addEventListener('DOMContentLoaded', () => {
	const sliders = document.querySelectorAll('.tiny-slider');
	sliders.forEach((slider) => {
		const uniqueClass = slider.classList[1]; // Get the unique class
		const gutter = parseInt(slider.dataset.gutter);

		const sliderOptions = {
			container: slider,
			mouseDrag: true,
			autoWidth: true,
			items: slider.querySelectorAll('.tiny-slider-item').length,
			slideBy: 1,
			autoplay: slider.dataset.autoplay === 'true',
			autoplayTimeout: parseInt(slider.dataset.autoplayTimeout),
			speed: parseInt(slider.dataset.speed),
			loop: slider.dataset.loop === 'true',
			nav: slider.dataset.showDots === 'true',
			controls: false,
			responsive: false,
			gutter: gutter,
			autoHeight: true,
			mouseDrag: true,
			// lazyload: true,
			useLocalStorage: true
		};

		// Look for custom arrows
		const prevArrow = document.querySelector(`.${uniqueClass}-prev`);
		const nextArrow = document.querySelector(`.${uniqueClass}-next`);
		if (prevArrow && nextArrow) {
			sliderOptions.controlsContainer = prevArrow.parentElement;
			sliderOptions.controls = true;

			// Set ARIA attributes for controls
			prevArrow.setAttribute('role', 'button');
			prevArrow.setAttribute('aria-label', 'Previous Slide');
			prevArrow.setAttribute('tabindex', '0');

			nextArrow.setAttribute('role', 'button');
			nextArrow.setAttribute('aria-label', 'Next Slide');
			nextArrow.setAttribute('tabindex', '0');
		}

		const tnsSlider = tns(sliderOptions);

	});
});

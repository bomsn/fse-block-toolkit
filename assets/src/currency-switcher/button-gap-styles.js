/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

export default function GapStyles({ blockGap, clientId, contextRef}) {
	useEffect(() => {
		if (!contextRef?.current) {
			console.log("No context reference available for GapStyles");
			return;
		}

		const button = contextRef.current.querySelector(`#block-${clientId}.fse-block-toolkit-currency-switcher__button`);

		if (button && blockGap) {
			let gapValue = blockGap;
			// Handle potential object format for blockGap
			if (typeof blockGap === 'object') {
				const { top, left } = blockGap;
				gapValue = top === left ? top : `${top} ${left}`;
			}

			button.style.setProperty('--wp--style--block-gap', gapValue);
			button.style.gap = `var(--wp--style--block-gap, 0.5em)`;
		}
	}, [blockGap, clientId]);

	return null;
}

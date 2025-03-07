import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const {
		slides, maxHeight, gutter, autoplay, autoplayTimeout,
		speed, loop, showDots, uniqueId
	} = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div
				className={`tiny-slider ${uniqueId}`}
				data-max-height={maxHeight}
				data-gutter={gutter}
				data-autoplay={autoplay}
				data-autoplay-timeout={autoplayTimeout}
				data-speed={speed}
				data-loop={loop}
				data-show-dots={showDots}
			>
				{slides.map((slide) => {
					const aspectRatio = slide.width / slide.height;
					const calculatedWidth = Math.round(maxHeight * aspectRatio);
					return (
						<div key={slide.id} className="tiny-slider-item">
							<img
								className="tns-lazy-img"
								src={slide.url}
								width={calculatedWidth}
								height={maxHeight}
								alt={slide.alt}
								data-id={slide.id}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

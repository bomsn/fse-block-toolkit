import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, Button } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		slides, maxHeight, gutter, autoplay, autoplayTimeout,
		speed, loop, showDots, uniqueId, responsive
	} = attributes;

	useEffect(() => {
		if (!uniqueId) {
			setAttributes({ uniqueId: `tiny-slider-${clientId.slice(0, 8)}` });
		}
	}, []);

	const onSelectImages = (newImages) => {
		console.log(newImages)
		setAttributes({
			slides: newImages.map((image) => ({
				url: image.url,
				alt: image.alt,
				id: image.id.toString(),
				width: image?.sizes?.full?.width,
				height: image?.sizes?.full?.height,
			})),
		});
	};

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title="Slider Settings">
					<RangeControl
						label="Max Slide Height"
						value={maxHeight}
						onChange={(value) => setAttributes({ maxHeight: value })}
						min={50}
						max={1000}
					/>
					<RangeControl
						label="Gutter"
						value={gutter}
						onChange={(value) => setAttributes({ gutter: value })}
						min={0}
						max={100}
					/>
					<ToggleControl
						label="Autoplay"
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
					/>
					{autoplay && (
						<RangeControl
							label="Autoplay Timeout (ms)"
							value={autoplayTimeout}
							onChange={(value) => setAttributes({ autoplayTimeout: value })}
							min={1000}
							max={10000}
							step={500}
						/>
					)}
					<RangeControl
						label="Speed (ms)"
						value={speed}
						onChange={(value) => setAttributes({ speed: value })}
						min={100}
						max={1000}
						step={100}
					/>
					<ToggleControl
						label="Loop"
						checked={loop}
						onChange={(value) => setAttributes({ loop: value })}
					/>
					<ToggleControl
						label="Show Navigation Dots"
						checked={showDots}
						onChange={(value) => setAttributes({ showDots: value })}
					/>
				</PanelBody>
				<PanelBody title="Custom Arrows" initialOpen={true}>
					<p>Use these classes for custom arrows:</p>
					<p>Prev: <code>{uniqueId}-prev</code></p>
					<p>Next: <code>{uniqueId}-next</code></p>
				</PanelBody>
			</InspectorControls>

			<div className="tiny-slider-editor">
				<MediaUploadCheck>
					<MediaUpload
						onSelect={onSelectImages}
						allowedTypes={['image']}
						multiple
						gallery
						value={slides.map((img) => img.id)}
						render={({ open }) => (
							<Button onClick={open} isPrimary>
								{slides.length > 0 ? 'Edit Slides' : 'Add Slides'}
							</Button>
						)}
					/>
				</MediaUploadCheck>

				<div
					className="tiny-slider-preview tiny-slider tns-carousel tns-subpixel tns-calc tns-autowidth tns-horizontal"
					style={{
						display: 'flex',
						flexWrap: 'nowrap',
						margin: `-${gutter / 2}px`
					}}
				>
					{slides.map((slide) => (
						<div
							className="tiny-slider-item tns-item"
							key={slide.id}
							style={{
								flexBasis: `calc(25% - ${gutter}px)`,
								margin: `${gutter / 2}px`,
								overflow: 'hidden',
							}}
						>
							<img
								src={slide.url}
								alt={slide.alt}
								style={{
									maxHeight: `${maxHeight}px`,
									height: `${maxHeight}px`,
									width: 'auto',
									objectFit: 'contain'
								}}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

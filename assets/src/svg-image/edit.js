/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports `useBlockProps` React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 * Also imports `InspectorControls` to define custom settings controls for the block in the Settings Sidebar.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/inspector-controls/README.md
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * Retrieves all the other components we'll be using for this block.
 */
import { PanelBody, TextareaControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';
import { useEffect, RawHTML } from '@wordpress/element';
import { extractSVG } from '../utils/extract-svg';
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {

	const { attributes, setAttributes } = props;

	useEffect(() => {

		const parser = new DOMParser();
		const doc = parser.parseFromString(attributes.html, 'image/svg+xml');
		const svgElement = doc.querySelector('svg');

		if (svgElement) {
			const width = parseInt(svgElement.getAttribute('width')) || attributes.width;
			const height = parseInt(svgElement.getAttribute('height')) || attributes.height;

			if (width !== attributes.width || height !== attributes.height) {
				setAttributes({ width, height });
			}
		}
	}, [attributes.html]);

	const updateSVGSize = (width, height) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(attributes.html, 'image/svg+xml');
		const svgElement = doc.querySelector('svg');

		if (svgElement) {
			svgElement.setAttribute('width', width);
			svgElement.setAttribute('height', height);
			setAttributes({
				html: extractSVG(svgElement.outerHTML),
				width,
				height
			});
		}
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title="Hyperlink">
					<ToggleControl
						label="Enable Hyperlink"
						checked={attributes.link}
						onChange={(value) => setAttributes({ link: value })}
					/>
					{attributes.link && (
						<>
							<TextControl
								label="Link URL"
								value={attributes.linkUrl}
								onChange={(value) => setAttributes({ linkUrl: value })}
							/>
							<TextControl
								label="Link Title"
								value={attributes.linkTitle}
								onChange={(value) => setAttributes({ linkTitle: value })}
							/>
						</>
					)}
				</PanelBody>
				<PanelBody title={__("SVG Code", "fse-block-toolkit")}>
					<TextareaControl
						label="HTML"
						help="Enter SVG code"
						value={attributes.html}
						onChange={(html) => setAttributes({ html })}
						rows={10}
					/>
				</PanelBody>
				<PanelBody title={__("SVG Size", "fse-block-toolkit")}>
					<RangeControl
						label="Width"
						value={attributes.width}
						onChange={(width) => updateSVGSize(width, attributes.height)}
						min={10}
						max={1000}
					/>
					<RangeControl
						label="Height"
						value={attributes.height}
						onChange={(height) => updateSVGSize(attributes.width, height)}
						min={10}
						max={1000}
					/>
				</PanelBody>
			</InspectorControls>
			<div
				{...useBlockProps({
					className: 'fse-block-toolkit-svg',
					style: { width: attributes.width, height: attributes.height }
				})}>
				<RawHTML children={attributes.html} />
			</div>
		</>
	);
}

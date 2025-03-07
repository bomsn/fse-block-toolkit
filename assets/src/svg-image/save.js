/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Retrieves all the other components we'll be using for this block.
 */
import { RawHTML } from '@wordpress/element';
import { extractSVG } from '../utils/extract-svg';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function Save(props) {
	// Extract attributes from the properties object.
	const { attributes } = props;

	// Extract only the SVG from attributes.html
	const svgContent = extractSVG(attributes?.html);

	return (
		<div
			{...useBlockProps.save({
				className: 'fse-block-toolkit-svg',
				style: { width: attributes.width, height: attributes.height }
			})}>
			{attributes.link && attributes.linkUrl ? (
				<a
					href={attributes.linkUrl}
					aria-label={attributes.linkTitle ? attributes.linkTitle : undefined}
				>
					<RawHTML>{svgContent}</RawHTML>
				</a>
			) : (
					<RawHTML>{svgContent}</RawHTML>
			)}
		</div >
	);
}

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { registerFormatType, insert, create } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import {
	Popover,
	TextareaControl,
	TextControl,
	Button,
	SelectControl,
} from '@wordpress/components';
import { extractSVG } from '../utils/extract-svg';

const name = 'fse-block-toolkit/svg-image-format';
const title = __('Inline SVG');

const SVGImageFormat = {
	name,
	title,
	tagName: 'span',
	className: 'inline-svg',
	edit: Edit,
};

function Edit({ value, onChange, isActive, contentRef }) {
	const [isOpen, setIsOpen] = useState(false);
	const [svg, setSvg] = useState('');
	const [width, setWidth] = useState('');
	const [height, setHeight] = useState('');
	const [position, setPosition] = useState('left'); // 'left' or 'right'

	const onTogglePopover = () => setIsOpen((state) => !state);

	// Add the svg to the block after it's been formatted correctly
	const onApply = () => {
		const cleanSvg = extractSVG(svg)
			.replace(/\s+/g, ' ') // Normalize whitespace
			.trim();

		const encodedSvg = encodeURIComponent(cleanSvg)
			.replace(/'/g, '%27')
			.replace(/"/g, '%22');

		// Set margin based on position
		const margin = position === 'left' ? 'margin-right: 8px;' : 'margin-left: 8px;';
		const svgStyle = `display: inline-block; background-image: url('data:image/svg+xml,${encodedSvg}'); width: ${width}px; height: ${height}px; background-size: contain; background-repeat: no-repeat; vertical-align: middle; position: relative; top: -1px; ${margin}`;
		
		// Create a standalone SVG element with a zero-width space to ensure it doesn't collapse
		const svgHtml = `<span class="inline-svg" contenteditable="false" style="${svgStyle}">&#8203;</span>`;
		
		// Insert the SVG span at the current selection
		const newValue = insert(
			value,
			create({
				html: svgHtml,
			})
		);

		onChange(newValue);
		setIsOpen(false);
	};

	// Make sure to extract the width and height from the svg as soon as `svg` variable is set.
	// Once extracted, we will set the value of `Width` and `Height` field automatically.
	useEffect(() => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svg, 'image/svg+xml');
		const svgElement = doc.querySelector('svg');

		if (svgElement) {
			const width = parseInt(svgElement.getAttribute('width')) || '20';
			const height = parseInt(svgElement.getAttribute('height')) || '20';

			setWidth(width);
			setHeight(height);
		}
	}, [svg]);

	return (
		<>
			<RichTextToolbarButton
				icon="embed-generic"
				title={title}
				onClick={onTogglePopover}
				isActive={isActive}
			/>
			{isOpen && (
				<Popover
					onClose={() => setIsOpen(false)}
					anchor={contentRef.current}
					placement="bottom"
					offset={8}
					className="inline-svg-popover"
				>
					<div style={{ padding: '16px', minWidth: '300px' }}>
						<TextareaControl
							label={__('SVG Code')}
							value={svg}
							onChange={setSvg}
							rows={10}
						/>
						<TextControl
							label={__('Width')}
							value={width}
							onChange={setWidth}
						/>
						<TextControl
							label={__('Height')}
							value={height}
							onChange={setHeight}
						/>
						<SelectControl
							label={__('Position')}
							value={position}
							options={[
								{ label: __('Left of text'), value: 'left' },
								{ label: __('Right of text'), value: 'right' },
							]}
							onChange={setPosition}
						/>
						<Button
							variant='primary'
							onClick={onApply}
							style={{ marginTop: '8px' }}
						>
							{__('Insert SVG')}
						</Button>
					</div>
				</Popover>
			)}
		</>
	);
}

registerFormatType(name, SVGImageFormat);

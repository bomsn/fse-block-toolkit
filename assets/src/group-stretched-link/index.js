/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';


/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';


// modify the block registration to add our custom attribute
function addStretchedLinkAttribute(settings, name) {
	if (name !== 'core/group') {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			stretchedLink: {
				type: 'boolean',
				default: false,
			},
			stretchedLinkUrl: {
				type: 'string',
				default: '',
			},
		},
	};
}
addFilter('blocks.registerBlockType', 'fse-block-toolkit/add-stretched-link-attribute', addStretchedLinkAttribute );


// Modify the block editor to insert additional controls for adding a URL
const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;

		if (name !== 'core/group') {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title="Stretched Link">
						<ToggleControl
							label="Enable Stretched Link"
							checked={attributes.stretchedLink}
							onChange={(value) => setAttributes({ stretchedLink: value })}
						/>
						{attributes.stretchedLink && (
							<TextControl
								label="Link URL"
								value={attributes.stretchedLinkUrl}
								onChange={(value) => setAttributes({ stretchedLinkUrl: value })}
							/>
						)}
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControls');

addFilter('editor.BlockEdit', 'fse-block-toolkit/add-stretched-link-controls', withInspectorControls);

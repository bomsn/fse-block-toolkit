/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __unstableStripHTML as stripHTML } from '@wordpress/dom';
import { escapeHTML } from '@wordpress/escape-html';
import { safeDecodeURI } from '@wordpress/url';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { ComboboxControl, PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { Path, SVG } from '@wordpress/components';

const ItemSubmenuIcon = () => (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
	>
		<Path d="M1.50002 4L6.00002 8L10.5 4" strokeWidth="1.5" />
	</SVG>
);
/**
 * Link Control onChange handler that updates block attributes when a setting is changed.
 *
 * @param {Object}                          updatedValue    New block attributes to update.
 * @param {Function}                        setAttributes   Block attribute update function.
 * @param {WPNavigationLinkBlockAttributes} blockAttributes Current block attributes.
 */

const updateAttributes = (
	updatedValue = {},
	setAttributes,
	blockAttributes = {}
) => {
	const {
		label: originalLabel = '',
		kind: originalKind = '',
		type: originalType = '',
	} = blockAttributes;

	const {
		title: newLabel = '', // the title of any provided Post.
		url: newUrl = '',
		opensInNewTab,
		id,
		kind: newKind = originalKind,
		type: newType = originalType,
	} = updatedValue;

	const newLabelWithoutHttp = newLabel.replace(/http(s?):\/\//gi, '');
	const newUrlWithoutHttp = newUrl.replace(/http(s?):\/\//gi, '');

	const useNewLabel =
		newLabel &&
		newLabel !== originalLabel &&
		// LinkControl without the title field relies
		// on the check below. Specifically, it assumes that
		// the URL is the same as a title.
		// This logic a) looks suspicious and b) should really
		// live in the LinkControl and not here. It's a great
		// candidate for future refactoring.
		newLabelWithoutHttp !== newUrlWithoutHttp;

	// Unfortunately this causes the escaping model to be inverted.
	// The escaped content is stored in the block attributes (and ultimately in the database),
	// and then the raw data is "recovered" when outputting into the DOM.
	// It would be preferable to store the **raw** data in the block attributes and escape it in JS.
	// Why? Because there isn't one way to escape data. Depending on the context, you need to do
	// different transforms. It doesn't make sense to me to choose one of them for the purposes of storage.
	// See also:
	// - https://github.com/WordPress/gutenberg/pull/41063
	// - https://github.com/WordPress/gutenberg/pull/18617.
	const label = useNewLabel
		? escapeHTML(newLabel)
		: originalLabel || escapeHTML(newUrlWithoutHttp);

	// In https://github.com/WordPress/gutenberg/pull/24670 we decided to use "tag" in favor of "post_tag"
	const type = newType === 'post_tag' ? 'tag' : newType.replace('-', '_');

	const isBuiltInType =
		['post', 'page', 'tag', 'category'].indexOf(type) > -1;

	const isCustomLink =
		(!newKind && !isBuiltInType) || newKind === 'custom';
	const kind = isCustomLink ? 'custom' : newKind;

	setAttributes({
		// Passed `url` may already be encoded. To prevent double encoding, decodeURI is executed to revert to the original string.
		...(newUrl && { url: encodeURI(safeDecodeURI(newUrl)) }),
		...(label && { label }),
		...(undefined !== opensInNewTab && { opensInNewTab }),
		...(id && Number.isInteger(id) && { id }),
		...(kind && { kind }),
		...(type && type !== 'URL' && { type }),
	});
};

export default function Edit({ attributes, setAttributes, context }) {
	const { menuSlug, label, url, description, title, rel } = attributes;
	const { showSubmenuIcon, openSubmenusOnClick } = context;
	// Fetch all template parts.
	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{ per_page: -1 }
	);

	let menuOptions = [];

	// Filter the template parts for those in the 'menu' area.
	if (hasResolved) {
		menuOptions = records
			.filter((item) => item.area === 'menu')
			.map((item) => ({
				label: item.title.rendered,
				value: item.slug,
			}));
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings')} initialOpen={true}>
					<ComboboxControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Menu Template', 'mega-menu-block')}
						value={menuSlug}
						options={menuOptions}
						onChange={(slugValue) =>
							setAttributes({ menuSlug: slugValue })
						}
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={label ? stripHTML(label) : ''}
						onChange={(labelValue) => {
							setAttributes({ label: labelValue });
						}}
						label={__('Text', 'fse-block-toolkit')}
						autoComplete="off"
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={url ? safeDecodeURI(url) : ''}
						onChange={(urlValue) => {
							updateAttributes(
								{ url: urlValue },
								setAttributes,
								attributes
							);
						}}
						label={__('Link')}
						autoComplete="off"
					/>
					<TextareaControl
						__nextHasNoMarginBottom
						value={description || ''}
						onChange={(descriptionValue) => {
							setAttributes({ description: descriptionValue });
						}}
						label={__('Description')}
						help={__(
							'The description will be displayed in the menu if the current theme supports it.'
						)}
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={title || ''}
						onChange={(titleValue) => {
							setAttributes({ title: titleValue });
						}}
						label={__('Title attribute')}
						autoComplete="off"
						help={__(
							'Additional information to help clarify the purpose of the link.'
						)}
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={rel || ''}
						onChange={(relValue) => {
							setAttributes({ rel: relValue });
						}}
						label={__('Rel attribute')}
						autoComplete="off"
						help={__(
							'The relationship of the linked URL as space-separated link types.'
						)}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps({ className: 'wp-block-navigation-item wp-block-navigation-submenu has-child' })}>
				<a className="wp-block-navigation-item__content">
					<RichText
						identifier="label"
						className="wp-block-navigation-item__label"
						value={label}
						onChange={(labelValue) =>
							setAttributes({ label: labelValue })
						}
						aria-label={__('Navigation link text', 'fse-block-toolkit')}
						placeholder={__('Add label…', 'fse-block-toolkit')}
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/image',
							'core/strikethrough',
						]}
					/>
				</a>
				{(showSubmenuIcon || openSubmenusOnClick) && (
					<span className="wp-block-navigation__submenu-icon wp-block-navigation-submenu__toggle">
						<ItemSubmenuIcon />
					</span>
				)}
			</div>
		</>
	);
}

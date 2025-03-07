/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Wordpress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * Return null from the save function, because we need to use a dynamic block.
	 * https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/creating-dynamic-blocks/
	 */
	save: () => null,
});


/**
 * Make the Mega Menu Block available to Navigation blocks.
 *
 * @param {Object} blockSettings The original settings of the block.
 * @param {string} blockName     The name of the block being modified.
 * @return {Object} The modified settings for the Navigation block or the original settings for other blocks.
 */
const addToNavigation = (blockSettings, blockName) => {
	if (blockName === 'core/navigation') {
		return {
			...blockSettings,
			allowedBlocks: [
				...(blockSettings.allowedBlocks ?? []),
				metadata.name,
			],
		};
	}
	return blockSettings;
};
addFilter('blocks.registerBlockType', 'add-mega-menu-block-to-navigation', addToNavigation);

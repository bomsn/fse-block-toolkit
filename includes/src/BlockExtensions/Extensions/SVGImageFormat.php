<?php

namespace FSE\BlockToolkit\BlockExtensions\Extensions;

use FSE\BlockToolkit\BlockExtensions\Abstracts\AbstractExtension;

/**
 * SVGImageFormat class
 *
 * Register a new block format.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/format-api/
 */
class SVGImageFormat extends AbstractExtension {
	/**
	 * The name of the target block this extension applies to.
	 * This will be null since this is a format and not a block extension.
	 *
	 * @var string
	 */
	protected $target_name = null;

	/**
	 * The name of this extension.
	 *
	 * @var string
	 */
	protected $name = 'svg-image-format';

	/**
	 * Define which assets are available for this extension.
	 *
	 * This method specifies the CSS and JS files that this extension uses.
	 * It overrides the parent method to only include the necessary assets.
	 *
	 * @return array An associative array of asset types and their corresponding filenames.
	 */
	protected function get_available_assets() {
		return array(
			'editor_script' => 'index.js',        // JS for the editor only
		);
	}
}

<?php

namespace FSE\BlockToolkit\BlockExtensions\Extensions;

use FSE\BlockToolkit\BlockExtensions\Abstracts\AbstractExtension;

/**
 * GroupStretchedLink class
 *
 * This class extends the functionality of the core/group block
 * to include a stretched link feature.
 */
class GroupStretchedLink extends AbstractExtension {
	/**
	 * The name of the target block this extension applies to.
	 *
	 * @var string
	 */
	protected $target_name = 'core/group';

	/**
	 * The name of this extension.
	 *
	 * @var string
	 */
	protected $name = 'group-stretched-link';

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
			'block_style'   => 'style-index.css', // CSS for both editor and frontend
			'editor_script' => 'index.js',        // JS for the editor only
		);
	}

	/**
	 * Modify the block content to implement the stretched link functionality.
	 *
	 * This method is called for each instance of the core/group block in the content.
	 * It checks if the stretchedLink attribute is set and true, and if so,
	 * it modifies the block content to implement the stretched link feature.
	 *
	 * @param string $block_content The original content of the block.
	 * @param array  $block         The block's attributes and other data.
	 *
	 * @return string The modified block content.
	 */
	public function get_modified_block_content( $block_content, $block ): string {
		// Check if the stretchedLink attribute is set and true
		if ( ! isset( $block['attrs']['stretchedLink'] ) || ! $block['attrs']['stretchedLink'] || empty( $block['attrs']['stretchedLinkUrl'] ) ) {
			// If not, return the original content without modification
			return $block_content;
		}

		$url = isset( $block['attrs']['stretchedLinkUrl'] ) ? esc_url( $block['attrs']['stretchedLinkUrl'] ) : '#';

		// Create WP_HTML_Processor instance
		$content = new \WP_HTML_Tag_Processor( $block_content );

		// Add class to the block wrapper
		if ( $content->next_tag() ) {
			$content->add_class( 'wp-block-group-stretched-link' );
		}

		// Get the modified HTML
		$modified_content = (string) $content;

		// Manually insert the link at the beginning of the content
		$link_html        = sprintf( '<a href="%s" class="wp-block-group-stretched-link__link"></a>', $url );
		$modified_content = preg_replace( '/<div([^>]*)>/', '<div$1>' . $link_html, $modified_content, 1 );

		return $modified_content;
	}
}

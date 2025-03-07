<?php

/**
 * Main class for initializing and managing block registrations and text domain loading.
 *
 * This class sets up the necessary hooks for loading translations, registering custom blocks
 * and extensions, and managing block categories and template part areas.
 *
 * @package FSE\BlockToolkit
 */

namespace FSE\BlockToolkit;

use FSE\BlockToolkit\Assets\AssetManager;
use FSE\BlockToolkit\BlockTypes\BlockManager;
use FSE\BlockToolkit\BlockExtensions\ExtensionManager;

/**
 * Main initialization class for the FSE Block Toolkit plugin.
 */
class Bootstrap {
	/**
	 * Initializes the plugin's functionality by setting up hooks and initializing asset manager.
	 *
	 * @return void
	 */
	public function init() {
		// Set up plugin-specific hooks and actions.
		$this->define_hooks();

		// Create a new instance of BlockManager to handle block registrations.
		new BlockManager();

		// Create a new instance of ExtensionManager to manage block extensions ( extending existing blocks ).
		new ExtensionManager();

		// Initialize the singleton instance of AssetManager and set up its hooks.
		AssetManager::get_instance()->init();
	}

	/**
	 * Defines WordPress hooks for the plugin functionality.
	 *
	 * This includes loading text domains, registering blocks, and customizing block categories
	 * and template parts.
	 *
	 * @return void
	 */
	private function define_hooks() {
		add_action( 'init', array( $this, 'load_textdomain' ) );
		add_action( 'block_categories_all', array( $this, 'block_categories' ) );
		add_action( 'default_wp_template_part_areas', array( $this, 'template_part_areas' ) );
	}

	/**
	 * Loads the text domain for translation.
	 *
	 * This function ensures that all plugin strings can be translated into different languages.
	 *
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'fse-block-toolkit', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
		load_muplugin_textdomain( FSE_BLOCKS_TOOLKIT_METADATA['TextDomain'], dirname( plugin_basename( FSE_BLOCKS_TOOLKIT_PATH ) ) . FSE_BLOCKS_TOOLKIT_METADATA['DomainPath'] );

		foreach ( glob( FSE_BLOCKS_TOOLKIT_PATH . 'assets/build/*', GLOB_ONLYDIR ) as $block_dir ) {
			$block_name = basename( $block_dir );
			wp_set_script_translations(
				generate_block_asset_handle( "fse-block-toolkit/$block_name", 'editorScript' ),
				FSE_BLOCKS_TOOLKIT_METADATA['TextDomain'],
				untrailingslashit( FSE_BLOCKS_TOOLKIT_PATH ) . FSE_BLOCKS_TOOLKIT_METADATA['DomainPath']
			);
		}
	}
	/**
	 * Adds a custom block category for the blocks managed by this plugin.
	 *
	 * This function extends the existing block categories to include a custom category for easier
	 * management and identification in the block editor.
	 *
	 * @param array $block_categories Existing block categories.
	 *
	 * @return array Modified list of block categories with the custom category added.
	 */
	public function block_categories( $block_categories ) {
		$block_categories[] = array(
			'slug'  => 'custom',
			'title' => esc_html__( 'Custom Blocks', 'fse-block-toolkit' ),
		);

		return $block_categories;
	}

	/**
	 * Adds custom template part areas to the list of template part areas in the block editor.
	 *
	 * This method introduces new areas for template parts, facilitating specific layout designs
	 * and functionalities, like mega menus.
	 *
	 * @param array $areas Existing template part areas.
	 *
	 * @return array Enhanced list of template part areas with custom additions.
	 */
	public function template_part_areas( array $areas ): array {
		$areas[] = array(
			'area'        => 'menu',
			'area_tag'    => 'section',
			'description' => __( 'Menu templates are used to create sections of a mega menu.', 'fse-block-toolkit' ),
			'icon'        => 'layout',
			'label'       => __( 'Mega Menu', 'fse-block-toolkit' ),
		);

		return $areas;
	}
}

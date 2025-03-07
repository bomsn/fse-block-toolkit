<?php

namespace FSE\BlockToolkit\BlockExtensions;

/**
 * Class ExtensionManager
 *
 * Manages the detection, initialization, and application of block extensions.
 * This class is responsible for dynamically loading extensions, registering their assets,
 * and modifying block content based on the loaded extensions.
 */
class ExtensionManager {
	private $extensions = array();

	/**
	 * Initializes the ExtensionManager and sets up hooks for block modification.
	 *
	 * Registers an action to modify the rendering of blocks based on defined extensions.
	 */
	public function __construct() {
		$this->detect_extensions_and_maybe_register_assets();

		add_action( 'render_block', array( $this, 'modify_original_block' ), 10, 2 );
	}

	/**
	 * Detects and initializes block extensions, and registers their assets.
	 *
	 * It scans a specific directory for PHP files that define block extensions,
	 * instantiates each one, and calls their asset registration methods.
	 *
	 * @return void
	 */
	private function detect_extensions_and_maybe_register_assets() {
		$extension_files = glob( FSE_BLOCKS_TOOLKIT_PATH . 'includes/src/BlockExtensions/Extensions/*.php' );

		foreach ( $extension_files as $file ) {
			$class_name = '\\FSE\BlockToolkit\\BlockExtensions\\Extensions\\' . basename( $file, '.php' );
			if ( class_exists( $class_name ) ) {
				$extension          = new $class_name();
				$this->extensions[] = $extension;
				$extension->register_assets();
			}
		}
	}

	/**
	 * Modifies the content of blocks during the render process if applicable extensions exist.
	 *
	 * This function iterates through all registered extensions and applies modifications
	 * to the block's content if the extension is applicable to the block type.
	 *
	 * @param string $block_content The original content of the block.
	 * @param array  $block         The block instance and its properties.
	 *
	 * @return string Modified block content.
	 */
	public function modify_original_block( $block_content, $block ) {
		foreach ( $this->extensions as $extension ) {
			if ( $extension->applies_to_block( $block ) ) {
				$block_content = $extension->get_modified_block_content( $block_content, $block );
			}
		}
		return $block_content;
	}
}

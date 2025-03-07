<?php

namespace FSE\BlockToolkit\BlockExtensions\Abstracts;

use FSE\BlockToolkit\Assets\AssetManager;

/**
 * Abstract class for block extensions.
 */
abstract class AbstractExtension {

	/**
	 * The name of the target block.
	 *
	 * @var string|null
	 */
	protected $target_name = null;

	/**
	 * The name of the extension.
	 *
	 * @var string|null
	 */
	protected $name = null;

	/**
	 * Asset manager instance.
	 *
	 * @var AssetManager
	 */
	protected $asset_manager;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->asset_manager = AssetManager::get_instance();
	}

	/**
	 * Get the extension name.
	 *
	 * @return string The extension name.
	 */
	public function get_extension_name() {
		return $this->name ?? $this->name = $this->generate_extension_name(); // phpcs:ignore
	}

	/**
	 * Get the target block name.
	 *
	 * @return string|null The target block name.
	 */
	public function get_target_block_name() {
		return $this->target_name;
	}

	/**
	 * Check if this extension applies to a given block.
	 *
	 * @param array $block The block to check.
	 *
	 * @return boolean True if the extension applies to the block, false otherwise.
	 */
	public function applies_to_block( $block ): bool {
		return ! is_null( $block['blockName'] ) && $block['blockName'] === $this->get_target_block_name();
	}

	/**
	 * Define which assets are available for this extension.
	 * Override this in child classes to specify available assets.
	 *
	 * @return array
	 */
	protected function get_available_assets() {
		return array(
			'block_script'  => 'script.js',
			'block_style'   => 'style-index.css',
			'editor_script' => 'index.js',
			'editor_style'  => 'index.css',
			'view_script'   => 'frontend.js',
			'view_style'    => 'frontend.css',
		);
	}
	/**
	 * Get the modified block content.
	 *
	 * @param string $block_content The original block content.
	 * @param array  $block         The block data.
	 *
	 * @return string The modified block content.
	 *
	 * @phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
	 */
	public function get_modified_block_content( $block_content, $block ): string {
		return $block_content;
	}


	/**
	 * Register assets for this extension.
	 *
	 * @return void
	 */
	public function register_assets() {
		$available_assets = $this->get_available_assets();

		foreach ( $available_assets as $asset_type => $filename ) {
			$context = $this->get_asset_context( $asset_type );
			$this->register_asset( $asset_type, $filename, $context );
		}
	}

	/**
	 * Get the context for a given asset type.
	 *
	 * @param string $asset_type The asset type which is supposed to be prefixed by an indication of the asset context.
	 *
	 * @return string
	 */
	protected function get_asset_context( $asset_type ) {
		if ( strpos( $asset_type, 'editor_' ) === 0 ) {
			return 'editor';
		} elseif ( strpos( $asset_type, 'view_' ) === 0 ) {
			return 'frontend';
		}
		return 'both';
	}

	/**
	 * Register an individual asset.
	 *
	 * @param string $asset_type The type of asset (e.g., 'editor_script', 'view_style').
	 * @param string $filename   The filename of the asset.
	 * @param string $context    The context in which to load the asset ('frontend', 'editor', 'both').
	 *
	 * @return void
	 */
	protected function register_asset( $asset_type, $filename, $context ) {
		$relative_path = "assets/build/{$this->get_extension_name()}/$filename";
		$full_path     = FSE_BLOCKS_TOOLKIT_PATH . $relative_path;

		if ( ! file_exists( $full_path ) ) {
			return; // Asset doesn't exist, so don't register it
		}

		$handle   = $this->get_extension_name() . '-' . str_replace( '_', '-', $asset_type );
		$is_style = strpos( $asset_type, 'style' ) !== false;

		if ( $is_style ) {
			$this->asset_manager->add_style( $handle, $relative_path, array(), false, 'all', $context );
		} else {
			$this->asset_manager->add_script( $handle, $relative_path, array(), false, true, $context );
		}
	}

	/**
	 * Generate the extension name from the class name.
	 *
	 * @return string The generated extension name.
	 */
	protected function generate_extension_name() {
		$class_name = get_class( $this );
		$parts      = explode( '\\', $class_name );
		return strtolower( preg_replace( '/(?<!^)[A-Z]/', '-$0', end( $parts ) ) );
	}
}

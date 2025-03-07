<?php

namespace FSE\BlockToolkit\BlockTypes\Abstracts;

use FSE\BlockToolkit\Assets\AssetManager;

/**
 * Abstract class for heavy frontend blocks that require lazy loading.
 */
abstract class HeavyFrontendBlock extends AbstractBlock {

	/**
	 * The handle for the main script of this block.
	 *
	 * @var string
	 */
	protected $script_handle;

	/**
	 * The file path of the main script relative to the plugin directory.
	 *
	 * @var string
	 */
	protected $script_path;

	/**
	 * The list of scripts to lazy load, this is built automatically with `$this->get_dependencies_data`.
	 *
	 * @var array
	 */
	private $scripts_to_lazy_load = array();

	/**
	 * Modifies the block type arguments.
	 * This is done mainly to set `view_script` & `view_script_handles` to false,
	 * to prevent WordPress from automatically loading the frontend scripts for the currenct block.
	 *
	 * @param array  $args       The original block type arguments.
	 * @param string $block_name The name of the block.
	 *
	 * @return array Modified block type arguments.
	 */
	abstract public function modify_block_type_args( $args, $block_name );

	/**
	 * Registers assets for the block.
	 *
	 * @return void
	 */
	public function register_assets() {
		$this->register_lazy_load_script();
	}

	/**
	 * Registers the lazy load script for this block.
	 *
	 * @return void
	 *
	 * @phpcs:disable Squiz.PHP.CommentedOutCode.Found
	 */
	protected function register_lazy_load_script() {

		if ( ! $this->script_handle || ! $this->script_path ) {
			return;
		}

		$asset_manager = AssetManager::get_instance();
		$script_data   = $this->get_script_data( $this->script_path );

		$this->prepare_scripts_to_lazy_load( $script_data['dependencies'] );

		// TODO: we might want to load the parent script itself in the future, so we'll have different logic for this
		// where we add the main script to the lazy load list, then use `wp_footer` to write the list to the footer
		// in the `AssetManager`, following that, we'll have a main lazy loader script responsible for managing the whole thing.
		// Other approach is to have lazy-loader enqueued in the frontend by default and attach the inline scripts to it.

		// // Add the main script to the lazy load list.
		// $scripts_to_lazy_load[ $this->script_handle ] = array(
		// 'src'          => $script_data['src'],
		// 'version'      => $script_data['version'],
		// 'version'      => $script_data['version'],
		// 'translations' => '', // TODO: Implement translations handling.
		// );

		// Prepare JS variable name
		$class_name = get_class( $this );
		$parts      = explode( '\\', $class_name );
		$var        = preg_replace( '/(?<!^)[A-Z]/', '$0', end( $parts ) );

		// Register the parent script, which will handle lazy loading its own dependencies
		// We'll leave the dependencies array empty so that we can lazy load them later.
		// We'll also pass the script src url instead of path to avoid triggering `AssetManager::get_script_data`
		// inside `AssetManager::add_script` as this will automatically populate dependecies,
		// which is what we are trying to avoid.
		$src_url = trailingslashit( FSE_BLOCKS_TOOLKIT_URL ) . $this->script_path;
		$asset_manager->add_script( $this->script_handle, $src_url, array(), FSE_BLOCKS_TOOLKIT_METADATA['Version'], true, 'frontend' );
		// $asset_manager->add_script( $this->script_handle, $this->script_path, array(), FSE_BLOCKS_TOOLKIT_METADATA['Version'], true, 'frontend' );
		// Register the inline script that will hold the lazy load data.
		$data          = rawurlencode( wp_json_encode( $this->scripts_to_lazy_load ) );
		$inline_script = 'var ' . $var . "LazyLoadDeps = JSON.parse( decodeURIComponent( '" . esc_js( $data ) . "' ) );";

		$asset_manager->add_inline_script(
			$this->script_handle,
			$inline_script,
			'before',
			'frontend'
		);
	}
	/**
	 * Retrieves script data using the AssetManager.
	 *
	 * @param string $relative_path The relative path to the script.
	 *
	 * @return array Script data including src, version, and dependencies.
	 */
	protected function get_script_data( $relative_path ) {
		return AssetManager::get_instance()->get_script_data( $relative_path );
	}
	/**
	 * Retrieves dependency data for the given scripts.
	 *
	 * @param array $dependencies An array of script handles to process.
	 *
	 * @return void
	 */
	protected function prepare_scripts_to_lazy_load( $dependencies ) {
		$processed = array();

		// Start output buffering to capture any unexpected output
		ob_start();

		$this->process_dependencies_recursively( $dependencies, $processed );

		// Discard any unexpected output
		ob_end_clean();
	}
	/**
	 * Recursive function to process dependecies and make sure sub dependecies are also processed.
	 *
	 * @param array $dependencies An array of script handles to process.
	 * @param array $processed    An array of previously processed handles to avoid procecssing them again.
	 *
	 * @return void
	 */
	private function process_dependencies_recursively( $dependencies, &$processed ) {
		$wp_scripts = wp_scripts();

		foreach ( $dependencies as $handle ) {
			if ( ! isset( $processed[ $handle ] ) && isset( $wp_scripts->registered[ $handle ] ) ) {
				$processed[ $handle ] = true;

				$script = $wp_scripts->registered[ $handle ];

				// Process this script's dependencies first
				if ( ! empty( $script->deps ) ) {
					$this->process_dependencies_recursively( $script->deps, $processed );
				}

				// Capture 'before' scripts
				$before = $wp_scripts->get_inline_script_data( $handle, 'before' );

				// Process the main script
				$this->capture_script_data( $handle );

				// Capture 'after' scripts
				$after = $wp_scripts->get_inline_script_data( $handle, 'after' );

				// Store the captured data
				$this->scripts_to_lazy_load[ $handle ]['before'] = $before;
				$this->scripts_to_lazy_load[ $handle ]['after']  = $after;
			}
		}
	}
	/**
	 * Captures script data for a given handle and stores it in the `scripts_to_lazy_load` array.
	 *
	 * @param string $handle The script handle to capture data for.
	 *
	 * @return void
	 */
	private function capture_script_data( $handle ) {
		$script = wp_scripts()->registered[ $handle ];

		if ( ! isset( $this->scripts_to_lazy_load[ $handle ] ) ) {
			$this->scripts_to_lazy_load[ $handle ] = array(
				'src'          => $this->get_script_src( $script ),
				'version'      => $script->ver,
				'translations' => wp_scripts()->print_translations( $handle, false ),
			);
		}
	}
	/**
	 * Retrieves the source URL for a given script.
	 *
	 * @param object $script The script object to get the source URL for.
	 *
	 * @return string The full URL of the script source.
	 */
	private function get_script_src( $script ) {
		$site_url = site_url() ?? wp_guess_url();
		return preg_match( '|^(https?:)?//|', $script->src ) ? $script->src : $site_url . $script->src;
	}
}

<?php
/**
 * Asset manager for handling scripts and styles registration and enqueueing.
 *
 * Handles the operations of registering, enqueueing, and printing scripts and styles,
 * including inline and lazy-load scripts for optimized performance.
 *
 * @package FSE\BlockToolkit\Assets
 */

namespace FSE\BlockToolkit\Assets;

/**
 * Class AssetManager manages scripts and styles for the application.
 *
 * Implements singleton pattern to ensure only one instance of the asset manager is used.
 */
class AssetManager {
	/**
	 * Holds the class instance.
	 *
	 * @var AssetManager|null $instance Singleton instance of AssetManager.
	 */
	private static $instance = null;

	/**
	 * Array of scripts to be registered.
	 *
	 * @var array $scripts Registered scripts.
	 */
	private $scripts = array();

	/**
	 * Array of styles to be registered.
	 *
	 * @var array $styles Registered styles.
	 */
	private $styles = array();

	/**
	 * Array of inline scripts.
	 *
	 * @var array $inline_scripts Inline scripts associated with handles.
	 */
	private $inline_scripts = array();

	/**
	 * Array of inline styles.
	 *
	 * @var array $inline_styles Inline styles associated with handles.
	 */
	private $inline_styles = array();

	/**
	 * Constructor for AssetManager.
	 *
	 * The constructor is private to prevent creating multiple instances of the singleton.
	 */
	private function __construct() {}

	/**
	 * Retrieves the singleton instance of AssetManager.
	 *
	 * @return AssetManager Returns the singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Initializes the asset manager actions.
	 *
	 * Hooks into WordPress to register script and style enqueue actions.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ), 99 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ), 99 );
		add_action( 'wp_print_footer_scripts', array( $this, 'print_inline_frontend_scripts' ), 2 );
	}

	/**
	 * Adds a script to the list of scripts to be registered.
	 *
	 * @param string  $handle    Script handle.
	 * @param string  $src       Script source URL or relative path to the script.
	 * @param array   $deps      Array of script dependencies.
	 * @param mixed   $ver       Script version number or boolean false.
	 * @param boolean $in_footer Whether to enqueue the script in the footer.
	 * @param string  $context   The context in which to load the script ('frontend', 'editor', 'both').
	 *
	 * @return void
	 *
	 * @phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
	 */
	public function add_script( $handle, $src = '', $deps = array(), $ver = false, $in_footer = false, $context = 'both' ) {
		$this->scripts[ $handle ] = compact( 'handle', 'src', 'deps', 'ver', 'in_footer', 'context' );
		if ( ! filter_var( $src, FILTER_VALIDATE_URL ) ) {
			$script_data                      = $this->get_script_data( $src, $deps );
			$this->scripts[ $handle ]['src']  = $script_data['src'];
			$this->scripts[ $handle ]['deps'] = $script_data['dependencies'];
			$this->scripts[ $handle ]['ver']  = $script_data['version'];
		}
	}
	/**
	 * Adds a style to the list of styles to be registered.
	 *
	 * @param string $handle  Style handle.
	 * @param string $src     Style source URL or a relative path.
	 * @param array  $deps    Array of style dependencies.
	 * @param mixed  $ver     Style version number or boolean false.
	 * @param string $media   Media for which the style is defined.
	 * @param string $context The context in which to load the style ('frontend', 'editor', 'both').
	 *
	 * @return void
	 *
	 * @phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
	 */
	public function add_style( $handle, $src = '', $deps = array(), $ver = false, $media = 'all', $context = 'both' ) {
		if ( ! filter_var( $src, FILTER_VALIDATE_URL ) ) {
			$src = trailingslashit( FSE_BLOCKS_TOOLKIT_URL ) . $src;
		}
		if ( ! $ver ) {
			$ver = FSE_BLOCKS_TOOLKIT_METADATA['Version'];
		}
		$this->styles[ $handle ] = compact( 'handle', 'src', 'deps', 'ver', 'media', 'context' );
	}
	/**
	 * Adds an inline script associated with a script handle.
	 *
	 * @param string $handle   Script handle.
	 * @param string $data     Inline script content.
	 * @param string $position Position to insert the inline script ('after' or 'before').
	 *
	 * @return void
	 */
	public function add_inline_script( $handle, $data, $position = 'after' ) {
		$this->inline_scripts[ $handle ] = compact( 'handle', 'data', 'position' );
	}

	/**
	 * Adds inline styles associated with a style handle.
	 *
	 * @param string $handle Style handle.
	 * @param string $data   Inline style content.
	 *
	 * @return void
	 */
	public function add_inline_style( $handle, $data ) {
		$this->inline_styles[ $handle ] = compact( 'handle', 'data' );
	}

	/**
	 * Enqueues registered scripts and styles for the frontend.
	 *
	 * Iterates over registered scripts and styles to enqueue them.
	 *
	 * @return void
	 */
	public function enqueue_block_assets() {
		foreach ( $this->scripts as $script ) {
			if ( in_array( $script['context'], array( 'frontend', 'both' ), true ) ) {
				wp_enqueue_script( $script['handle'], $script['src'], $script['deps'], $script['ver'], $script['in_footer'] );
			}
		}

		foreach ( $this->styles as $style ) {
			if ( in_array( $style['context'], array( 'frontend', 'both' ), true ) ) {
				wp_enqueue_style( $style['handle'], $style['src'], $style['deps'], $style['ver'], $style['media'] );
			}
		}
	}

	/**
	 * Enqueues registered scripts and styles for the block editor.
	 *
	 * Iterates over registered scripts and styles to enqueue them.
	 *
	 * @return void
	 */
	public function enqueue_block_editor_assets() {
		foreach ( $this->scripts as $script ) {
			if ( in_array( $script['context'], array( 'editor', 'both' ), true ) ) {
				wp_enqueue_script( $script['handle'], $script['src'], $script['deps'], $script['ver'], $script['in_footer'] );
			}
		}

		foreach ( $this->styles as $style ) {
			if ( in_array( $style['context'], array( 'editor', 'both' ), true ) ) {
				wp_enqueue_style( $style['handle'], $style['src'], $style['deps'], $style['ver'], $style['media'] );
			}
		}
	}

	/**
	 * Prints scripts to be loaded lazily.
	 *
	 * Encodes the lazy load scripts data and prints a script to handle it on the client side.
	 *
	 * @return void
	 *
	 * @phpcs:disable Squiz.PHP.CommentedOutCode.Found
	 */
	public function print_inline_frontend_scripts() {
		// Adds extra code to a registered script.
		foreach ( $this->inline_scripts as $script ) {
			wp_add_inline_script( $script['handle'], $script['data'], $script['position'] );
		}

		// Adds extra CSS styles to a registered stylesheet.
		foreach ( $this->inline_styles as $style ) {
			wp_add_inline_style( $style['handle'], $style['data'] );
		}

		// Prepare lazy loading script
		// $lazy_load_script = 'function loadScript(src, callback) {
		// const script = document.createElement("script");
		// script.src = src;
		// script.onload = callback;
		// document.head.appendChild(script);
		// }

		// function initializeMiniSearch() {
		// const lazyLoadData = window.fse_block_toolkit_mini_search_lazy_load_data;
		// if (!lazyLoadData) return;

		// const scriptPromises = Object.entries(lazyLoadData).map(([handle, scriptData]) => {
		// return new Promise((resolve) => {
		// loadScript(scriptData.src, resolve);
		// });
		// });

		// Promise.all(scriptPromises).then(() => {
		// All scripts are loaded, now initialize your mini search functionality
		// console.log("Mini search scripts loaded");
		// Add your mini search initialization code here
		// });
		// }

		// // Check if the DOM is already loaded
		// if (document.readyState === "loading") {
		// document.addEventListener("DOMContentLoaded", initializeMiniSearch);
		// } else {
		// initializeMiniSearch();
		// }';
		// wp_add_inline_script( 'fse-block-toolkit-lazy-loader', $lazy_load_script, 'before' );
	}

	/**
	 * Get script data including dependencies and version.
	 *
	 * @param string $relative_src         Relative path to the script file.
	 * @param array  $default_dependencies Default dependencies if .asset.php is not found.
	 *
	 * @return array Script data including src, version, and dependencies.
	 */
	public function get_script_data( $relative_src, $default_dependencies = array() ) {
		if ( ! $relative_src ) {
			return array(
				'src'          => '',
				'version'      => '1',
				'dependencies' => $default_dependencies,
			);
		}

		$asset_path = FSE_BLOCKS_TOOLKIT_PATH . str_replace( '.js', '.asset.php', $relative_src );
		$asset      = file_exists( $asset_path ) ? require $asset_path : array();

		return array(
			'src'          => trailingslashit( FSE_BLOCKS_TOOLKIT_URL ) . $relative_src,
			'version'      => ! empty( $asset['version'] ) ? $asset['version'] : FSE_BLOCKS_TOOLKIT_METADATA['Version'],
			'dependencies' => ! empty( $asset['dependencies'] ) ? $asset['dependencies'] : $default_dependencies,
		);
	}
}

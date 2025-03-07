<?php
/**
 * Manages block types within a WordPress environment by handling their detection, registration, and associated asset management.
 *
 * This class is responsible for detecting block types from a specified directory,
 * initializing their assets, and registering them with WordPress at the appropriate time.
 *
 * @package FSE\BlockToolkit\BlockTypes
 */


namespace FSE\BlockToolkit\BlockTypes;

/**
 * Class BlockManager
 *
 * Manages the registration and initialization of custom blocks within the WordPress environment.
 */
class BlockManager {
	private $blocks                = array();
	private $heavy_frontend_blocks = array();

	/**
	 * Constructor for BlockManager.
	 *
	 * Sets up block detection and registration. Registers initialization actions with WordPress
	 * to ensure blocks are registered at the appropriate time in the WordPress lifecycle.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'detect_and_register_block_types' ) );
		add_filter( 'register_block_type_args', array( $this, 'register_block_type_args' ), 10, 2 );
	}


	/**
	 * Detects block types in the designated directory and conditionally initializes their assets.
	 * This method handles both standard blocks and heavy frontend blocks that require specific asset management.
	 * Registers all detected blocks with WordPress. This method is triggered during the WordPress 'init' action.
	 * It iterates through all blocks, using their characteristics to determine the registration process.
	 * Dynamic blocks with a defined `render_callback` method are registered such that WordPress knows to call
	 * this callback when rendering the block. This setup ensures that the dynamic content is handled correctly.
	 *
	 * @return void
	 */
	public function detect_and_register_block_types() {
		$block_files = glob( FSE_BLOCKS_TOOLKIT_PATH . 'includes/src/BlockTypes/Blocks/*.php' );
		foreach ( $block_files as $file ) {
			$class_name = '\\FSE\\BlockToolkit\\BlockTypes\\Blocks\\' . basename( $file, '.php' );
			if ( class_exists( $class_name ) ) {
				$block = new $class_name();
				if ( $block instanceof Abstracts\HeavyFrontendBlock ) {
					$this->heavy_frontend_blocks[] = $block;
					// For instances of `HeavyFrontendBlock`, a distinct block registration process is applied.
					// This process involves selectively bypassing the automatic loading of some or all assets
					// typically defined in `block.json` via `register_block_type`.
					// Instead, we use `register_block_type_args` to manually control asset registration,
					// allowing us to delegate certain assets to the AssetManager for optimized handling, such as lazy loading.
					$block->register_assets();
					$this->register_block_type( $block );
				} else {
					$this->blocks[] = $block;
					$this->register_block_type( $block );
				}
			}
		}
	}

	/**
	 * Registers a single block type with WordPress based on the properties of the block object.
	 * This method constructs the path to the block's assets and sets up the block with WordPress,
	 * handling both dynamic and static blocks. Dynamic blocks have a render callback function
	 * associated with them to handle server-side rendering.
	 *
	 * @param object $block The block instance to register. This object should expose methods like
	 * `is_dynamic_block()` and `get_block_name()`, and may optionally include a `render_callback` method if dynamic.
	 *
	 * @return void
	 */
	public function register_block_type( $block ) {
		$block_path = str_replace( 'fse-block-toolkit/', FSE_BLOCKS_TOOLKIT_PATH . 'assets/build/', $block->get_block_name() );
		if ( $block->is_dynamic_block() ) {
			register_block_type(
				$block_path,
				array(
					'render_callback' => array( $block, 'render_callback' ),
				)
			);
		} else {
			register_block_type( $block_path );
		}
	}

	/**
	 * Modifies arguments for block types during their registration process.
	 * This method is also triggered during the WordPress 'init' action.
	 *
	 * @param array  $args       Arguments for registering the block type.
	 * @param string $block_name Block type name.
	 *
	 * @return array
	 */
	public function register_block_type_args( $args, $block_name ) {
		foreach ( $this->heavy_frontend_blocks as $block ) {
			if ( $block_name === $block->get_block_name() ) {
				$args = $block->modify_block_type_args( $args, $block_name );
			}
		}

		return $args;
	}
}

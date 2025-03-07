<?php

namespace FSE\BlockToolkit\BlockTypes\Abstracts;

/**
 * Defines the base structure for a block within the WordPress system.
 *
 * This abstract class serves as a foundational template for creating different types of blocks.
 * It specifies essential properties and methods that subclasses must implement, focusing particularly
 * on asset management and optional dynamic rendering processes.
 */
abstract class AbstractBlock {
	/**
	 * The unique name identifier for the block, essential for block registration and management.
	 * This property must be explicitly defined in every subclass to ensure correct registration
	 * and functionality within the WordPress environment.
	 *
	 * @var string
	 */
	protected $block_name;

	/**
	 * Indicates whether the block is dynamic. Dynamic blocks require a render callback
	 * for server-side rendering to dynamically generate content based on attributes at runtime.
	 * If `render_callback` is implemented, `is_dynamic` must be set to true so that the
	 * BlockManager can properly trigger or hook the render callback during block registration.
	 *
	 * @var bool
	 */
	protected $is_dynamic = false;
	/**
	 * Retrieves the block name.
	 *
	 * @return string The unique identifier for the block.
	 */
	public function get_block_name() {
		return $this->block_name;
	}

	/**
	 * Checks if the block is dynamic.
	 *
	 * @return boolean True if the block is dynamic, false otherwise.
	 */
	public function is_dynamic_block() {
		return $this->is_dynamic;
	}

	/**
	 * Optional render callback function that is called to generate the block's content dynamically.
	 * This function should be implemented in subclasses if dynamic content generation is needed.
	 * If defined, the `is_dynamic` property must be set to true to ensure that this callback is
	 * properly registered and executed.
	 *
	 * @param array  $attributes Attributes passed to the block, including any default attributes.
	 * @param string $content    The block's content, as saved or input by the user.
	 * @param object $block      The block's instance.
	 *
	 * @return string The rendered content of the block.
	 *
	 * @phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
	 */
	public function render_callback( $attributes, $content, $block ) {
		return '';
	}
}

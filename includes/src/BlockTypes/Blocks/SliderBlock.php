<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

/**
 * Class SliderBlock
 *
 * This class handles the registration and functionality of the slider block,
 * providing support for adding a simple lightweight image slider to the content.
 */
class SliderBlock extends AbstractBlock {
	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/slider';

	/**
	 * Indicates if the block is dynamic.
	 *
	 * @var bool
	 */
	protected $is_dynamic = false;
}

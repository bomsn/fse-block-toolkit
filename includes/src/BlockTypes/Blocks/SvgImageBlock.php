<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

/**
 * Class SvgImageBlock
 *
 * This class handles the registration and functionality of the SVG Image block,
 * providing support for adding SVG images to the content.
 */
class SvgImageBlock extends AbstractBlock {
	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/svg-image';

	/**
	 * Indicates if the block is dynamic.
	 *
	 * @var bool
	 */
	protected $is_dynamic = false;
}

<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

/**
 * Class DummySubscribeFormBlock
 *
 * This class handles the registration of Dummy Subscribe Form block.
 */
class DummySubscribeFormBlock extends AbstractBlock {
	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/dummy-subscribe-form';

	/**
	 * Indicates if the block is dynamic.
	 *
	 * @var bool
	 */
	protected $is_dynamic = false;
}

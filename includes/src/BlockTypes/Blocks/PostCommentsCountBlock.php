<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

/**
 * Class PostCommentsCountBlock
 *
 * This class handles the rendering and functionality of the Post Comments Count block,
 * which displays the number of comments for a specific post.
 */
class PostCommentsCountBlock extends AbstractBlock {
	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/post-comments-count';

	/**
	 * Indicates if the block is dynamic.
	 *
	 * @var bool
	 */
	protected $is_dynamic = true;

	/**
	 * Renders the block on the server.
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $content    The block content.
	 * @param object $block      The block instance.
	 *
	 * @return string The rendered block HTML.
	 */
	public function render_callback( $attributes, $content, $block ) {
		if ( ! isset( $block->context['postId'] ) ) {
			return '';
		}

		$classes = '';
		if ( isset( $attributes['textAlign'] ) ) {
			$classes .= 'has-text-align-' . $attributes['textAlign'];
		}

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classes ) );
		return sprintf(
			'<div %1$s>%2$s</div>',
			$wrapper_attributes,
			get_comments_number( $block->context['postId'] )
		);
	}
}

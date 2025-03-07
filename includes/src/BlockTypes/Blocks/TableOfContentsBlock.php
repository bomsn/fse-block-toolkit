<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

/**
 * Class TableOfContentsBlock
 *
 * This class handles the rendering and functionality of the Table of Contents block,
 * which dynamically generates a table of contents based on the headers in the post content.
 */
class TableOfContentsBlock extends AbstractBlock {
	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/table-of-contents';

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

		// Get the post content
		$post_id      = $block->context['postId'];
		$post_content = get_the_content( $post_id );

		// Adjusted PHP code to include IDs for H3 tags
		preg_match_all( '/<h2.*?>(.*?)<\/h2>|<h3.*?>(.*?)<\/h3>/', $post_content, $matches, PREG_SET_ORDER );

		$toc                   = array();
		$current_h2_id         = '';
		$current_h3_id_counter = 1; // Counter for H3 IDs to ensure uniqueness

		foreach ( $matches as $match ) {
			if ( ! empty( $match[1] ) ) { // H2
				$content               = wp_strip_all_tags( $match[1] );
				$current_h2_id         = sanitize_title( $content );
				$toc[ $current_h2_id ] = array(
					'title'     => $content,
					'sub_items' => array(),
				);
				$current_h3_id_counter = 1; // Reset H3 ID counter for each new H2
			} elseif ( ! empty( $match[2] ) && ! empty( $current_h2_id ) ) { // H3
				++$current_h3_id_counter;
				$content                              = wp_strip_all_tags( $match[2] );
				$current_h3_id                        = $current_h2_id . '-h3-' . $current_h3_id_counter;
				$toc[ $current_h2_id ]['sub_items'][] = array(
					'title' => $content,
					'id'    => $current_h3_id,
				);
			}
		}

		// Adjusted the HTML output to include IDs for H3 tags
		$toc_html = '<div class="fse-block-toolkit-toc-inner"><h4>Table of Contents</h4><div class="fse-block-toolkit-toc-items"><ul>';
		foreach ( $toc as $main_id => $main_item ) {
			$toc_html .= '<li class="toc-main-section" data-toc-id="' . $main_id . '"><a class="toc-header" href="#' . $main_id . '">' . $main_item['title'] . '</a>';
			if ( ! empty( $main_item['sub_items'] ) ) {
				$toc_html .= '<ul>';
				foreach ( $main_item['sub_items'] as $sub_item ) {
					$toc_html .= '<li class="toc-sub-section" data-toc-id="' . $sub_item['id'] . '"><a href="#' . $sub_item['id'] . '">' . $sub_item['title'] . '</a></li>';
				}
				$toc_html .= '</ul>';
			}
			$toc_html .= '</li>';
		}
		$toc_html .= '</ul></div></div>';

		$classes = '';
		if ( isset( $attributes['textAlign'] ) ) {
			$classes .= 'has-text-align-' . $attributes['textAlign'];
		}

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classes ) );
		return sprintf(
			'<div id="fse-block-toolkit-toc" %1$s>%2$s</div>',
			$wrapper_attributes,
			$toc_html
		);
	}
}

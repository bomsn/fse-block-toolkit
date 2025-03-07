<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

/**
 * Class PageCardBlock
 *
 * This class handles the rendering and functionality of the Page Card block.
 */
class PageCardBlock extends AbstractBlock {
	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/page-card';

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
		$page_id             = $attributes['selectedPageId'];
		$selected_items      = $attributes['selectedItems'];
		$enable_custom_title = $attributes['enableCustomTitle'];
		$custom_title        = $attributes['customTitle'];

		if ( ! $page_id ) {
			return '<div class="page-card">Please select a page.</div>';
		}

		$page = get_post( $page_id );
		if ( ! $page ) {
			return '<div class="page-card">Selected page not found.</div>';
		}

		$permalink = get_permalink( $page_id );
		$output    = sprintf( '<a href="' . esc_url( $permalink ) . '" %s>', get_block_wrapper_attributes( array( 'class' => 'page-card' ) ) );

		foreach ( $selected_items as $item ) {
			switch ( $item ) {
				case 'image':
					$image   = get_the_post_thumbnail( $page_id, 'medium', array( 'class' => 'page-card-image' ) );
					$output .= '<div class="page-card-image-wrapper">';
					$output .= $image ? $image : '<img src="' . esc_url( wc_placeholder_img_src( 'medium' ) ) . '" alt="Placeholder" class="page-card-image">';
					$output .= '<div class="page-card-overlay"></div>';
					$output .= '</div>';
					break;
				case 'title':
					$output .= '<div class="page-card-title-wrapper">';
					if ( $enable_custom_title && ! empty( $custom_title ) ) {
						$output .= '<h4 class="page-card-title">' . esc_html( $custom_title ) . '</h4>';
					} else {
						$output .= '<h4 class="page-card-title">' . esc_html( get_the_title( $page_id ) ) . '</h4>';
					}
					$output .= '</div>';
					break;
				case 'date':
					$output .= '<div class="page-card-date">' . get_the_date( '', $page_id ) . '</div>';
					break;
				case 'author':
					$author_id = $page->post_author;
					$output   .= '<div class="page-card-author">' . esc_html( get_the_author_meta( 'display_name', $author_id ) ) . '</div>';
					break;
				case 'excerpt':
					$excerpt = get_the_excerpt( $page_id );
					$output .= '<div class="page-card-excerpt">' . wp_trim_words( $excerpt, 20 ) . '</div>';
					break;
			}
		}

		$output .= '</a>';

		return $output;
	}
}

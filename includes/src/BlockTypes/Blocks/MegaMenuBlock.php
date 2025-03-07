<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

/**
 * Class MegaMenuBlock
 *
 * This class handles the rendering and functionality of the Mega Menu block,
 * providing a complex navigation structure with support for submenus and various interactive features.
 */
class MegaMenuBlock extends AbstractBlock {
	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/mega-menu';

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

		global $wp;

		$label       = $attributes['label'] ?? '';
		$menu_slug   = $attributes['menuSlug'] ?? '';
		$url         = $attributes['url'] ?? '#';
		$description = $attributes['description'] ?? '';
		$title       = $attributes['title'] ?? '';
		$rel         = $attributes['rel'] ?? '';

		$open_submenus_on_click = array_key_exists( 'openSubmenusOnClick', $block->context ) ? $block->context['openSubmenusOnClick'] : false;
		$show_submenu_icons     = array_key_exists( 'showSubmenuIcon', $block->context ) ? $block->context['showSubmenuIcon'] : false;

		// Sanitize attributes
		$label       = wp_kses_post( $label );
		$url         = esc_url( $url );
		$description = esc_html( $description );
		$title       = esc_attr( $title );
		$rel         = esc_attr( $rel );

		// Check if this is the current page
		$path            = wp_parse_url( $url, PHP_URL_PATH );
		$slug            = basename( untrailingslashit( $path ) );
		$is_current_page = $slug ? $slug === $wp->request : false;

		$wrapper_attributes['aria-label']   = $label;
		$wrapper_attributes['aria-current'] = 'page';
		// `has-child` allows us to make use of `Interactivity API` that's already applied to navigation blocks
		$wrapper_attributes['class'] = 'wp-block-navigation-submenu has-child';
		if ( $open_submenus_on_click ) {
			$wrapper_attributes['class'] .= ' open-on-click';
		} elseif ( $show_submenu_icons ) {
			$wrapper_attributes['class'] .= ' open-on-hover-click';
		}
		if ( $is_current_page ) {
			$wrapper_attributes['class'] .= ' current-menu-item';
		}

		// Start building the output
		$output = '';
		// Main link
		$output .= sprintf(
			'<a href="%s" class="wp-block-navigation-item__content" title="%s" rel="%s">',
			$url,
			$title,
			$rel,
		);
		$output .= $label;
		$output .= '</a>';

		// Arrow button
		if ( $show_submenu_icons ) {
			$output .= '<button aria-label="' . esc_attr( $label ) . '" class="wp-block-navigation__submenu-icon wp-block-navigation-submenu__toggle" aria-expanded="false">';
			$output .= '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg>';
			$output .= '</button>';
		}

		// Mega menu popup
		$output .= '<div class="fse-block-toolkit-mega-menu__popup wp-block-navigation__submenu-container wp-block-navigation-submenu">';
		if ( $menu_slug ) {
			ob_start();
			block_template_part( $menu_slug );
			$output .= ob_get_clean();
		} else {
			$output .= '<p>' . esc_html__( 'No menu template selected.', 'fse-block-toolkit' ) . '</p>';
		}
		$output .= '</div>'; // Close fse-block-toolkit-mega-menu__popup

		return sprintf(
			'<li %1$s>%2$s</li>',
			get_block_wrapper_attributes( $wrapper_attributes ),
			$output
		);
	}
}

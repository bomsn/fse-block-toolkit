<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

/**
 * Class SideMenuBlock
 *
 * This class handles the rendering and functionality of the Side Menu block,
 */
class SideMenuBlock extends AbstractBlock {


	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/side-menu';

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
		$icon                          = '<svg height="32px" id="Layer_1" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>';
		$is_initially_open             = isset( $attributes['isInitiallyOpen'] ) ? esc_attr( $attributes['isInitiallyOpen'] ) : false;
		$selected_navigation           = isset( $attributes['selectedNavigation'] ) ? intval( $attributes['selectedNavigation'] ) : 0;
		$selected_secondary_navigation = isset( $attributes['selectedSecondaryNavigation'] ) ? intval( $attributes['selectedSecondaryNavigation'] ) : 0;

		$visibility_classes = array();
		if ( ! $attributes['visibilityDesktop'] ) {
			$visibility_classes[] = 'hide-on-desktop';
		}
		if ( ! $attributes['visibilityTablet'] ) {
			$visibility_classes[] = 'hide-on-tablet';
		}
		if ( ! $attributes['visibilityMobile'] ) {
			$visibility_classes[] = 'hide-on-mobile';
		}

		$class_names = 'fse-block-toolkit-side-menu ' . implode( ' ', $visibility_classes );

		ob_start();
		?>
		<div
		<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo get_block_wrapper_attributes( array( 'class' => $class_names ) );
		?>
			data-wp-interactive='SideMenuBlock'
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo wp_interactivity_data_wp_context(
				array(
					'isOpen' => $is_initially_open,
				)
			);
			?>
		>
			<button class="fse-block-toolkit-side_menu_button" aria-label="<?php esc_attr_e( 'Menu', 'fse-block-toolkit' ); ?>" data-wp-on--click="actions.toggleDrawer">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo $icon;
				?>
			</button>

		<div class="fse-block-toolkit-components-drawer__screen-overlay"
			data-wp-run="callbacks.setupModal"
			data-wp-class--fse-block-toolkit-components-drawer__screen-overlay--with-slide-in="context.isOpen"
			data-wp-class--fse-block-toolkit-components-drawer__screen-overlay--with-slide-out="!context.isOpen"
			data-wp-class--fse-block-toolkit-components-drawer__screen-overlay--is-hidden="!context.isOpen"
			data-wp-on--click="actions.closeDrawer"
		>
			<div class="fse-block-toolkit-components-drawer"
				data-wp-on--click="actions.stopPropagation"
			>
				<div class="fse-block-toolkit-components-drawer__content">
					<div class="fse-block-toolkit-components-drawer__close-wrapper">
						<button class="fse-block-toolkit-components-button wp-element-button fse-block-toolkit-components-drawer__close contained" aria-label="Close" type="button"
							data-wp-on--click="actions.closeDrawer"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" focusable="false">
								<path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path>
							</svg>
						</button>
					</div>
					<div class="fse-block-toolkit-components-drawer__inner-content fse-block-toolkit-side-menu__modal--content">
						<button class="back-button" data-wp-bind--hidden="state.isCurrentMenuMain" data-wp-on--click="actions.goBack">
							<?php esc_html_e( 'Back', 'fse-block-toolkit' ); ?>
						</button>
						<h2 data-wp-class--invisible="!state.isCurrentMenuMain">
							<span class="fse-block-toolkit-side-menu-title-label-block"><?php esc_html_e( 'Menu', 'fse-block-toolkit' ); ?></span>
						</h2>
						<div class="fse-block-toolkit-side-menu__menus" data-wp-bind--hidden="!state.isCurrentMenuMain">
							<?php
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							echo $this->get_navigation_content( $selected_navigation, 'primary' );
							?>
						</div>
						<div class="fse-block-toolkit-side-menu__submenus" data-wp-bind--hidden="state.isCurrentMenuMain">
							<?php
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							echo $this->render_submenus( $selected_navigation );
							?>
						</div>
						<?php if ( $selected_secondary_navigation ) : ?>
							<hr class="fse-block-toolkit-side-menu__separator" data-wp-bind--hidden="!state.isCurrentMenuMain" />
							<div class="fse-block-toolkit-side-menu__secondary-menus" data-wp-bind--hidden="!state.isCurrentMenuMain">
								<?php
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
								echo $this->get_navigation_content( $selected_secondary_navigation, 'secondary' );
								?>
						</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
	</div>
		<?php
		return ob_get_clean();
	}
	/**
	 * Retrieves the main navigation content based on a navigation post ID.
	 *
	 * This function fetches the post content of the navigation post and renders it as a main menu.
	 *
	 * @param integer $navigation_id The ID of the navigation post.
	 *
	 * @return string The rendered HTML of the main menu.
	 */
	private function get_navigation_content( $navigation_id ) {
		if ( ! $navigation_id ) {
			return '';
		}

		$navigation_post = get_post( $navigation_id );
		if ( ! $navigation_post || 'wp_navigation' !== $navigation_post->post_type ) {
			return '';
		}

		$parsed_blocks = parse_blocks( $navigation_post->post_content );
		return $this->render_main_menu( $parsed_blocks );
	}
	/**
	 * Renders the main menu structure from parsed blocks.
	 *
	 * This function iterates over each block of the navigation menu, rendering items accordingly.
	 *
	 * @param array $blocks Array of parsed blocks.
	 *
	 * @return string The HTML structure of the main menu.
	 */
	private function render_main_menu( $blocks ) {
		$output = '<ul class="side-menu-list">';
		foreach ( $blocks as $block ) {
			if ( ! empty( $block['blockName'] ) ) {
				$output .= $this->render_main_menu_item( $block );
			}
		}
		$output .= '</ul>';
		return $output;
	}
	/**
	 * Renders a main menu item from a single block.
	 *
	 * This function checks the block type and renders either a navigation link or a submenu button.
	 *
	 * @param array $block The block data.
	 *
	 * @return string The HTML of the menu item.
	 */
	private function render_main_menu_item( $block ) {
		$item_content = '';
		switch ( $block['blockName'] ) {
			case 'core/navigation-link':
				$item_content = $this->render_navigation_link( $block );
				break;
			case 'core/navigation-submenu':
			case 'fse-block-toolkit/mega-menu':
				$item_content = $this->render_submenu_button( $block );
				break;
		}
		if ( $item_content ) {
			return "<li>\n" . $item_content . "\n</li>";
		}
		return '';
	}
	/**
	 * Renders a submenu button for a block.
	 *
	 * This function creates a button for a submenu, using the label and setting data attributes for interaction.
	 *
	 * @param array $block The block data.
	 *
	 * @return string The HTML button for the submenu.
	 */
	private function render_submenu_button( $block ) {
		$menu_id = sanitize_title( $block['attrs']['label'] );
		$output  = '<button data-wp-on--click="actions.openSubMenu" data-submenu-id="' . esc_attr( $menu_id ) . '">';
		$output .= esc_html( $block['attrs']['label'] );
		$output .= '<span class="submenu-indicator">›</span>';
		$output .= '</button>';
		return $output;
	}
	/**
	 * Renders submenus for a given navigation post ID.
	 *
	 * This function fetches and parses submenus from a navigation post and renders them.
	 *
	 * @param integer $navigation_id The ID of the navigation post.
	 *
	 * @return string The HTML of all rendered submenus.
	 */
	private function render_submenus( $navigation_id ) {
		if ( ! $navigation_id ) {
			return '';
		}

		$navigation_post = get_post( $navigation_id );
		if ( ! $navigation_post || 'wp_navigation' !== $navigation_post->post_type ) {
			return '';
		}

		$parsed_blocks = parse_blocks( $navigation_post->post_content );

		$output = '';
		foreach ( $parsed_blocks as $block ) {
			if ( in_array( $block['blockName'], array( 'core/navigation-submenu', 'fse-block-toolkit/mega-menu' ), true ) ) {
				$output .= $this->render_submenu( $block );
			}
		}
		return $output;
	}
	/**
	 * Renders a submenu and its contents from a block.
	 *
	 * This function creates the HTML structure for a submenu, including the title and any nested menu items or custom content.
	 *
	 * @param array $block The block data.
	 *
	 * @return string The HTML structure of the submenu.
	 */
	private function render_submenu( $block ) {
		$menu_id = sanitize_title( $block['attrs']['label'] );
		$output  = '<div class="submenu-wrapper" data-wp-bind--hidden="!state.visibleMenus.' . esc_attr( $menu_id ) . '" data-menu-id="' . esc_attr( $menu_id ) . '">';
		$output .= '<h3>' . esc_html( $block['attrs']['label'] ) . '</h3>';

		if ( 'core/navigation-submenu' === $block['blockName'] ) {
			$output .= $this->render_menu_items( $block['innerBlocks'] );
		} elseif ( 'fse-block-toolkit/mega-menu' === $block['blockName'] ) {
			$output .= $this->render_mega_menu_content( $block );
		}

		$output .= '</div>';
		return $output;
	}
	/**
	 * Renders the items within a menu, used by navigation submenus.
	 *
	 * This function iterates through blocks and renders each as a list item.
	 *
	 * @param array $blocks Array of block structures within a menu.
	 *
	 * @return string The HTML of the list items.
	 */
	private function render_menu_items( $blocks ) {
		$output = '<ul class="side-menu-list">';
		foreach ( $blocks as $block ) {
			if ( ! empty( $block['blockName'] ) ) {
				$output .= $this->render_menu_item( $block );
			}
		}
		$output .= '</ul>';
		return $output;
	}
	/**
	 * Renders a single menu item, typically a navigation link.
	 *
	 * This function renders an anchor tag for a navigation link block.
	 *
	 * @param array $block The block data.
	 *
	 * @return string The HTML anchor tag.
	 */
	private function render_menu_item( $block ) {
		$item_content = '';
		switch ( $block['blockName'] ) {
			case 'core/navigation-link':
				$item_content = $this->render_navigation_link( $block );
				break;
		}
		if ( $item_content ) {
			return "<li>\n" . $item_content . "\n</li>";
		}
		return '';
	}
	/**
	 * Renders the content for a mega menu from a block.
	 *
	 * This function fetches and renders the content of a mega menu from a template part defined in the block attributes.
	 *
	 * @param array $block The block data.
	 *
	 * @return string The rendered content of the mega menu.
	 */
	private function render_mega_menu_content( $block ) {
		$template_part_slug = isset( $block['attrs']['menuSlug'] ) ? $block['attrs']['menuSlug'] : '';
		if ( $template_part_slug ) {
			$template_id   = get_template() . '//' . $template_part_slug;
			$template_part = get_block_template( $template_id, 'wp_template_part' );
			if ( $template_part->content ) {
				return do_blocks( $template_part->content );
			}
		}
		return '';
	}
	/**
	 * Renders a navigation link as an HTML anchor tag.
	 *
	 * This function takes a navigation link block and renders it as an anchor tag with appropriate attributes.
	 *
	 * @param array $block The block data.
	 *
	 * @return string The HTML anchor tag.
	 */
	private function render_navigation_link( $block ) {
		return '<a href="' . esc_url( $block['attrs']['url'] ) . '">' . esc_html( $block['attrs']['label'] ) . '</a>';
	}
}

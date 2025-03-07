<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;

// TODO: Replace `AbstractBlock` with `HeavyFrontendBlock` and fix lazy loading
// issue for better performance. The lazy loading is working, but there is some
// conflict with woocommerce/mini-cart prefetching, or maybe because we load our file
// before preloading dependencies which might cause such issues. The reason I think it's
// due to loading priority, is because the frontend.js script can access object inside
// `window` but it can't access them directly, while it's possible to access them directly
// in the browser console.
// use FSE\BlockToolkit\BlockTypes\Abstracts\HeavyFrontendBlock;

/**
 * Class MiniSearchBlock
 *
 * This class handles the rendering and functionality of the Mini Search block,
 */
class MiniSearchBlock extends AbstractBlock {

	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/mini-search';

	/**
	 * Indicates if the block is dynamic.
	 *
	 * @var bool
	 */
	protected $is_dynamic = true;

	/**
	 * The handle for the main script of this block.
	 *
	 * @var string
	 *
	 * @phpcs:disable Squiz.PHP.CommentedOutCode.Found
	 */
	// protected $script_handle = 'fse-block-toolkit-mini-search';

	/**
	 * The file path of the main frontend script relative to the plugin directory.
	 * This file will be used along with the handle to generate lazy load data.
	 * The lazy load data will be used by the script itself to load dependencies.
	 *
	 * @var string
	 *
	 * @phpcs:disable Squiz.PHP.CommentedOutCode.Found
	 */
	// protected $script_path = 'assets/build/mini-search/frontend.js';

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
		$search_icon       = '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C3.79086 2 2 3.79086 2 6C2 8.2091 3.79086 10 6 10C8.2091 10 10 8.2091 10 6C10 3.79086 8.2091 2 6 2ZM0 6C0 2.68629 2.68629 0 6 0C9.3137 0 12 2.68629 12 6C12 7.29583 11.5892 8.4957 10.8907 9.4765L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L9.4765 10.8907C8.4957 11.5892 7.29583 12 6 12C2.68629 12 0 9.3137 0 6Z" fill="black"></path></svg>';
		$is_initially_open = isset( $attributes['isInitiallyOpen'] ) ? esc_attr( $attributes['isInitiallyOpen'] ) : false;
		$color_class_names = isset( $attributes['colorClassNames'] ) ? esc_attr( $attributes['colorClassNames'] ) : '';
		ob_start();
		?>
		<div
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo get_block_wrapper_attributes();
			?>
			data-wp-interactive='MiniSearchBlock'
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo wp_interactivity_data_wp_context(
				array(
					'apiUrl'                => get_rest_url(),
					'apiNonce'              => wp_create_nonce( 'wp_rest' ),
					'isOpen'                => $is_initially_open,
					'searchTerm'            => '',
					'searchPage'            => array(
						'products' => 1,
						'pages'    => 1,
						'posts'    => 1,
					),
					'lastUpdatedSearchPage' => '',
					'noResults'             => false,
					'requestInfo'           => null,
				)
			);
			?>
		>
			<button class="fse-block-toolkit-mini-search_button" <?php echo esc_attr( $color_class_names ); ?> aria-label="<?php esc_attr_e( 'Search', 'fse-block-toolkit' ); ?>" data-wp-on--click="actions.toggleDrawer">
				<?php echo $search_icon; // phpcs:ignore ?>
			</button>

			<div class="fse-block-toolkit-components-drawer__screen-overlay"
				data-wp-run="callbacks.setupModal"
				data-wp-class--fse-block-toolkit-components-drawer__screen-overlay--with-slide-in="context.isOpen"
				data-wp-class--fse-block-toolkit-components-drawer__screen-overlay--with-slide-out="!context.isOpen"
				data-wp-class--fse-block-toolkit-components-drawer__screen-overlay--is-hidden="!context.isOpen"
				data-wp-on--click="actions.closeDrawer"
			>
				<div class="fse-block-toolkit-mini-search__drawer fse-block-toolkit-components-drawer"
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
						<div class="fse-block-toolkit-components-drawer__inner-content">
							<h2 class="fse-block-toolkit-mini-search__modal--title">
								<span class="fse-block-toolkit-mini-search-title-label-block"><?php esc_html_e( 'Search', 'fse-block-toolkit' ); ?></span>
							</h2>
							<div class="fse-block-toolkit-mini-search__modal--search-box">
								<span>
									<input
										type="text"
										class="fse-block-toolkit-mini-search-box__input"
										placeholder="<?php esc_html_e( 'Search...', 'fse-block-toolkit' ); ?>"
										data-wp-bind--value="context.searchTerm"
										data-wp-run="callbacks.setupSearch"
										data-wp-on--input="actions.performSearch"
									/>
									<?php echo $search_icon; // phpcs:ignore ?>
								</span>
							</div>
							<div class="fse-block-toolkit-mini-search__results-holder"
								data-wp-class--is-loading="state.isEverythingLoading"
							>
								<div class="minisearch-spinner-ring"><div></div><div></div><div></div><div></div></div>
								<div class="fse-block-toolkit-mini-search__results">
									<div class="results-section products-results" data-wp-bind--hidden="!state.hasResults.products">
										<h4>Products (<span data-wp-text="state.results.products.length"></span>)</h4>
										<div class="results-section-content">
												<ul>
													<template data-wp-each--product="state.results.products" >
														<li class="product-item" data-wp-key="context.product.id">
															<div class="product-item-grid">
																<img data-wp-bind--src="context.product.image" alt="Product Image" class="product-image">
																<h5 data-wp-text="context.product.title" class="product-title"></h5>
																<p data-wp-text="context.product.price_html" class="product-price"></p>
															</div>
															<a data-wp-bind--href="context.product.link" class="search-product_link">
																<span class="screen-reader-text">
																	View
																</span>
															</a>
														</li>
													</template>
												</ul>
											<button
												class="button search-load-more"
												data-wp-on--click="actions.loadMore"
												data-wp-bind--hidden="!state.hasMore.products"
												data-wp-bind--disabled="state.isLoading.products"
												data-section="products"
											>
												<span data-wp-bind--hidden="!state.isLoading.products">Loading...</span>
												<span data-wp-bind--hidden="state.isLoading.products">Load More Products</span>
											</button>
										</div>
									</div>
									<div class="results-section pages-results" data-wp-bind--hidden="!state.hasResults.pages">
										<h4>Pages (<span data-wp-text="state.results.pages.length"></span>)</h4>
										<div class="results-section-content">
												<ul>
													<template data-wp-each--page="state.results.pages" >
														<li class="page-item" data-wp-key="context.page.id">
															<h5 data-wp-text="context.page.title" class="page-title"></h5>
															<a data-wp-bind--href="context.page.link" class="search-page_link">
																<span class="screen-reader-text">
																	View
																</span>
															</a>
														</li>
													</template>
												</ul>
											<button
												class="button search-load-more"
												data-wp-on--click="actions.loadMore"
												data-wp-bind--hidden="!state.hasMore.pages"
												data-wp-bind--disabled="state.isLoading.pages"
												data-section="pages"
											>
												<span data-wp-bind--hidden="!state.isLoading.pages">Loading...</span>
												<span data-wp-bind--hidden="state.isLoading.pages">Load More Pages</span>
											</button>
										</div>
									</div>
									<div class="results-section posts-results" data-wp-bind--hidden="!state.hasResults.posts">
										<h4>Posts (<span data-wp-text="state.results.posts.length"></span>)</h4>
										<div class="results-section-content">
												<ul>
													<template data-wp-each--post="state.results.posts" >
														<li class="post-item" data-wp-key="context.post.id">
															<h5 data-wp-text="context.post.title" class="post-title"></h5>
															<a data-wp-bind--href="context.post.link" class="search-post_link">
																<span class="screen-reader-text">
																	View
																</span>
															</a>
														</li>
													</template>
												</ul>
											<button
												class="button search-load-more"
												data-wp-on--click="actions.loadMore"
												data-wp-bind--hidden="!state.hasMore.posts"
												data-wp-bind--disabled="state.isLoading.posts"
												data-section="posts"
											>
												<span data-wp-bind--hidden="!state.isLoading.posts">Loading...</span>
												<span data-wp-bind--hidden="state.isLoading.posts">Load More Posts</span>
											</button>
										</div>
									</div>
									<div class="results-section no-results" data-wp-bind--hidden="!context.noResults">
										<p><?php esc_html_e( 'There are no results matching your search term.', 'fse-block-toolkit' ); ?></p>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Modifies the block type arguments.
	 * This is done mainly to set `view_script` & `view_script_handles` to false,
	 * to prevent WordPress from automatically loading the frontend scripts for the currenct block.
	 *
	 * @param array  $args       The original block type arguments.
	 * @param string $block_name The name of the block.
	 *
	 * @return array Modified block type arguments.
	 *
	 * @phpcs:disable Squiz.PHP.CommentedOutCode.Found
	 */
	// public function modify_block_type_args( $args, $block_name ) {
	// $args['view_script']         = false;
	// $args['view_script_handles'] = false;
	// return $args;
	// }
}

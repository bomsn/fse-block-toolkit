<?php

namespace FSE\BlockToolkit\BlockTypes\Blocks;

use FSE\BlockToolkit\BlockTypes\Abstracts\AbstractBlock;
use FSE\BlockToolkit\Utils\StyleAttributesUtils;

/**
 * Class CurrencySwitcherBlock
 *
 * This class handles the rendering and functionality of the Currency Switcher block,
 * enabling users to switch between different currencies when WC Payments plugin is enabled.
 */
class CurrencySwitcherBlock extends AbstractBlock {
	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'fse-block-toolkit/currency-switcher';

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

		if ( ! class_exists( '\WCPay\MultiCurrency\MultiCurrency' ) ) {
			return '';
		}

		$multi_currency = \WCPay\MultiCurrency\MultiCurrency::instance();

		if ( ! $multi_currency ) {
			return '';
		}

		$compatibility = $multi_currency->get_compatibility();
		if ( $compatibility->should_disable_currency_switching() ) {
			return '';
		}

		$enabled_currencies = $multi_currency->get_enabled_currencies();

		if ( 1 === count( $enabled_currencies ) ) {
			return '';
		}

		// Get the currently selected currency
		$current_currency = $multi_currency->get_selected_currency();

		// Extract block attributes into an attributes string
		$styles_and_classes = StyleAttributesUtils::get_classes_and_styles_by_attributes( $attributes );
		$button_attributes  = get_block_wrapper_attributes(
			array(
				'class'      => trim( 'fse-block-toolkit-currency-switcher__button ' . ( $styles_and_classes['classes'] ?? '' ) ),
				'style'      => $styles_and_classes['styles'] ?? '',
				'aria-label' => esc_html__( 'Currnecy Switcher', 'fse-block-toolkit' ),
			)
		);

		/**
		 * Skip if gap value contains unsupported characters.
		 * Regex for CSS value borrowed from `safecss_filter_attr`, and used here
		 * to only match against the value, not the CSS attribute.
		 */

		/**
		 * Prepare the block inner markup.
		 */
		$block_content  = '';
		$block_content .= '<form>';
		$block_content .= $this->get_get_params();
		$block_content .= '<input type="hidden" name="currency" id="fse-block-toolkit-currency-switcher-input">';
		$block_content .= sprintf( '<button type="button" onclick="customBlockToggleDropdown()" %1$s>', $button_attributes );
		$block_content .= '<span class="fse-block-toolkit-currency-switcher__flag">' . $current_currency->get_flag() . '</span>';
		$block_content .= '<span class="fse-block-toolkit-currency-switcher__code">' . esc_html( $current_currency->get_code() ) . '</span>';
		$block_content .= '<span class="fse-block-toolkit-currency-switcher__arrow">';
		$block_content .= '<svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">';
		$block_content .= '<path d="M0.84875 0.222229L0 1.14462L7 8.77778L14 1.14462L13.1556 0.222229L7 6.92854L0.84875 0.222229Z" fill="white"/>';
		$block_content .= '</svg>';
		$block_content .= '</span>';
		$block_content .= '</button>';
		$block_content .= '<ul class="fse-block-toolkit-currency-switcher__dropdown" style="display: none;">';

		foreach ( $enabled_currencies as $currency ) {
			$block_content .= '<li>';
			$block_content .= '<button type="button" onclick="customBlockSelectCurrency(\'' . esc_attr( $currency->get_code() ) . '\')">';
			$block_content .= '<span class="fse-block-toolkit-currency-switcher__flag">' . $currency->get_flag() . '</span>';
			$block_content .= '<span class="fse-block-toolkit-currency-switcher__code">' . esc_html( $currency->get_code() ) . '</span>';
			$block_content .= '<span class="fse-block-toolkit-currency-switcher__symbol">' . esc_html( $currency->get_symbol() ) . '</span>';
			$block_content .= '</button>';
			$block_content .= '</li>';
		}

		$block_content .= '</ul>';
		$block_content .= '</form>';

		return sprintf( '<div id="currency_switcher_wrapper" class="fse-block-toolkit-currency-switcher">%s</div>', $block_content );
	}
	/**
	 * Get hidden inputs for every $_GET param.
	 * This prevents the switcher form to remove them on submit.
	 *
	 * @return string|null
	 */
	private function get_get_params() {
		// phpcs:ignore WordPress.Security.NonceVerification
		if ( empty( $_GET ) ) {
			return null;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$params = explode( '&', urldecode( http_build_query( $_GET ) ) );
		$return = '';
		foreach ( $params as $param ) {
			$name_value = explode( '=', $param );
			$name       = $name_value[0];
			$value      = $name_value[1];
			if ( 'currency' === $name ) {
				continue;
			}
			$return .= sprintf( '<input type="hidden" name="%s" value="%s" />', esc_attr( $name ), esc_attr( $value ) );
		}
		return $return;
	}
}

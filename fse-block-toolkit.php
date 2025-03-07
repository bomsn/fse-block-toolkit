<?php

/**
 * FSE Block Toolkit
 *
 * This plugin provides standalone blocks for various projects.
 *
 * @since       1.0.0
 * @version     1.0.0
 * @author      Ali Khallad
 *
 * @noinspection    ALL
 *
 * @wordpress-plugin
 * Plugin Name:             FSE Block Toolkit
 * Description:             Standalone blocks for various projects.
 * Version:                 1.0.0
 * Requires at least:       6.1
 * Requires PHP:            8.1
 * Author:                  Ali Khallad
 * Author URI:              https://alikhallad.com
 * Text Domain:             fse-block-toolkit
 * Domain Path:             /languages
 */

defined( 'ABSPATH' ) || exit;

// Define plugin constants.
function_exists( 'get_plugin_data' ) || require_once ABSPATH . 'wp-admin/includes/plugin.php';
define( 'FSE_BLOCKS_TOOLKIT_VERSION', '1.0.0' );
define( 'FSE_BLOCKS_TOOLKIT_METADATA', get_plugin_data( __FILE__, false, false ) );
define( 'FSE_BLOCKS_TOOLKIT_PATH', plugin_dir_path( __FILE__ ) );
define( 'FSE_BLOCKS_TOOLKIT_URL', plugin_dir_url( __FILE__ ) );

// Include the rest of the blocks plugin's files if system requirements check out.
if ( is_php_version_compatible( FSE_BLOCKS_TOOLKIT_METADATA['RequiresPHP'] ) && is_wp_version_compatible( FSE_BLOCKS_TOOLKIT_METADATA['RequiresWP'] ) ) {
	// Require the Composer-generated autoloader to enable automatic loading of dependencies and registered namespaces.
	// If `vendor` autoloader doesn't exist, run `composer dump-autoload -o` to generate it.
	require_once FSE_BLOCKS_TOOLKIT_PATH . 'vendor/autoload.php';
	// Directly include the main plugin setup file to initialize essential components and configurations.
	require_once FSE_BLOCKS_TOOLKIT_PATH . 'includes/plugin-setup.php';
}

<?php

use FSE\BlockToolkit\Bootstrap;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Initialize the plugin
add_action(
	'plugins_loaded',
	function () {
		$main = new Bootstrap();
		$main->init();
	}
);

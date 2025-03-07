# FSE Block Toolkit

A collection of simple WordPress blocks for side projects using Full Site Editing.

## Description

FSE Block Toolkit provides useful blocks that can be added to your WordPress site. These blocks work with the WordPress Full Site Editor and can be used anywhere on your site.

All blocks focus on providing functionality without imposing specific styling, allowing them to be styled according to your theme's design system.

## Requirements

- WordPress 6.1 or higher
- PHP 8.1 or higher

## Installation

1. Upload the `fse-block-toolkit` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use the blocks in the WordPress editor

## Blocks Included

### Mini Search Block
A simple search interface for products

**Note:** Requires WooCommerce for product search functionality

### Currency Switcher Block
Switch between different currencies on your site.

**Note:** Requires WooCommerce and WooCommerce Payments for multi-currency functionality

### Side Menu Block
A side menu for navigation.

### Mega Menu Block
Create mega menu layouts for navigation.

### Page Card Block
Display pages in a card format.

### Post Comments Count Block
Display the number of comments on a post.

### Slider Block
A lightweight image slider ( good for logos ).

### SVG Image Block
Display SVG images using code.

### Table of Contents Block
Generate a table of contents for your page.

## Usage

The blocks will be available in the WordPress editor under the "Custom Blocks" category. Just add them to your pages or templates as needed.

Each block provides core functionality while allowing you to apply your own styling through the theme or custom CSS.

## Development

### Building the Plugin

```bash
# Install dependencies
npm install

# Build for development
npm run build

# Build for production
npm run build:production
```

### PHP Dependencies

```bash
# Install PHP dependencies
composer install
``` 
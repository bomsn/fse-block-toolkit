const isString = (term) => {
	return typeof term === 'string';
};

/**
 * In WP, registered scripts are loaded into the page with an element like this:
 * `<script src='...' id='[SCRIPT_ID]'></script>`
 * This function checks whether an element matching that selector exists.
 * Useful to know if a script has already been appended to the page.
 */
const isScriptTagInDOM = (scriptId, src = '') => {
	// If the store is using a plugin to concatenate scripts, we might have some
	// cases where we don't detect whether a script has already been loaded.
	// Because of that, we add an extra protection to the fse-block-toolkit-registry-js
	// script, to avoid ending up with two registries.
	if (scriptId === 'fse-block-toolkit-registry-js') {
		if (typeof window?.fseBlockToolkit?.fseBlockToolkitRegistry === 'object') {
			return true;
		}
	}

	const srcParts = src.split('?');
	if (srcParts?.length > 1) {
		src = srcParts[0];
	}
	const selector = src
		? `script#${scriptId}, script[src*="${src}"]`
		: `script#${scriptId}`;
	const scriptElements = document.querySelectorAll(selector);

	return scriptElements.length > 0;
};

/**
 * Appends a script element to the document body if a script with the same id
 * doesn't exist.
 */
const appendScript = (attributes) => {
	// Abort if id is not valid or a script with the same id exists.
	if (!isString(attributes.id) || isScriptTagInDOM(attributes.id, attributes?.src)) {
		return;
	}
	const scriptElement = document.createElement('script');
	for (const attr in attributes) {
		// We could technically be iterating over inherited members here, so
		// if this is the case we should skip it.
		if (!attributes.hasOwnProperty(attr)) {
			continue;
		}
		const key = attr;

		// Skip the keys that aren't strings, because we can't be sure which
		// key in the scriptElement object we're assigning to.
		if (key === 'onload' || key === 'onerror') {
			continue;
		}

		// This assignment stops any complaint about the value maybe being
		// undefined following the isString check below.
		const value = attributes[key];
		if (isString(value)) {
			scriptElement[key] = value;
		}
	}

	// Now that we've assigned all the strings, we can explicitly assign to the
	// function keys.
	if (typeof attributes.onload === 'function') {
		scriptElement.onload = attributes.onload;
	}
	if (typeof attributes.onerror === 'function') {
		scriptElement.onerror = attributes.onerror;
	}
	document.body.appendChild(scriptElement);
};

/**
 * Appends a `<script>` tag to the document body based on the src and handle
 * parameters. In addition, it appends additional script tags to load the code
 * needed for translations and any before and after inline scripts. See these
 * documentation pages for more information:
 *
 * https://developer.wordpress.org/reference/functions/wp_set_script_translations/
 * https://developer.wordpress.org/reference/functions/wp_add_inline_script/
 */
const lazyLoadScript = ({
	handle,
	src,
	version,
	after,
	before,
	translations,
}) => {
	return new Promise((resolve, reject) => {
		if (isScriptTagInDOM(`${handle}-js`, src)) {
			resolve();
		}

		if (translations) {
			appendScript({
				id: `${handle}-js-translations`,
				innerHTML: translations,
			});
		}
		if (before) {
			appendScript({
				id: `${handle}-js-before`,
				innerHTML: before,
			});
		}

		const onload = () => {
			if (after) {
				appendScript({
					id: `${handle}-js-after`,
					innerHTML: after,
				});
			}
			resolve();
		};

		appendScript({
			id: `${handle}-js`,
			onerror: reject,
			onload,
			src: version ? `${src}?ver=${version}` : src,
		});
	});
};

// Function to lazy load dependencies
const lazyLoadDependencies = async (deps) => {
	for (const dep in deps) {
		const dependency = deps[dep];
		await lazyLoadScript({
			handle: dep,
			...dependency,
		});
	}
};

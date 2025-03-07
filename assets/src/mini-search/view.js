
// TODO: Enqueue `api-fetch` and `url` dependencies in PHP manually.
// Modules and scripts are not compatible at this time.
// Modules cannot depend on scripts and scripts cannot depend on modules.
// This means that since this is a module, it can't depend on scripts like wp-api-fetch, etc.
// a workaround is to enqueue the scripts directly and use wp... to access them (eg; window.wp.apiFetch)
// import apiFetch from '@wordpress/api-fetch';
// import { addQueryArgs } from '@wordpress/url';
// import { useSelect } from '@wordpress/data';
// import { store as coreDataStore } from '@wordpress/core-data';

import { getContext, store, useEffect, withScope } from '@wordpress/interactivity';


// Define the post types we're working with
const POST_TYPES = ['products', 'pages', 'posts'];

/**
 * Creates an initial state object for each post type
 * @param {*} value - The initial value for each post type
 * @returns {Object} An object with each post type as a key and the provided value
 */
const createInitialState = (value) => {
	// Start with an empty object
	let initialState = {};

	// Loop through each post type
	for (let type of POST_TYPES) {
		// Add a new property to the object for this post type
		// The key is the post type, and the value is the provided value
		initialState[type] = value;
	}

	// Return the completed object
	return initialState;
}

// Create a cache class
class LRUCache {
	constructor(maxSize = 100) {
		this.maxSize = maxSize;
		this.cache = new Map();
	}

	get(key) {
		if (!this.cache.has(key)) return undefined;
		const value = this.cache.get(key);
		// refresh the key
		this.cache.delete(key);
		this.cache.set(key, value);
		return value;
	}

	set(key, value) {
		if (this.cache.has(key)) this.cache.delete(key);
		else if (this.cache.size >= this.maxSize) {
			// evict the oldest item
			this.cache.delete(this.cache.keys().next().value);
		}
		this.cache.set(key, value);
	}
}

// Limit cache to 100 items
const cache = new LRUCache(100);

// create a debounce timer ID
let debounceTimeoutId;

// Create an interactivty store for our block with the necessary logic
const { state, actions } = store("MiniSearchBlock", {
	state: {
		results: createInitialState([]),
		hasMore: createInitialState(false),
		isLoading: createInitialState(false),
		isEverythingLoading: false,
		get hasResults() {
			let hasResultsObject = {};
			for (let type of POST_TYPES) {
				hasResultsObject[type] = state.results[type].length > 0;
			}
			return hasResultsObject;
		},
	},
	actions: {
		stopPropagation: (event) => {
			event.stopPropagation();
		},
		resetState: () => {
			state.results = createInitialState([]);
			state.hasMore = createInitialState(false);
			state.isLoading = createInitialState(false);
			state.isEverythingLoading = false;
		},
		resetContext: () => {
			const context = getContext();
			context.searchTerm = '';
			context.searchPage = createInitialState(1);
			context.lastUpdatedSearchPage = '';
			context.noResults = false;
			// Reset requests ( abort any existing requests and reset the object )
			if (context.requestInfo && context.requestInfo.controller) {
				context.requestInfo.controller.abort();
			}
			context.requestInfo = null;
		},
		toggleDrawer: () => {
			const context = getContext();
			if (context.isOpen === false) {
				context.isOpen = true;
				document.body.classList.add('drawer-open');
			} else {
				actions.closeDrawer();
			}
		},
		closeDrawer: () => {
			const context = getContext();
			context.isOpen = false;
			// Remove 'drawer-open' class from the body
			document.body.classList.remove('drawer-open');
		},

		performSearch: (event) => {
			const context = getContext();
			if (context.isOpen) {
				context.searchTerm = event.target.value;
				context.searchPage = { products: 1, pages: 1, posts: 1 };
			}
		},
		loadMore: (event) => {
			event.preventDefault();
			event.stopPropagation();
			// Find the closest button element with a data-section attribute
			const button = event.target.closest('button[data-section]');

			if (!button) {
				console.error('Could not find button with data-section');
				return;
			}

			const section = button.dataset.section;
			if (!section) {
				console.error('No section found in data attribute');
				return;
			}

			// Update the context which will trigger the `useEffect` in `callbacks.setupSearch`.
			// This will initiate a new `query` to pull the next page for the select section.
			const context = getContext();
			context.searchPage[section]++;
			context.lastUpdatedSearchPage = section;
		},
		initializeNewRequest: () => {
			const context = getContext();

			if (context.requestInfo && context.requestInfo.controller) {
				context.requestInfo.controller.abort();
			}

			const newController = new AbortController();
			const newId = Date.now();

			context.requestInfo = {
				id: newId,
				controller: newController
			};

			return {
				signal: newController.signal,
				id: newId
			};
		},
		updateNonce: async () => {
			const nonceEndpoint = `${context.apiUrl.replace('/wp-json', '')}wp-admin/admin-ajax.php?action=rest-nonce`;
			try {
				const response = await fetch(nonceEndpoint);
				if (!response.ok) {
					throw response;
				}
				const newNonce = await response.text();
				const context = getContext();
				context.apiNonce = newNonce;
			} catch (error) {
				console.error('Failed to update nonce:', error);
				throw error;
			}
		},
		fetchREST: async (endpoint, options = {}) => {
			const context = getContext();
			const defaultOptions = {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': context.apiNonce,
				},
				signal: context.requestInfo.controller.signal
			};

			const mergedOptions = { ...defaultOptions, ...options };

			try {
				const response = await fetch(context.apiUrl + endpoint, mergedOptions);
				if (!response.ok) {
					throw response;
				}
				return await response.json();
			} catch (error) {
				if (error.status === 403 && error.statusText === 'rest_cookie_invalid_nonce') {
					// Update nonce and retry the request
					await actions.updateNonce();
					return actions.fetchREST(endpoint, options);
				}
				throw error;
			}
		},
		fetchResults: async (searchTerm, page, postType) => {
			const cacheKey = `${postType}-${searchTerm}-${page}`;
			if (cache.get(cacheKey)) {
				return cache.get(cacheKey);
			}

			try {
				const queryParams = new URLSearchParams({
					page: page.toString(),
					per_page: '5',
					status: 'publish',
					search: searchTerm
				});
				const endpoint = postType === 'products' ? 'wc/v3/products' : 'wp/v2/' + postType;
				const posts = await actions.fetchREST(`${endpoint}?${queryParams}`);
				const data = actions.extractQueryData(posts, postType);
				cache.set(cacheKey, data);
				return data;
			} catch (error) {
				if (error.name === 'AbortError') {
					throw error;  // Re-throw AbortError to be caught in the query function
				}
				console.error(`Error fetching ${postType}:`, error);
				return [];
			}
		},
		query: async () => {
			const context = getContext();
			// Reset `context.noResults` on each query.
			context.noResults = false;

			// Initialize a new request, and make sure to cancel any existing ones.
			const { id } = actions.initializeNewRequest();

			// Only perform a search if the search term is 3 chars at least and the modal is open
			if (context.searchTerm.length < 3 || !context.isOpen) {
				actions.resetState();
				return;
			}

			try {
				if (context.lastUpdatedSearchPage) {
					const type = context.lastUpdatedSearchPage;
					// Enable loading state by setting it to true.
					state.isLoading[type] = true;

					// Start a new search for the selected section.
					// This simply means loading the next page for a section while keeping everything the same.
					const results = await actions.fetchResults(context.searchTerm, context.searchPage[type], type);

					// Check if this request is still the current one
					if (context.requestInfo.id !== id) {
						return;
					}

					// Update the relevant section results.
					state.results[type] = state.results[type].concat(results);

					// If the returned number of results are 5, there is a chance we have more results.
					state.hasMore[type] = results.length === 5;

					// Set loading state back to false.
					state.isLoading[type] = false;

					// Reset `context.lastUpdatedSearchPage` after using it
					context.lastUpdatedSearchPage = '';
				} else {
					// Reset state before a new search
					actions.resetState();
					// Set loading indicators to true
					state.isEverythingLoading = true;

					// Fetch results for all post types concurrently
					await Promise.all(POST_TYPES.map(async (type) => {
						// Fetch results for the current post type
						const results = await actions.fetchResults(context.searchTerm, context.searchPage[type], type);

						// Update the state with the fetched results
						state.results[type] = results;

						// Set hasMore flag if we received the maximum number of results (5)
						// This indicates there might be more results available
						state.hasMore[type] = results.length === 5;

					}));

					// Check if this request is still the current one
					if (context.requestInfo.id !== id) {
						return;
					}

					// Reset loading indicator
					state.isEverythingLoading = false;
					// If this search returned no results, we will set `context.noResults` to true to display "no results" error
					if (!state.hasResults.products && !state.hasResults.products && !state.hasResults.products) {
						context.noResults = true;
					}
				}

			} catch (error) {
				if (error.name === 'AbortError') {
					console.log('Request was cancelled');
				} else {
					console.error('Search failed:', error);
					if (context.requestInfo && context.requestInfo.id === id) {
						state.isEverythingLoading = false;
						state.isLoading = createInitialState(false);
					}
				}
			}
		},
		debounceQuery: (timeout = 300) => {
			clearTimeout(debounceTimeoutId);
			debounceTimeoutId = setTimeout(withScope(() => {
				actions.query();
			}), timeout);
		},
		extractQueryData: (results, type) => {
			let data = [];  // Initialize as an array

			// Verify and correct the data type before proceeding
			if (!Array.isArray(results)) {
				results = Object.values(results);  // Convert object of objects to array
			}

			// Append each item to the data array based on type
			switch (type) {
				case 'products':
					for (const product of results) {

						const tempDiv = document.createElement("div");
						tempDiv.innerHTML = product.price_html; // Insert HTML content into a temporary div
						const priceHtmlContent = tempDiv.textContent || tempDiv.innerText || ""; // Extract text content

						data.push({
							type: 'product',  // Include type if needed for differentiation
							id: product.id,
							link: product.permalink,
							title: product.name,
							image: product.images && product.images.length > 0 ? product.images[0].src : '/wp-content/uploads/woocommerce-placeholder-150x150.png',
							price: product.price,
							price_html: priceHtmlContent
						});
					}
					break;
				case 'pages':
					for (const page of results) {
						data.push({
							type: 'page',
							id: page.id,
							title: page.title.rendered,
							link: page.link,
						});
					}
					break;
				case 'posts':
					for (const post of results) {
						data.push({
							type: 'post',
							id: post.id,
							title: post.title.rendered,
							link: post.link,
						});
					}
					break;
				default:
					console.error("Unsupported type:", type);
					break;
			}

			return data;
		}
	},
	callbacks: {
		setupModal: () => {
			const context = getContext();

			// Handle modal open/close action
			useEffect(() => {
				if (!context.isOpen) {
					actions.resetContext()
					actions.resetState()
				}
			}, [context.isOpen]);

		},
		setupSearch: () => {
			const context = getContext();

			// Handle search action
			useEffect(() => {
				// Bail out if the modal is not open.
				if (context.isOpen === false) {
					return;
				}
				// Reset and bail out if the search term is less than 3 chars.
				if (context.searchTerm.length < 3) {
					actions.resetState();
					return;
				}

				// Debounced search action
				actions.debounceQuery();
			}, [context.searchTerm]);

			// Handle load more action
			useEffect(() => {
				// Bail out if the modal is not open.
				if (context.isOpen === false) {
					return;
				}
				// Bail out if `lastUpdatedSearchPage` is empty, which indicated "load more" button wasn't clicked.
				if (context.lastUpdatedSearchPage === '') {
					return;
				}
				// Reset and bail out if the search term is less than 3 chars or if the modal is not open
				if (context.searchTerm.length < 3) {
					actions.resetState();
					return;
				}

				// Start a search
				actions.query();
			}, [context.lastUpdatedSearchPage]);

		},
	}
});

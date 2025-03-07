let akBlockToolkitSticky = (options) => {

    if (typeof options !== "object" || !options.hasOwnProperty("target")) {
        return;
    }

    let noContainer = options.hasOwnProperty("container") ? false : true,
        container = options.hasOwnProperty("container") ? document.querySelector(options.container) : document.querySelector(options.target), // Refer to the target as the container if no container is defined
        target = options.hasOwnProperty("container") ? container.querySelector(options.target) : container,
        stickyId = target !== null ? target.getAttribute('id') || 'fse' : '',
        adminBarSpacing = document.body.classList.contains('admin-bar') && window.innerWidth > 782 ? 32 : document.body.classList.contains('admin-bar') && window.innerWidth > 600 && window.innerWidth < 782 ? 46 : 0,
        staticSpacing = adminBarSpacing,
        breakPoint = "breakPoint" in options ? options.breakPoint : 0, // Minimum screen size where you want to enable 'sticky' effect.
        topOffset = "topOffset" in options ? options.topOffset + staticSpacing : 0 + staticSpacing, // Set how far from the top the element will be when made sticky ( to account for fixed menus ..etc) .
        topSpacing = "topSpacing" in options ? options.topSpacing + staticSpacing : 0 + staticSpacing, // Set how far from the top you'd like to position the sticky element ( to account for container padding and margin ).
        activeBodyClass = "activeBodyClass" in options ? options.activeBodyClass : 'sticky-' + stickyId + '-active', // Class that will be added to the body tag when element is active
        preserveLeftPosition = "preserveLeftPosition" in options ? options.preserveLeftPosition : false; // Whether to preserve left position of the element, or just set it to 0 by default

    if (container !== null && target !== null && window.innerWidth > breakPoint) {
        // Prepare the necessary calculations/functions to make the trigger sticky
        let containerHeight, containerTop, stickyHeight, stickyWidth, stickyTop, stickyBottom, stickyLeft, finalStickyTop, finalTopSpacing;
        // get static target position
        containerHeight = container.getBoundingClientRect().height;
        containerTop = window.scrollY + container.getBoundingClientRect().top;

        // Set the container to position 'relative' in a container is defined
        if (noContainer === false) {
            container.style.position = 'relative';
        }

        let resetSticky = () => {
            if (target.classList.contains('sticky') || target.classList.contains('sticky-lock')) {
                target.style.position = '';
                target.style.top = '';
                target.style.left = '';
                target.style.bottom = '';
                target.style.height = '';
                target.style.width = '';
                if (target.classList.contains('sticky-lock')) target.classList.remove('sticky-lock');
                if (target.classList.contains('sticky')) target.classList.remove('sticky');
                if (document.body.classList.contains(activeBodyClass)) document.body.classList.remove(activeBodyClass);
            }
        };

        let calculatePositions = (isResize = false) => {
            // Only recalculate if a container is defined, or if this is triggered from a resize
            if (noContainer !== true || isResize) {
                containerHeight = container.getBoundingClientRect().height;
                containerTop = window.scrollY + container.getBoundingClientRect().top;
            }
            // Recalculate topSpacing on resize
            if (isResize) {
                adminBarSpacing = document.body.classList.contains('admin-bar') && window.innerWidth > 782 ? 32 : document.body.classList.contains('admin-bar') && window.innerWidth > 600 && window.innerWidth < 782 ? 46 : 0;
                fixedHeaderSpacing = document.body.classList.contains('has-fixed-header') ? 120 : 0;
                staticSpacing = adminBarSpacing + fixedHeaderSpacing;
                topSpacing = "topSpacing" in options ? options.topSpacing + staticSpacing : 0 + staticSpacing;
            }

            // Update top spacing
            finalStickyTop = options.activeBodyClass !== 'sticky-nav-active' && document.body.classList.contains('sticky-nav-active') ? topOffset + 48 : topOffset + 0;
            finalTopSpacing = options.activeBodyClass !== 'sticky-nav-active' && document.body.classList.contains('sticky-nav-active') ? topSpacing + 48 : topSpacing + 0;


            stickyHeight = target.getBoundingClientRect().height;
            stickyWidth = container.offsetWidth;
            stickyTop = containerTop - finalStickyTop;
            stickyBottom = (stickyTop + containerHeight) - stickyHeight - Math.abs(finalTopSpacing - finalStickyTop); // used 'Math.abs' to make sure the number is always positive
            stickyLeft = preserveLeftPosition ? target.getBoundingClientRect().left : 0;
        };

        let stickyHandler = () => {
            if ((window.scrollY > stickyTop && stickyBottom > window.scrollY) || (noContainer && window.scrollY > stickyTop)) {

                target.style.left = stickyLeft + 'px';
                target.style.top = finalTopSpacing + 'px';
                target.style.width = stickyWidth + 'px';

                if (target.classList.contains('sticky-lock')) target.classList.remove("sticky-lock");
                if (!target.classList.contains('sticky')) target.classList.add("sticky");
                if (!document.body.classList.contains(activeBodyClass)) document.body.classList.add(activeBodyClass);

            } else if (window.scrollY > stickyBottom && !noContainer) {
                if (document.body.classList.contains(activeBodyClass)) document.body.classList.remove(activeBodyClass);
                if (target.classList.contains('sticky')) target.classList.remove('sticky');
                if (!target.classList.contains('sticky-lock')) target.classList.add("sticky-lock");
            } else {
                resetSticky();
            }
        };

        // recalculate positions on resize and Update sticky element
        window.addEventListener('resize', function () {
            if (window.innerWidth > breakPoint) {
                resetSticky();
                calculatePositions(true);
                stickyHandler();
            } else {
                resetSticky();
            }
        }, true);

        // Update sticky element position on scroll
        window.addEventListener('scroll', function () {
            if (window.innerWidth > breakPoint) {
                calculatePositions();
                stickyHandler();
            } else {
                resetSticky();
            }

        }, true);

        resetSticky();
        calculatePositions(true);
        stickyHandler();
    }

}

// Function for mapping IDs to titles
let akBlockToolkitCreateTitleIdMap = (items, subItems) => {
    let map = {};
    items.forEach(item => {
        let title = item.querySelector('.toc-header').textContent.trim();
        let id = item.dataset.tocId;
        map[akBlockToolkitSanitizeTitle(title)] = id;
    });
    subItems.forEach(item => {
        let title = item.textContent.trim();
        let id = item.dataset.tocId;
        map[akBlockToolkitSanitizeTitle(title)] = id;
    });
    return map;
}

// Function to sanitize titles (similar to PHP's sanitize_title)
function akBlockToolkitSanitizeTitle(text) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
}

document.addEventListener('DOMContentLoaded', () => {
    let toc = document.getElementById('fse-block-toolkit-toc');
    if (toc !== null) {
        /**
         * Apply IDs to H2 and H3 tags
         */

        // Collect ToC main sections and sub-items
        let tocSections = document.querySelectorAll('.toc-main-section');
        let tocSubItems = document.querySelectorAll('.toc-sub-section');

        // Map titles to IDs
        let sectionMap = akBlockToolkitCreateTitleIdMap(tocSections, tocSubItems);

        // Assign IDs to headers in the article for both H2 and H3
        document.querySelectorAll('.entry-content h2, .entry-content h3').forEach(header => {
            let headerTitle = akBlockToolkitSanitizeTitle(header.textContent.trim());
            if (sectionMap[headerTitle]) {
                header.id = sectionMap[headerTitle];
            }
        });

        /**
         * Make the TOC sticky
         */
        akBlockToolkitSticky({
            container: '#fse-block-toolkit-toc-container',
            target: '#fse-block-toolkit-toc',
            breakPoint: 782,
            topOffset: 48,
            topSpacing: 48,
            preserveLeftPosition: true
        });
    }
});
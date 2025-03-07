// Function to extract only the SVG from the HTML string
export const extractSVG = (html) => {
	const div = document.createElement('div');
	div.innerHTML = html.trim();
	const svg = div.querySelector('svg');
	return svg ? svg.outerHTML : '';
};

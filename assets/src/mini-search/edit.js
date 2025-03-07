
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Path, SVG } from '@wordpress/components';
import { Noninteractive } from '../utils/noninteractive';

const Edit = (props) => {
	return (
		<div {...useBlockProps({
			className: 'fse-block-toolkit-mini-search',
		})}>
			<Noninteractive>
				<button className="fse-block-toolkit-mini-search_button" aria-label={__('Search', 'fse-block-toolkit')}>
					<SVG xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 16 16" fill="none">
						<Path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C3.79086 2 2 3.79086 2 6C2 8.2091 3.79086 10 6 10C8.2091 10 10 8.2091 10 6C10 3.79086 8.2091 2 6 2ZM0 6C0 2.68629 2.68629 0 6 0C9.3137 0 12 2.68629 12 6C12 7.29583 11.5892 8.4957 10.8907 9.4765L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L9.4765 10.8907C8.4957 11.5892 7.29583 12 6 12C2.68629 12 0 9.3137 0 6Z" fill="black"></Path>
					</SVG>
				</button>
			</Noninteractive>
		</div>
	);
};

export default Edit;

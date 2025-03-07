import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Path, SVG, PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Noninteractive } from '../utils/noninteractive';

const Edit = ({ attributes, setAttributes }) => {
	const { visibilityDesktop, visibilityTablet, visibilityMobile, selectedNavigation, selectedSecondaryNavigation } = attributes;

	const navigationOptions = useSelect((select) => {
		const navigationPosts = select('core').getEntityRecords('postType', 'wp_navigation', { per_page: -1 });
		if (!navigationPosts) return [];

		return [
			{ value: '', label: __('Select a navigation', 'fse-block-toolkit') },
			...navigationPosts.map((post) => ({
				value: post.id.toString(),
				label: post.title.rendered,
			})),
		];
	}, []);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Visibility Settings', 'fse-block-toolkit')}>
					<ToggleControl
						label={__('Show on Desktop', 'fse-block-toolkit')}
						checked={visibilityDesktop}
						onChange={(value) => setAttributes({ visibilityDesktop: value })}
					/>
					<ToggleControl
						label={__('Show on Tablet', 'fse-block-toolkit')}
						checked={visibilityTablet}
						onChange={(value) => setAttributes({ visibilityTablet: value })}
					/>
					<ToggleControl
						label={__('Show on Mobile', 'fse-block-toolkit')}
						checked={visibilityMobile}
						onChange={(value) => setAttributes({ visibilityMobile: value })}
					/>
				</PanelBody>
				<PanelBody title={__('Navigation Settings', 'fse-block-toolkit')}>
					<SelectControl
						label={__('Select Main Navigation', 'fse-block-toolkit')}
						value={selectedNavigation}
						options={navigationOptions}
						onChange={(value) => setAttributes({ selectedNavigation: value })}
					/>
					<SelectControl
						label={__('Select Secondary Navigation', 'fse-block-toolkit')}
						value={selectedSecondaryNavigation}
						options={navigationOptions}
						onChange={(value) => setAttributes({ selectedSecondaryNavigation: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps({
				className: 'fse-block-toolkit-side-menu',
			})}>
				<Noninteractive>
					<button className="fse-block-toolkit-side_menu_button" aria-label={__('Menu', 'fse-block-toolkit')}>
						<SVG height="32px" width="32px" id="Layer_1" style={{ enableBackground: 'new 0 0 32 32' }} version="1.1" viewBox="0 0 32 32" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
							<Path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z">
							</Path>
						</SVG>
					</button>
				</Noninteractive>
			</div>
		</>
	);
};

export default Edit;

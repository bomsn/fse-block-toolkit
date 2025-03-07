/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports `useBlockProps` React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 * Also imports `BlockControls` to define a toolbar positioned above the block .
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 * @see https://github.com/WordPress/gutenberg/tree/trunk/packages/block-editor/src/components/block-controls
 */
import { useBlockProps, BlockControls, __experimentalUseBorderProps as useBorderProps } from '@wordpress/block-editor';
/**
 * Retrieves all the other components we'll be using for this block.
 */
import { Icon, Spinner } from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import ButtonGapStyles from './button-gap-styles';

export default function Edit({ attributes, clientId }) {
	const [isOpen, setIsOpen] = useState(false);
	const editorCanvasRef = useRef(null);

	// Set store name variable ( source: https://github.com/Automattic/woocommerce-payments/blob/develop/client/data/constants.js )
	const STORE_NAME = 'wc/payments';

	const useCurrencies = () =>
		useSelect((select) => {
			const { getCurrencies, isResolving } = select(STORE_NAME);

			return {
				currencies: getCurrencies(),
				isLoading: isResolving('getCurrencies', []),
			};
		}, []);

	const useEnabledCurrencies = () => {
		const enabledCurrencies = useSelect((select) => {
			const { getEnabledCurrencies } = select(STORE_NAME);

			return getEnabledCurrencies();
		});
		const { submitEnabledCurrenciesUpdate } = useDispatch(STORE_NAME);
		return {
			enabledCurrencies,
			submitEnabledCurrenciesUpdate,
		};
	};

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { isLoading } = useCurrencies();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { enabledCurrencies } = useEnabledCurrencies();

	const enabledCurrencyKeys = enabledCurrencies ? Object.keys(enabledCurrencies) : [];

	const borderProps = useBorderProps(attributes);

	return (
		<>
			<BlockControls />
			<ButtonGapStyles
				blockGap={attributes.style?.spacing?.blockGap}
				clientId={clientId}
				contextRef={editorCanvasRef}
			/>
			<div
				className="fse-block-toolkit-currency-switcher"
				ref={editorCanvasRef}
			>
				<button
					{...useBlockProps({
						className: "fse-block-toolkit-currency-switcher__button " + borderProps.className,
						style: borderProps.style,
						disabled: { isLoading }
					})}
				>
					{isLoading ? (
						<Spinner />
					) : (
						<>
							<span className="fse-block-toolkit-currency-switcher__flag">{enabledCurrencies[enabledCurrencyKeys[0]]?.flag || ''}</span>
							<span className="fse-block-toolkit-currency-switcher__code">{enabledCurrencies[enabledCurrencyKeys[0]]?.code || ''}</span>
							<span className="fse-block-toolkit-currency-switcher__arrow">
								<Icon size="14" icon={<svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M0.84875 0.222229L0 1.14462L7 8.77778L14 1.14462L13.1556 0.222229L7 6.92854L0.84875 0.222229Z" fill="white" />
								</svg>} />
							</span>
						</>
					)}
				</button>
				{!isLoading && (
					<ul className="fse-block-toolkit-currency-switcher__dropdown">
						{enabledCurrencyKeys.map((code) => (
							<li key={enabledCurrencies[code].id}>
								<button onClick={() => setIsOpen(false)}>
									<span className="fse-block-toolkit-currency-switcher__flag">{enabledCurrencies[code]?.flag || ''}</span>
									<span className="fse-block-toolkit-currency-switcher__code">{enabledCurrencies[code]?.code || ''}</span>
									<span className="fse-block-toolkit-currency-switcher__symbol">{enabledCurrencies[code]?.symbol || ''}</span>
								</button>
							</li>
						))}
					</ul>
				)}
			</div >
		</>
	);
}

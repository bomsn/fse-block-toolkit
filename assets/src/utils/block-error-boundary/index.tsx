/**
 * External dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import './style.scss';

interface BlockErrorBase {
	/**
	 * URL of the image to display.
	 * If it's `null` or an empty string, no image will be displayed.
	 * If it's not defined, the default image will be used.
	 */
	imageUrl?: string | undefined;
	/**
	 * Text to display as the heading of the error block.
	 * If it's `null` or an empty string, no header will be displayed.
	 * If it's not defined, the default header will be used.
	 */
	header?: string | undefined;
	/**
	 * Text to display in the error block below the header.
	 * If it's `null` or an empty string, nothing will be displayed.
	 * If it's not defined, the default text will be used.
	 */
	text?: React.ReactNode | undefined;
	/**
	 * Text preceeding the error message.
	 */
	errorMessagePrefix?: string | undefined;
	/**
	 * Button cta.
	 */
	button?: React.ReactNode;
	/**
	 * Controls wether to show the error block or fail silently
	 */
	showErrorBlock?: boolean;
}

export interface BlockErrorProps extends BlockErrorBase {
	/**
	 * Error message to display below the content.
	 */
	errorMessage: React.ReactNode;
}

export type RenderErrorProps = {
	errorMessage: React.ReactNode;
};

export interface BlockErrorBoundaryProps extends BlockErrorBase {
	/**
	 * Override the default error with a function that takes the error message and returns a React component
	 */
	renderError?: (props: RenderErrorProps) => React.ReactNode;
	showErrorMessage?: boolean | undefined;
}

export interface DerivedStateReturn {
	errorMessage: JSX.Element | string;
	hasError: boolean;
}

export interface ReactError {
	status: string;
	statusText: string;
	message: string;
}


const BlockError = ({
	imageUrl = `../../../plugins/woocommerce/assets/images/block-error.svg`,
	header = __('Oops!', 'woocommerce'),
	text = __('There was an error loading the content.', 'woocommerce'),
	errorMessage,
	errorMessagePrefix = __('Error:', 'woocommerce'),
	button,
	showErrorBlock = true,
}: BlockErrorProps): JSX.Element | null => {
	return showErrorBlock ? (
		<div className="fse-block-toolkit-error fse-block-toolkit-components-error">
			{imageUrl && (
				// The alt text is left empty on purpose, as it's considered a decorative image.
				// More can be found here: https://www.w3.org/WAI/tutorials/images/decorative/.
				// Github discussion for a context: https://github.com/woocommerce/woocommerce-blocks/pull/7651#discussion_r1019560494.
				<img
					className="fse-block-toolkit-error__image fse-block-toolkit-components-error__image"
					src={imageUrl}
					alt=""
				/>
			)}
			<div className="fse-block-toolkit-error__content fse-block-toolkit-components-error__content">
				{header && (
					<p className="fse-block-toolkit-error__header fse-block-toolkit-components-error__header">
						{header}
					</p>
				)}
				{text && (
					<p className="fse-block-toolkit-error__text fse-block-toolkit-components-error__text">
						{text}
					</p>
				)}
				{errorMessage && (
					<p className="fse-block-toolkit-error__message fse-block-toolkit-components-error__message">
						{errorMessagePrefix ? errorMessagePrefix + ' ' : ''}
						{errorMessage}
					</p>
				)}
				{button && (
					<p className="fse-block-toolkit-error__button fse-block-toolkit-components-error__button">
						{button}
					</p>
				)}
			</div>
		</div>
	) : null;
};

class BlockErrorBoundary extends Component<BlockErrorBoundaryProps> {
	state = { errorMessage: '', hasError: false };

	static getDerivedStateFromError(error: ReactError): DerivedStateReturn {
		if (
			typeof error.statusText !== 'undefined' &&
			typeof error.status !== 'undefined'
		) {
			return {
				errorMessage: (
					<>
						<strong>{error.status}</strong>:&nbsp;
						{error.statusText}
					</>
				),
				hasError: true,
			};
		}

		return { errorMessage: error.message, hasError: true };
	}

	render(): JSX.Element | React.ReactNode {
		const {
			header,
			imageUrl,
			showErrorMessage = true,
			showErrorBlock = true,
			text,
			errorMessagePrefix,
			renderError,
			button,
		} = this.props;
		const { errorMessage, hasError } = this.state;

		if (hasError) {
			if (typeof renderError === 'function') {
				return renderError({ errorMessage });
			}
			return (
				<BlockError
					showErrorBlock={showErrorBlock}
					errorMessage={showErrorMessage ? errorMessage : null}
					header={header}
					imageUrl={imageUrl}
					text={text}
					errorMessagePrefix={errorMessagePrefix}
					button={button}
				/>
			);
		}

		return this.props.children;
	}
}

export { BlockErrorBoundary }

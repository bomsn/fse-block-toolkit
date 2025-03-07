import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Button, Placeholder, ToggleControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ServerSideRender from '@wordpress/server-side-render';
import { Noninteractive } from '../utils/noninteractive';

const AVAILABLE_ITEMS = [
	{ id: 'image', label: __('Featured Image') },
	{ id: 'title', label: __('Title') },
	{ id: 'date', label: __('Date') },
	{ id: 'author', label: __('Author') },
	{ id: 'excerpt', label: __('Excerpt') },
];


export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();

	const pages = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'page', { per_page: -1 });
	}, []);

	const pageOptions = pages
		? [{ value: 0, label: __('Select a page') }].concat(
			pages.map((page) => ({ value: page.id, label: page.title.rendered }))
		)
		: [{ value: 0, label: __('Loading...') }];

	const onDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(attributes.selectedItems);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setAttributes({ selectedItems: items });
	};

	const addItem = (item) => {
		if (!attributes.selectedItems.includes(item)) {
			setAttributes({ selectedItems: [...attributes.selectedItems, item] });
		}
	};

	const removeItem = (item) => {
		setAttributes({ selectedItems: attributes.selectedItems.filter((i) => i !== item) });
	};

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Page Settings')}>
					<SelectControl
						label={__('Select Page')}
						value={attributes.selectedPageId}
						options={pageOptions}
						onChange={(pageId) => setAttributes({ selectedPageId: parseInt(pageId) })}
					/>
				</PanelBody>
				<PanelBody title={__('Card Content')}>
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId="list">
							{(provided) => (
								<ul {...provided.droppableProps} ref={provided.innerRef}>
									{attributes.selectedItems.map((item, index) => (
										<Draggable key={item} draggableId={item} index={index}>
											{(provided) => (
												<li
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													{AVAILABLE_ITEMS.find((i) => i.id === item).label}
													<Button isSmall isDestructive onClick={() => removeItem(item)}>
														Remove
													</Button>
												</li>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</ul>
							)}
						</Droppable>
					</DragDropContext>
					<SelectControl
						label={__('Add Item')}
						value=""
						options={[
							{ value: '', label: __('Select an item to add') },
							...AVAILABLE_ITEMS.filter((item) => !attributes.selectedItems.includes(item.id)).map(
								(item) => ({ value: item.id, label: item.label })
							),
						]}
						onChange={(item) => item && addItem(item)}
					/>
					{attributes.selectedItems.includes("title") && (
						<>
							<ToggleControl
								label="Enable Custom Title"
								checked={attributes.enableCustomTitle}
								onChange={(value) => setAttributes({ enableCustomTitle: value })}
							/>
							{attributes.enableCustomTitle && (
								<TextControl
									label="Custom Title"
									value={attributes.customTitle}
									onChange={(value) => setAttributes({ customTitle: value })}
								/>
							)}
						</>
					)}
				</PanelBody>
			</InspectorControls>
			{attributes.selectedPageId ? (
				<Noninteractive>
					<ServerSideRender
						block="fse-block-toolkit/page-card"
						attributes={attributes}
					/>
				</Noninteractive>
			) : (
				<Placeholder
					icon="admin-page"
					label={__('Page Card')}
					instructions={__('Select a page to display its content in a card format.')}
				>
					<SelectControl
						value={attributes.selectedPageId}
						options={pageOptions}
						onChange={(pageId) => setAttributes({ selectedPageId: parseInt(pageId) })}
					/>
				</Placeholder>
			)}
		</div>
	);
}

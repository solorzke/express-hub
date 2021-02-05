import React, { useState } from 'react';
import RichTextEditor from 'react-rte';

const toolbarConfig = {
	// Optionally specify the groups to display (displayed in the order listed).
	display: [ 'INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS' ],
	INLINE_STYLE_BUTTONS: [
		{ label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
		{ label: 'Italic', style: 'ITALIC' },
		{ label: 'Underline', style: 'UNDERLINE' }
	],
	BLOCK_TYPE_DROPDOWN: [
		{ label: 'Normal', style: 'unstyled' },
		{ label: 'Heading Large', style: 'header-one' },
		{ label: 'Heading Medium', style: 'header-two' },
		{ label: 'Heading Small', style: 'header-three' }
	],
	BLOCK_TYPE_BUTTONS: [ { label: 'UL', style: 'unordered-list-item' }, { label: 'OL', style: 'ordered-list-item' } ]
};

const Editor = (props) => {
	const [ value, setValue ] = useState(RichTextEditor.createEmptyValue());
	const onChange = (val) => {
		setValue(val);
		if (val) props.onChange(value.toString('html'));
	};

	return (
		<RichTextEditor
			placeholder="Enter additional notes or details about the order below"
			value={value}
			onChange={onChange}
			toolbarConfig={toolbarConfig}
		/>
	);
};

export default Editor;

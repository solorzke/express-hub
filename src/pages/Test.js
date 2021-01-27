import FileInput from '../components/Inputs/Files';

const Test = () => {
	const onFilesChange = (files) => {
		console.table(files);
	};

	const onDelete = () => {
		console.log('deleted');
	};

	return (
		<FileInput
			itemName="Item Name"
			quantity="2"
			onFilesChange={onFilesChange.bind(this)}
			onDelete={() => onDelete()}
		/>
	);
};

export default Test;

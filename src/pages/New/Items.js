import React, { useState, useEffect, useRef } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import { useLocation, Redirect } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import FileInput from '../../components/Inputs/Files';

//Wrapper for the Body component
const Items = () => <Wrapper children={<Body />} current="New Order" active="new" />;

const Body = () => {
	//Location declared to determine if the page has form data passed into it or else redirect it to another page
	const location = useLocation();
	const [ items, setItems ] = useState({});
	/* BLUEPRINT OF THE ITEMS ARRAY TO DETERMINE HOW TO STRUCTURE ITS IMPORTANT FEATURES
		items: {
				createObjectKey('Item Name') => 'itemname' : {
					avi: ...avi_obj, 
					files: ...files_obj,
					quantity: number,
					name: formatString(item name) => Item Name
				},
			...
		}
	*/

	useEffect(
		() => {
			console.table(items);
			document.getElementById('item').value = '';
			document.getElementById('quantity').value = '1';
		},
		[ items ]
	);

	//Add the item and its quanity from the form to the state
	const addItem = () => {
		//Check if the input is empty
		if (document.getElementById('item').value === '') return alert('Enter an item.');
		if (itemAlreadyExists(document.getElementById('item').value.toLowerCase()))
			return alert('Item is already added. Add a new one');
		const item = document.getElementById('item').value.toLowerCase();
		const key = createObjectKey(item);
		const quantity = document.getElementById('quantity').value;
		setItems({ ...items, [key]: { name: item, quantity: quantity } });
	};

	//Prevent the user from adding the same item in the state by accident
	const itemAlreadyExists = (input) => {
		const key = createObjectKey(input);
		const results = Object.keys(items).filter((item) => items[item] === key);
		return results.length > 0 ? true : false;
	};

	//On submission of the form, create an obj of all the items and its files and proceed to the next page
	const onSubmit = (e) => {
		e.preventDefault();
		addItem();
	};

	//Delete the item from the state
	const onDelete = (e, key) => {
		e.preventDefault();
		let copy = items;
		delete copy[key];
		setItems(copy);
	};

	//Log the current state of the files uploaded to the console
	const onFilesChange = (files, avi, key) => {
		console.table(files);
		console.table(avi);
		let copy = items[key];
		copy['files'] = files;
		copy['avi'] = avi;
		setItems({ ...items, [key]: copy });
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	const createObjectKey = (name) => name.split(' ').join('');

	return (
		<main className="container p-3">
			{location.state !== undefined ? '' : <Redirect to="error" />}
			<h1>Add Items to Order</h1>
			<p>
				Enter all of the items you'd like to add to this order before finalizing. Take this opportunity to
				upload any files or documents that are pertinent to each of your items before proceeding.
			</p>
			<p>You can update this information later if you wish.</p>
			<p className="mb-5">Press 'Continue' when you are done adding items/files to proceed to the final step.</p>
			<form onSubmit={(e) => onSubmit(e)}>
				<div className="form-group row">
					<Input
						required={false}
						column="col-md-10"
						id="item"
						label="Item"
						type="text"
						placeholder="Item Name"
						name="item"
					/>
					<Input
						required={false}
						column="col-md-2"
						id="quantity"
						label="Quantity"
						type="number"
						placeholder="Quantity"
						name="quantity"
					/>
				</div>
				<input type="submit" className="btn btn-primary float-right d-inline" value="Add Item" />
				<button className="btn-success btn float-right d-inline mr-3" onClick={() => alert('hello')}>
					Continue
				</button>
			</form>
			<br />
			<div className="pt-5">
				{Object.keys(items).map((key) => {
					const name = formatString(items[key].name);
					const quantity = items[key].quantity;
					return (
						<FileInput
							itemKey={key}
							itemName={name}
							quantity={quantity}
							onDelete={(e) => onDelete(e, key)}
							onFilesChange={onFilesChange.bind(this)}
						/>
					);
				})}
			</div>
		</main>
	);
};

export default Items;

import React, { useState, useEffect, Fragment } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import Input from '../../components/Inputs/Input';
import FileInput from '../../components/Inputs/Files';
import Prompt from '../../components/Inputs/Prompt';
import SlideCard from '../../components/SlideCard/Card';

//Wrapper for the Body component
const Items = () => <Wrapper children={<Body />} current="Nuevo Orden" active="new" />;

const Body = () => {
	//Location declared to determine if the page has form data passed into it or else redirect it to another page
	const location = useLocation();
	const history = useHistory();
	const [ items, setItems ] = useState({});
	const [ promptKey, setPromptKey ] = useState(null);
	const [ prompt, setPrompt ] = useState(false);
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
		if (document.getElementById('item').value === '') return alert('Ingrese un artículo.');
		if (itemAlreadyExists(document.getElementById('item').value.toLowerCase()))
			return alert('El artículo ya está agregado. Agregar uno nuevo.');
		const item = document.getElementById('item').value.toLowerCase();
		const key = createObjectKey(item);
		const quantity = document.getElementById('quantity').value;
		setItems({ ...items, [key]: { name: item, quantity: quantity } });
	};

	//Prevent the user from adding the same item in the state by accident
	const itemAlreadyExists = (input) => {
		const key = createObjectKey(input);
		const results = Object.keys(items).filter((item) => item === key);
		return results.length > 0 ? true : false;
	};

	//On submission of the form, create an obj of all the items and its files and proceed to the next page
	const onSubmit = (e) => {
		e.preventDefault();
		addItem();
	};

	//Once the Continue button is clicked, move on to the next page with the state item data passed in
	const onFinish = (e) => {
		e.preventDefault();
		if (Object.keys(items).length === 0) return alert('Agregue al menos un artículo para su pedido.');
		location.state['items'] = [];
		Object.keys(items).forEach((item) => {
			let currentItem = items[item];
			location.state['items'] = [
				...location.state['items'],
				{ name: currentItem.name, quantity: currentItem.quantity }
			];
		});

		const data = { items: items, form: location.state };
		history.push('/cloud/new-order/add-order/submit', data);
	};

	//Delete the item from the state
	const onDelete = (e, key) => {
		e.preventDefault();
		let copy = items;
		delete copy[key];
		setItems({ ...copy });
	};

	//Update the item name, quantity or both
	const onUpdate = (e, key) => {
		e.preventDefault();
		setPrompt(true);
		setPromptKey(key);
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

	const onPromptSubmission = (quantity, itemName, key) => {
		if (itemName !== '') {
			if (itemAlreadyExists(itemName)) return alert('Ese artículo ya existe.');
			//Change the key name by creating a new object with the same properties and deleting the old one
			const newKey = createObjectKey(itemName.toLowerCase());
			let itemsCopy = items;
			itemsCopy[newKey] = items[key];
			//Delete the old key obj from the new obj
			delete itemsCopy[key];
			//assign the updated values to the new obj key
			itemsCopy[newKey]['name'] = itemName.toLowerCase();
			// //Update the new updated items state
			setItems({ ...itemsCopy });
			//Reassign the key value for the quantity code below to find the new key if updated
			key = newKey;
		}
		if (quantity !== '') {
			let copy = items[key];
			copy['quantity'] = quantity;
			setItems({ ...items, [key]: copy });
		}
		setPrompt(false);
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	//Create a key for the state item
	const createObjectKey = (name) => name.split(' ').join('');

	return (
		<main className="container p-3">
			{location.state !== undefined ? '' : <Redirect to="error" />}
			<Paths message="¿Estás seguro de que quieres volver? Todos sus elementos y archivos se eliminarán y no se podrán recuperar." />
			<div className="row">
				<SlideCard
					children={
						<div className="row">
							<Description />
							<ItemsForm onSubmit={onSubmit.bind(this)} onFinish={onFinish.bind(this)} />
						</div>
					}
					title="Sumisión"
					icon="fas fa-keyboard pr-3"
				/>
			</div>
			<div className="row">
				<SlideCard
					children={
						<OrderItems
							items={items}
							onUpdate={onUpdate.bind(this)}
							onDelete={onDelete.bind(this)}
							onFilesChange={onFilesChange.bind(this)}
							formatString={formatString.bind(this)}
						/>
					}
					title="Artículos"
					icon="fas fa-clipboard-list pr-3"
				/>
			</div>
			<Prompt
				modalShow={prompt}
				onHide={() => setPrompt(false)}
				currentItem={items[promptKey] !== undefined ? items[promptKey].name : 'NULL'}
				currentQuantity={items[promptKey] !== undefined ? items[promptKey].quantity : 'NULL'}
				onPromptSubmission={onPromptSubmission.bind(this)}
				itemKey={promptKey}
			/>
		</main>
	);
};

const OrderItems = ({ items, onUpdate, onDelete, onFilesChange, formatString }) => (
	<Fragment>
		<br />
		<div id="order-items" className="p-3">
			{Object.keys(items).map((key) => {
				const name = formatString(items[key].name);
				const quantity = items[key].quantity;
				return (
					<FileInput
						itemKey={key}
						itemName={name}
						quantity={quantity}
						onUpdate={(e) => onUpdate(e, key)}
						onDelete={(e) => onDelete(e, key)}
						onFilesChange={onFilesChange}
					/>
				);
			})}
		</div>
	</Fragment>
);

const ItemsForm = ({ onSubmit, onFinish }) => (
	<div className="col-lg justify-content-center align-items-center d-flex pt-3">
		<form onSubmit={onSubmit}>
			<div className="form-group row">
				<Input
					required={false}
					column="col-md-10"
					id="item"
					label="Artículo"
					type="text"
					placeholder="Nombre del árticulo"
					name="item"
				/>
				<Input
					required={false}
					column="col-md-2"
					id="quantity"
					label="Cantidad"
					type="number"
					placeholder="Cantidad"
					name="quantity"
				/>
			</div>
			<input type="submit" className="btn btn-primary float-right d-inline" value="Añadir Artículo" />
			<button className="btn-success btn float-right d-inline mr-3" onClick={onFinish}>
				Continuar
			</button>
		</form>
	</div>
);

const Description = () => (
	<div className="col-lg">
		<div id="description">
			<h1>Agregar Artículos al Pedido</h1>
			<p>
				Ingrese todos los artículos que le gustaría agregar a este pedido antes de finalizar. Aproveche esta
				oportunidad para cargar cualquier archivo o documento que sea pertinente a cada uno de sus artículos
				antes de continuar.
			</p>
			<p>Puede actualizar esta información más tarde si lo desea.</p>
			<p className="mb-0">
				Presione 'Continuar' cuando haya terminado de agregar elementos / archivos para continuar con el paso
				final.
			</p>
		</div>
	</div>
);

const Paths = ({ message }) => {
	const onClick = (e, path) => {
		e.preventDefault();
		if (window.confirm(message)) window.location.href = path;
	};
	return (
		<Breadcrumb>
			<Breadcrumb.Item href="/cloud/new-orders" onClick={(e) => onClick(e, '/cloud/new-order/')}>
				Home
			</Breadcrumb.Item>
			<Breadcrumb.Item
				href="/cloud/new-orders/add-order"
				onClick={(e) => onClick(e, '/cloud/new-order/add-order')}
			>
				Pedido
			</Breadcrumb.Item>
			<Breadcrumb.Item active>Artículos</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default Items;

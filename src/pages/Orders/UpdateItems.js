import React, { useState, useEffect, useRef } from 'react';
import { Config } from '../../data/Config';
import { useLocation } from 'react-router-dom';
import { Accordion, Button, ListGroup, Card } from 'react-bootstrap';
import SlideCard from '../../components/SlideCard/Card';
import Loading from '../../components/Placeholders/Loading';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import Wrapper from '../../components/Wrapper/Wrapper';
import BackButton from '../../components/BackButton/Back';
import Input from '../../components/Inputs/Input';
import Prompt from '../../components/Inputs/Prompt';
import Toast from '../../components/Toast/Toast';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const useQuery = () => new URLSearchParams(useLocation().search);
Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const UpdateItems = () => <Wrapper children={<Body />} active="orders" current="Update Items List" />;

const Body = () => {
	const ORDER_ID = useQuery().get('id');
	const [ ORDER, setOrder ] = useState(null);
	const [ ITEMS, setItems ] = useState({});
	const [ PROMPT, setPrompt ] = useState(false);
	const [ PROMPTKEY, setPromptKey ] = useState(null);
	//State data that control the toast message
	const [ toast, setToast ] = useState(false);
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ message, setMessage ] = useState('Updating Order...');
	const [ heading, setHeading ] = useState('Collecting files and updating them to the cloud');

	useEffect(
		() => {
			if (ORDER === null) getOrder();
			if (ORDER !== null) {
				document.getElementById('item').value = '';
				document.getElementById('quantity').value = '1';
			}
		},
		[ ORDER, ITEMS, PROMPT, PROMPTKEY ]
	);

	//Set the state for the toast props
	const setToastProps = (toastImg, toastHeading, toastMessage, log, action) => {
		setImg(toastImg);
		setHeading(toastHeading);
		setMessage(toastMessage);
		console.log(log);
		setTimeout(() => {
			setToast(false);
			setImg('fas fa-spinner fa-pulse');
			setHeading('Deleting Client and their orders...');
			setMessage('Deleting Client');
			console.log('Toast Props set to normal.');
			if (action) window.location.href = '/orders';
		}, 3000);
	};

	//On submission of the form, create an obj of all the items and its files and proceed to the next page
	const onItemSubmit = (e) => {
		e.preventDefault();
		addItem();
	};

	//Add the item and its quanity from the form to the state
	const addItem = () => {
		//Check if the input is empty
		if (document.getElementById('item').value === '') return alert('Enter an item.');
		if (itemAlreadyExists(document.getElementById('item').value.toLowerCase()))
			return alert('Item is already added. Add a new one');
		const item = document.getElementById('item').value.toLowerCase();
		const key = createObjectKey(item);
		const quantity = document.getElementById('quantity').value;
		setItems({ ...ITEMS, [key]: { name: item, quantity: quantity, files: [] } });
	};

	const getOrder = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('orders').where('orderId', '==', ORDER_ID).get();
			let order_doc = [];
			snapshot.forEach((item) => order_doc.push(item.data()));
			setOrder(order_doc[0]);
			order_doc[0].items.map((item) => {
				const key = createObjectKey(item.name);
				const docKeys = Object.keys(order_doc[0]['item-images']);
				const avi = docKeys.filter((docKey) => docKey === `${key}-avi`);
				const relevantDocs = docKeys
					.filter((docKey) => docKey.includes(key) && docKey !== `${key}-avi`)
					.map((doc) => ({ name: doc, path: order_doc[0]['item-images'][doc] }));
				const data = {
					[key]: {
						quantity: item.quantity,
						name: item.name,
						avi: { path: order_doc[0]['item-images'][avi[0]] },
						files: relevantDocs
					}
				};
				setItems((STATE) => ({ ...STATE, ...data }));
			});
			console.log('> Firebase: Order retrieved!');
		} catch (error) {
			console.error('> Firebase: Could not proceed with request');
			console.error(error);
		}
	};

	//Extract and remove the file item by matching the index of the item in the filter loop.
	const onRemoveFile = async (index, itemKey, stateHandler) => {
		stateHandler(index);
		let copy = ITEMS[itemKey]['files'][index];
		const FieldValue = Firebase.firestore.FieldValue;
		console.log(copy);
		const filtered_files = ITEMS[itemKey]['files'].filter((item, i) => index !== i);
		await Firebase.storage().ref(`images/${ORDER_ID}/${copy.name}`).delete().catch((e) => console.error(e));
		await Firebase.firestore()
			.collection('orders')
			.doc(ORDER_ID)
			.update({
				['item-images.' + copy.name]: FieldValue.delete()
			})
			.catch((e) => console.error(e));
		// await Firebase.storage().ref(`images/${ORDER_ID}`).child(copy.name).delete();
		setItems((STATE) => ({
			...STATE,
			[itemKey]: {
				...STATE[itemKey],
				files: filtered_files
			}
		}));
		stateHandler(false);
	};

	//Once the Update/Save button is clicked, move on to the next page with the state item data passed in
	const onFinish = async (e) => {
		try {
			e.preventDefault();
			setToast(true);
			if (Object.keys(ITEMS).length === 0) return alert('Please add at least one item for your order.');
			const payload = await uploadFilesToStorage();
			const response = await updateOrderToFirestore(payload);
			setToastProps(
				'fas fa-check-circle toast-success',
				'Update Complete!',
				`The order was updated to the cloud!`,
				`> Firebase: Order: ${ORDER_ID} and its items are updated to the system.`,
				true
			);
			if (response) window.location.reload();
		} catch (error) {
			console.error('> Firebase: request couldnt go through');
			console.error(error);
			setToastProps(
				'fas fa-check-circle toast-success',
				'Update Failed!',
				`The order could not update to the cloud!`,
				`> Firebase: Order: ${ORDER_ID} and its information weren't updated to the system.`,
				false
			);
		}
	};

	//Returns a promise with the downloaded url of the image uploaded to the cloud storage
	const uploadFile = (doc, orderId, itemKey, documentName) =>
		new Promise((resolve, reject) => {
			//Prepare the path of the image with the order id for the folder, and document name with the item key as its title
			const formattedDocName = documentName.replace('.', '_');
			const path = `images/${orderId}/${itemKey}-${formattedDocName}`;
			Firebase.storage().ref(path).put(doc).then((snapshot) => {
				snapshot.ref.getDownloadURL().then((url) => {
					resolve({ name: `${itemKey}-${formattedDocName}`, path: url });
				});
			});
		});

	const uploadFilesToStorage = () =>
		new Promise(async (resolve, reject) => {
			//Urls and Avis array are to keep all data that belongs to each item
			let urls = [];
			let avis = [];
			let fileKeys = Object.keys(ITEMS);
			//Pop every itemkey during the while loop sequence and run the code below
			do {
				const currentItemKey = fileKeys.pop();
				const avi = ITEMS[currentItemKey].avi;
				//Choose to upload the avi file data only if it is present with 'file' key property, or pass the obj with the current avi data
				const aviCon = avi.hasOwnProperty('file')
					? await uploadFile(avi.file, ORDER_ID, currentItemKey, 'avi')
					: { name: `${currentItemKey}-avi`, path: avi.path };
				avis.push(aviCon);
				const files = ITEMS[currentItemKey].files;
				//In the loop, determine if the current file is of File prototype, then upload the file and push its response to the url array
				for (let i = 0; i < files.length; i++) {
					//Check if file matches file prototype
					if (files[i] instanceof File) {
						const path = await uploadFile(files[i], ORDER_ID, currentItemKey, files[i].name);
						urls.push(path);
					} else {
						urls.push(files[i]);
					}
				}
			} while (fileKeys.length !== 0);
			console.log(ORDER);
			resolve({ files: urls, avi: avis });
		});

	//After the files are uploaded to storage, use the payload response, format it, and update the order with the new information to the firestore
	const updateOrderToFirestore = (payload) =>
		new Promise((resolve, reject) => {
			let copy = ITEMS;
			//Create an empty array that'll house our item document info, in the obj format of [document.name] = document.path
			let itemsImagesPayload = {};
			[ ...payload.files, ...payload.avi ].forEach((item) => (itemsImagesPayload[item.name] = item.path));
			//Create an array of objs that store name and quantity of every order set in the state.
			const itemInfoPayload = Object.keys(copy).map((item) => ({
				name: copy[item].name,
				quantity: copy[item].quantity
			}));
			//Update the document in the firestore with the new item information
			Firebase.firestore()
				.collection('orders')
				.doc(ORDER_ID)
				.update({ items: itemInfoPayload, 'item-images': { ...itemsImagesPayload } })
				.then(() => resolve(true));
		});

	//Track changes to the input ref for avi image of the item, update its data to the state, and set the img source to
	//the uploaded avi image.
	const onAviChange = (e, ref, itemKey) => {
		const url = URL.createObjectURL(e.target.files[0]);
		setItems((STATE) => ({
			...STATE,
			[itemKey]: {
				...STATE[itemKey],
				avi: { path: url, file: e.target.files[0] }
			}
		}));
		// ref.current.src = url;
		// setAvi(e.target.files[0]);
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};
	//Set a default image from a url to the avi as a placeholder until it is changed
	const setDefaultImage = (item, key) => {
		const placeholder = 'https://www.nbmchealth.com/wp-content/uploads/rem/2018/04/default-placeholder.png';
		if (item.hasOwnProperty('avi')) {
			return item.avi.path;
		} else {
			setItems((prevState) => ({
				...prevState,
				[key]: {
					...prevState[key],
					avi: { path: placeholder }
				}
			}));
			return placeholder;
		}
	};

	//Create a key for the state item
	const createObjectKey = (name) => name.split(' ').join('');

	//Track what type of action the onClick function was triggered for and execute its case subroutine
	const onTriggerInput = (type, aviInputRef, fileRef) => {
		switch (type) {
			case 'avi':
				aviInputRef.current.click();
				return;
			default:
				fileRef.current.click();
		}
	};

	//Update the files state by uploading the entire files' object/array from the event obj and set the event key to 0.
	//'0' meaning trigger the Accordian Body reveal with the file items displayed vs. '1' meaning hide the Accordian Body
	const addFile = (e, currentItemKey) => {
		const inputFiles = e.target.files;
		let data = [ ...ITEMS[currentItemKey]['files'] ];
		Object.keys(inputFiles).forEach((item) => (data = [ ...data, inputFiles[item] ]));
		setItems((STATE) => ({
			...STATE,
			[currentItemKey]: {
				...STATE[currentItemKey],
				files: data
			}
		}));
		// if (key !== 0) setKey('0');
	};

	//Update the item name, quantity or both
	const onUpdate = (e, key) => {
		e.preventDefault();
		setPrompt(true);
		setPromptKey(key);
	};

	//Delete the item from the state
	const onDelete = (e, key) => {
		e.preventDefault();
		let copy = ITEMS;
		delete copy[key];
		setItems({ ...copy });
	};

	//Prevent the user from adding the same item in the state by accident
	const itemAlreadyExists = (input) => {
		const key = createObjectKey(input.toLowerCase());
		const results = Object.keys(ITEMS).filter((item) => item === key);
		return results.length > 0 ? true : false;
	};

	const onPromptSubmission = (quantity, itemName, key) => {
		if (itemName !== '') {
			if (itemAlreadyExists(itemName)) return alert('That item already exists.');
			//Change the key name by creating a new object with the same properties and deleting the old one
			const newKey = createObjectKey(itemName.toLowerCase());
			let itemsCopy = ITEMS;
			itemsCopy[newKey] = ITEMS[key];
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
			let copy = ITEMS[key];
			copy['quantity'] = quantity;
			setItems({ ...ITEMS, [key]: copy });
		}
		setPrompt(false);
	};
	if (ORDER === null) return <LoadingPage />;
	return (
		<main className="container-fluid pt-3">
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<BackButton
				value="Go Back To Order"
				message="Are you sure you want to go back to the previous page? All current data will be lost."
				path={document.referrer}
			/>
			<div className="row">
				<SlideCard
					children={
						<div className="row">
							<Description />
							<ItemsForm onSubmit={onItemSubmit.bind(this)} onFinish={onFinish.bind(this)} />
						</div>
					}
					title="Submission"
					icon="fas fa-keyboard pr-3"
				/>
			</div>
			<div className="row">
				<SlideCard
					children={
						<CloudItems
							order={ITEMS}
							addFile={addFile.bind(this)}
							setDefaultImage={setDefaultImage.bind(this)}
							formatString={formatString.bind(this)}
							onAviChange={onAviChange.bind(this)}
							onTriggerInput={onTriggerInput.bind(this)}
							onUpdate={onUpdate.bind(this)}
							onDelete={onDelete.bind(this)}
							onRemoveFile={onRemoveFile.bind(this)}
						/>
					}
					title="Items"
					icon="fas fa-clipboard-list pr-3"
				/>
			</div>
			{/* <Undo onClick={() => alert('hello')} onClose={() => alert('goodbye')} /> */}
			<Prompt
				modalShow={PROMPT}
				onHide={() => setPrompt(false)}
				itemKey={PROMPTKEY}
				currentItem={ITEMS[PROMPTKEY] !== undefined ? ITEMS[PROMPTKEY].name : 'NULL'}
				currentQuantity={ITEMS[PROMPTKEY] !== undefined ? ITEMS[PROMPTKEY].quantity : 'NULL'}
				onPromptSubmission={onPromptSubmission.bind(this)}
			/>
		</main>
	);
};

const Description = () => (
	<div className="col">
		<div id="description">
			<h1>Add/Update Items to Order</h1>
			<p>
				Enter all of the items you'd like to add to this order before finalizing. Take this opportunity to
				upload any files or documents that are pertinent to each of your items.
			</p>
			<p className="mb-5">Click 'Update' when you are done adding items/files to update the order.</p>
		</div>
	</div>
);

const ItemsForm = ({ onSubmit, onFinish }) => (
	<div className="col justify-content-center align-items-center d-flex">
		<form onSubmit={onSubmit}>
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
			<button className="btn-success btn float-right d-inline mr-3" onClick={onFinish}>
				Update & Save Order
			</button>
		</form>
	</div>
);

const CloudItems = (props) => (
	<div className="cloud-items">
		{Object.keys(props.order).map((item, index) => {
			const cloudItem = props.order[item];
			const aviPath = props.setDefaultImage(props.order[item], item);
			const name = props.formatString(cloudItem.name);
			return (
				<FileBox
					key={index}
					itemKey={item}
					files={cloudItem.files}
					aviPath={aviPath}
					itemName={name}
					quantity={cloudItem.quantity}
					addFile={props.addFile}
					onUpdate={props.onUpdate}
					onDelete={props.onDelete}
					onRemoveFile={props.onRemoveFile}
					onAviChange={props.onAviChange}
					onTriggerInput={props.onTriggerInput}
				/>
			);
		})}
	</div>
);

const FileBox = (props) => {
	//Refs
	let aviInputRef = useRef(null);
	let aviRef = useRef(null);
	let fileRef = useRef(null);

	//State
	const [ LOAD, setLoad ] = useState(false);

	const handleAddFile = (e) => {
		props.addFile(e, props.itemKey);
	};

	useEffect(() => {}, [ aviInputRef, aviRef, fileRef ]);

	const Avi = () => (
		<div className="col-md-2 d-flex justify-content-center align-items-center">
			<button
				className="btn btn-default btn-file"
				onClick={() => props.onTriggerInput('avi', aviInputRef, fileRef)}
			>
				<input
					onChange={(e) => props.onAviChange(e, aviRef, props.itemKey)}
					ref={aviInputRef}
					type="file"
					id={`${props.itemKey}-avi`}
					style={{ display: 'none' }}
					accept="image/*"
				/>
				<img src={props.aviPath} ref={aviRef} className="text-center" height="50" width="50" id="avi" />
			</button>
		</div>
	);

	const Box = () => (
		<span className="d-inline">
			<h5 className="d-inline">{props.itemName}</h5>
			<p>
				Quantity: {props.quantity}
				<span className="pl-1">
					<button
						className="btn btn-link"
						type="button"
						onClick={() => props.onTriggerInput('file', aviInputRef, fileRef)}
					>
						<input
							ref={fileRef}
							type="file"
							multiple
							className="btn btn-link py-0 px-3"
							onChange={handleAddFile}
							style={{ display: 'none' }}
						/>
						Add File(s)
					</button>
					<button className="btn btn-link" type="button" onClick={(e) => props.onUpdate(e, props.itemKey)}>
						Update Item
					</button>
					<button className="btn btn-link" type="button" onClick={(e) => props.onDelete(e, props.itemKey)}>
						Remove Item
					</button>
				</span>
			</p>
		</span>
	);

	const Chevron = () => (
		<Accordion.Toggle as={Button} variant="link" eventKey="0" className="p-0 float-right d-inline">
			<i className="fas fa-chevron-down float-right" />
		</Accordion.Toggle>
	);

	const Items = () =>
		props.files.map((item, index) => (
			<ListGroup.Item
				key={index}
				className="file-item"
				style={{
					borderBottom: index === props.files.length - 1 ? '1px solid #e8e8e8' : ''
				}}
			>
				{item.name}
				<button
					className="btn btn-danger float-right"
					type="button"
					onClick={() => {
						props.onRemoveFile(index, props.itemKey, setLoad);
					}}
				>
					{LOAD === index ? <Loading /> : 'Remove'}
				</button>
			</ListGroup.Item>
		));

	const Header = () => (
		<Card.Header className="px-2 py-0">
			<div className="row">
				<Avi />
				<div className="col-md-10 pl-3 text-left pt-2">
					<Chevron />
					<Box />
				</div>
			</div>
		</Card.Header>
	);

	const Body = () => (
		<Accordion.Collapse eventKey="0">
			<Card.Body className="p-0">
				<ListGroup variant="flush">
					<Items />
				</ListGroup>
			</Card.Body>
		</Accordion.Collapse>
	);

	return (
		<div className="w-100" id="order-items">
			<Accordion>
				<Card>
					<Header />
					<Body />
				</Card>
			</Accordion>
		</div>
	);
};

export default UpdateItems;

// console.log(`Is it a file: ${inputFiles[0] instanceof File}`);

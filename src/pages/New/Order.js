import React, { useState, useRef } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import Toast from '../../components/Toast/Toast';
import Input from '../../components/Inputs/Input';
import Async from 'react-async';
import { Config } from '../../data/Config';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Order = () => <Wrapper children={<Body />} current="New Order" />;

const Body = () => {
	//Select refs for clients, country, province, order-receipt file, shipping receipt file, and item image
	let clientRef = useRef(null);
	let countryRef = useRef(null);
	let provinceRef = useRef(null);
	let orderRef = useRef(null);
	let shippingRef = useRef(null);
	let itemImageRef = useRef(null);

	//State objects for use throughout the component
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ toast, setToast ] = useState(false);
	const [ message, setMessage ] = useState('Adding Client...');
	const [ heading, setHeading ] = useState('Processing');

	//Request a list of clients from the firestore
	const getClients = async () => {
		const snapshot = await Firebase.firestore().collection('clients').get();
		let clients = [];
		snapshot.forEach((doc) => clients.push(doc.data()));
		return clients;
	};

	//Format the selected names to first letter uppercase followed by lowercase
	const formatName = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

	//Return an array of refs that have files waiting to be uploaded to cloud storage
	const filesToBeUploaded = () => {
		const refs = [
			{ ref: orderRef, name: 'order-file' },
			{ ref: shippingRef, name: 'shipping-file' },
			{ ref: itemImageRef, name: 'item-file' }
		];
		return refs.filter((ref) => ref.ref.current.files[0] !== undefined);
	};

	//Returns a promise with the downloaded url of the image uploaded to the cloud storage
	const uploadFile = (doc, orderId) => {
		return new Promise((resolve) => {
			const item = { name: doc.name, file: doc.ref.current.files[0] };
			const path = `images/${orderId}/${item.name}`;
			Firebase.storage().ref(path).put(item.file).then((snapshot) => {
				snapshot.ref.getDownloadURL().then((url) => resolve({ name: item.name, url: url }));
			});
		});
	};

	/* Return the downloaded urls to the callback once all files are uploaded */
	const uploadAllFiles = async (docs, data, callback) => {
		let urls = [];
		const orderId = data['orderId'];
		do {
			const doc = docs.pop();
			const url = await uploadFile(doc, orderId);
			console.log('> Firebase: File uploaded!');
			setMessage('File uploaded to the cloud.');
			urls.push(url);
		} while (docs.length !== 0);
		callback(urls);
	};

	//Add all the form data and files to the firestore request to create a new order
	const onSubmit = (e) => {
		e.preventDefault();
		if (img !== 'fas fa-spinner fa-pulse') setImg('fas fa-spinner fa-pulse');
		setToast(true);
		try {
			const orderId = Number(new Date()).toString();
			const clientId = clientRef.current.selectedOptions[0].value;
			const orderDate = document.getElementById('order-date').value;
			const item = document.getElementById('item').value.toLowerCase();
			const fname = document.getElementById('beneficiary-f').value.toLowerCase();
			const lname = document.getElementById('beneficiary-l').value.toLowerCase();
			const country = countryRef.current.selectedOptions[0].text;
			const province = provinceRef.current.selectedOptions[0].text;
			const address = document.getElementById('address').value.toLowerCase();
			const documents = filesToBeUploaded();
			//Store data into a obj
			let data = {
				orderId: orderId,
				clientId: clientId,
				date: orderDate,
				item: item,
				recipientFname: fname,
				recipientLname: lname,
				country: country,
				province: province,
				address: address
			};

			uploadAllFiles(documents, data, (urls) => {
				setHeading('Files uploaded! Adding order to the cloud...');
				setMessage('All files uploaded to the cloud.');
				urls.forEach((item) => (data[item.name] = item.url));
				console.log(data);
				Firebase.firestore().collection('orders').doc(orderId).set(data).then(() => {
					setImg('fas fa-check-circle toast-success');
					setHeading('Order Added!');
					setMessage(`${message}\n The order was added to the cloud!`);
					console.log(`> Firebase: order data added`);
					setTimeout(() => {
						setToast(false);
						window.location.href = '/new-order';
					}, 3000);
				});
			});
		} catch (error) {
			setImg('fas fa-window-close toast-fail');
			setHeading('Failed');
			setMessage("Order couldn't be added!");
			console.log(`> Firebase: Error couldnt send request.\n ${error.message}`);
			setTimeout(() => {
				setToast(false);
			}, 3000);
		}
	};

	return (
		<main className="container p-3 toast-div">
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<h1>Add New Order</h1>
			<p className="mb-5">
				Enter the shipping and tracking information provided by the shipping company, the item information
				including title, and its destination.
			</p>
			<form onSubmit={(e) => onSubmit(e)}>
				<div className="form-group row">
					<div className="form-group col-md">
						<label>Client</label>
						<select required ref={clientRef} className="custom-select" id="client">
							<option value="" disabled selected>
								Select a client
							</option>
							<Async promiseFn={getClients} onReject={(e) => console.log(e.message)}>
								{({ data, err, isLoading }) => {
									if (isLoading) return 'Loading...';
									if (err) return `Something went wrong: ${err.message}`;
									if (data) {
										return data.map((item, index) => {
											let fname = formatName(item.fname);
											let lname = formatName(item.lname);
											let full_name = `${fname} ${lname}`;
											return (
												<option value={item.id} key={index}>
													{full_name}
												</option>
											);
										});
									}
									return null;
								}}
							</Async>
						</select>
					</div>
				</div>
				<div className="form-group row">
					<div className="form-group col-md-6">
						<label htmlFor="order-date">Order Date</label>
						<input
							type="date"
							className="form-control"
							id="order-date"
							defaultValue={new Date().toISOString().slice(0, 10)}
							name="order-date"
							required
						/>
					</div>
					<Input column="col-md-6" id="item" label="Item" type="text" placeholder="Item Name" name="item" />
				</div>
				<div className="form-group row">
					<Input
						column="col-md-6"
						id="beneficiary-f"
						label="Recipient's First Name"
						type="text"
						placeholder="First name"
						name="beneficiary-f"
					/>
					<Input
						column="col-md-6"
						id="beneficiary-l"
						label="Recipient's Last Name"
						type="text"
						placeholder="Last name"
						name="beneficiary-l"
					/>
				</div>
				<h3 className="py-3">Destination</h3>
				<div className="form-group row">
					<label htmlFor="country" className="col-sm-2 col-form-label">
						Country
					</label>
					<div className="col-sm-10">
						<select
							ref={countryRef}
							required
							className="custom-select crs-country"
							id="country"
							data-region-id="province"
						/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="province" className="col-sm-2 col-form-label">
						Province
					</label>
					<div className="col-sm-10">
						<select ref={provinceRef} required className="custom-select" id="province" />
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="address" className="col-sm-2 col-form-label">
						Address
					</label>
					<div className="col-sm-10">
						<input
							required
							type="text"
							className="form-control"
							id="address"
							placeholder="Address"
							name="address"
						/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="destination" className="col-sm-2 col-form-label">
						Upload Order Receipt
					</label>
					<div className="col-sm-10">
						<input
							ref={orderRef}
							type="file"
							className="form-control"
							id="order-receipt"
							name="order-receipt"
							accept="image/png, image/jpeg"
							multiple="multiple"
						/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="shipping-receipt" className="col-sm-2 col-form-label">
						Upload Shipping Receipt
					</label>
					<div className="col-sm-10">
						<input
							ref={shippingRef}
							type="file"
							className="form-control"
							id="shipping-receipt"
							name="shipping-receipt"
							accept="image/png, image/jpeg"
						/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="item-img" className="col-sm-2 col-form-label">
						Upload Item Image
					</label>
					<div className="col-sm-10">
						<input
							ref={itemImageRef}
							type="file"
							className="form-control"
							id="item-img"
							name="item-img"
							accept="image/png, image/jpeg"
						/>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md d-flex justify-content-end align-items-center">
						<a href="/new-order" className="mr-2 btn btn-md btn-secondary">
							Cancel
						</a>
						<input type="submit" value="Add Order" className="btn btn-primary" id="btn-modal" />
					</div>
				</div>
			</form>
		</main>
	);
};

export default Order;

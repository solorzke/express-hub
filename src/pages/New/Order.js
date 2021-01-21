import React, { useState, useRef } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import Toast from '../../components/Toast/Toast';
import Input from '../../components/Inputs/Input';
import Async from 'react-async';
import { Config } from '../../data/Config';
import { useHistory, Link } from 'react-router-dom';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Order = () => <Wrapper children={<Body />} current="New Order" />;

const Body = () => {
	//Select refs for clients, country, province
	let clientRef = useRef(null);
	let countryRef = useRef(null);
	let provinceRef = useRef(null);

	//State objects for use throughout the component
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ toast, setToast ] = useState(false);
	const [ message, setMessage ] = useState('Adding Client...');
	const [ heading, setHeading ] = useState('Processing');

	const history = useHistory();

	//Request a list of clients from the firestore
	const getClients = async () => {
		const snapshot = await Firebase.firestore().collection('clients').get();
		let clients = [];
		snapshot.forEach((doc) => clients.push(doc.data()));
		return clients;
	};

	//Format the selected names to first letter uppercase followed by lowercase
	const formatName = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

	//Add all the form data and files to the firestore request to create a new order
	const onSubmit = async (e) => {
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
			const carrier = document.getElementById('carrier').value.toLowerCase();
			const trackingNum = document.getElementById('tracking').value;
			const country = countryRef.current.selectedOptions[0].text;
			const province = provinceRef.current.selectedOptions[0].text;
			const address = document.getElementById('address').value.toLowerCase();

			//Store data into a obj
			const data = {
				orderId: orderId,
				clientId: clientId,
				date: orderDate,
				item: item,
				recipientFname: fname,
				recipientLname: lname,
				carrier: carrier,
				trackingNum: trackingNum,
				country: country,
				province: province,
				address: address
			};

			//Add data to a new document from the collection 'orders' in the firestore
			await Firebase.firestore().collection('orders').doc(orderId).set(data);
			setImg('fas fa-check-circle toast-success');
			setHeading('Complete');
			setMessage('Client added!');
			console.log(`> Firebase: client data added`);
			setTimeout(() => {
				setToast(false);
				history.push('/new-order');
			}, 3000);
		} catch (error) {
			setImg('fas fa-window-close toast-fail');
			setHeading('Failed');
			setMessage("Client couldn't be added!");
			setTimeout(() => {
				setToast(false);
				console.log(`> Firebase: Error couldnt send request.\n ${error.message}`);
			}, 3000);
		}
	};

	return (
		<main className="container p-3">
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

				<div className="form-group row">
					<label htmlFor="carrier" className="col-sm-2 col-form-label">
						Shipping Carrier
					</label>
					<div className="col-sm-10">
						<input
							type="text"
							className="form-control"
							id="carrier"
							placeholder="Shipping carrier name"
							name="carrier"
							required
						/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="tracking" className="col-sm-2 col-form-label">
						Tracking Number
					</label>
					<div className="col-sm-10">
						<input
							type="text"
							className="form-control"
							id="tracking"
							placeholder="Tracking Number"
							name="tracking"
						/>
					</div>
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
							type="file"
							className="form-control"
							id="order-receipt"
							name="order-receipt"
							accept="image/png, image/jpeg"
						/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="shipping-receipt" className="col-sm-2 col-form-label">
						Upload Shipping Receipt
					</label>
					<div className="col-sm-10">
						<input
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
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
		</main>
	);
};

export default Order;

import React, { useRef } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import Editor from '../../components/TextEditor/Editor';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import Async from 'react-async';
import { useHistory } from 'react-router-dom';

const Order = () => <Wrapper children={<Body />} current="New Order" active="new" />;

const Body = () => {
	//Select refs for clients, country, province
	let clientRef = useRef(null);
	let countryRef = useRef(null);
	let provinceRef = useRef(null);
	const history = useHistory();
	let value = '';

	//Request a list of clients from the firestore
	const getClients = async () => {
		const snapshot = await Firebase.firestore().collection('clients').get();
		let clients = [];
		snapshot.forEach((doc) => clients.push(doc.data()));
		return clients;
	};

	//Format the selected names to first letter uppercase followed by lowercase
	const formatName = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

	const setText = (data) => (value = data);

	//Add all the form data and files to the firestore request to create a new order
	const onSubmit = (e) => {
		e.preventDefault();
		try {
			const orderId = Number(new Date()).toString();
			const clientId = clientRef.current.selectedOptions[0].value;
			const clientName = clientRef.current.selectedOptions[0].text;
			const orderDate = document.getElementById('order-date').value;
			const country = countryRef.current.selectedOptions[0].text;
			const province = provinceRef.current.selectedOptions[0].text;
			const address = document.getElementById('address').value.toLowerCase();
			// const editor = editorValue.length !== 0 ? editorValue : 'No notes written down.';
			//Store data into a obj
			let data = {
				orderId: orderId,
				clientId: clientId,
				clientName: clientName,
				date: orderDate,
				country: country,
				province: province,
				address: address,
				notes: value
			};

			history.push('/new-order/add-order/add-items', data);
		} catch (error) {
			console.log(`> App: Unable to save form data.\n ${error.message}`);
		}
	};

	return (
		<main className="container p-3 toast-div">
			<Description />
			<OrderForm
				formatName={formatName.bind(this)}
				onSubmit={onSubmit.bind(this)}
				getClients={getClients.bind(this)}
				refs={{ client: clientRef, country: countryRef, province: provinceRef }}
				setText={setText.bind(this)}
			/>
		</main>
	);
};

const OrderForm = ({ formatName, onSubmit, getClients, refs, setText }) => (
	<form onSubmit={onSubmit}>
		<div className="form-group row">
			<Clients refs={refs} formatName={formatName} getClients={getClients} />
			<DatePicker />
		</div>
		<Destination refs={refs} />
		<TextEditor setText={setText} />
		<ConfirmButtons />
	</form>
);

const Clients = ({ refs, getClients, formatName }) => (
	<div className="form-group col-md-6">
		<label>Client</label>
		<select required ref={refs.client} className="custom-select" id="client">
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
);

const DatePicker = () => (
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
);

const Destination = ({ refs }) => (
	<div id="destination">
		<h3 className="py-3">Destination</h3>
		<div className="form-group row">
			<label htmlFor="country" className="col-sm-2 col-form-label">
				Country
			</label>
			<div className="col-sm-10">
				<select
					ref={refs.country}
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
				<select ref={refs.province} required className="custom-select" id="province" />
			</div>
		</div>
		<div className="form-group row">
			<label htmlFor="address" className="col-sm-2 col-form-label">
				Address
			</label>
			<div className="col-sm-10">
				<input type="text" className="form-control" id="address" placeholder="Address" name="address" />
			</div>
		</div>
	</div>
);

const TextEditor = ({ setText }) => (
	<div id="editor">
		<h3 className="py-3">Additional Notes</h3>
		<div className="form-group row">
			<div className="col-md-12">
				<Editor onChange={setText} />
			</div>
		</div>
	</div>
);

const ConfirmButtons = () => (
	<div className="form-group row">
		<div className="col-md d-flex justify-content-end align-items-center">
			<a href="/new-order" className="mr-2 btn btn-md btn-secondary">
				Cancel
			</a>
			<input type="submit" value="Continue" className="btn btn-primary" id="btn-modal" />
		</div>
	</div>
);

const Description = () => (
	<div id="description">
		<h1>Add New Order</h1>
		<p>
			Select the client that wishes to make a new order, and set the order date when they requested it. Type
			details about the order's destination including their country, province, and address.
		</p>
		<p className="mb-5">
			You may add additional notes that are pertinent to the order if you wish. Click 'Continue' to proceed to the
			next page.
		</p>
	</div>
);

export default Order;

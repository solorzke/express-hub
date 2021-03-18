import React, { useRef, useState, useEffect } from 'react';
import { Countries } from '../../data/Location';
import Wrapper from '../../components/Wrapper/Wrapper';
import Editor from '../../components/TextEditor/Editor';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import { useHistory } from 'react-router-dom';

const Order = () => <Wrapper children={<Body />} current="New Order" active="new" />;

const Body = () => {
	//Select refs for clients, country, province
	let clientRef = useRef(null);
	let countryRef = useRef(null);
	let provinceRef = useRef(null);
	const [ SHIPPING, setShipping ] = useState(false);
	const [ CLIENTS, setClients ] = useState(null);
	const history = useHistory();
	let value = '';

	useEffect(() => {
		if (CLIENTS === null) {
			getClients();
		}
	}, []);

	//Request a list of clients from the firestore
	const getClients = async () => {
		const snapshot = await Firebase.firestore().collection('clients').get();
		let clients = [];
		snapshot.forEach((doc) => clients.push(doc.data()));
		setClients(clients);
		return clients;
	};

	//Format the selected names to first letter uppercase followed by lowercase
	const formatName = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

	const setText = (data) => (value = data);

	//Format the date from the date picker to MM/DD/YYYY
	const formatDate = (date) => {
		const bytes = date.split('-');
		const month = bytes[1];
		const day = bytes[2];
		const year = bytes[0];
		return `${month}/${day}/${year}`;
	};

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
			const shippingStatus = SHIPPING;
			const tracking = document.getElementById('tracking').value;
			// const editor = editorValue.length !== 0 ? editorValue : 'No notes written down.';
			//Store data into a obj
			let data = {
				orderId: orderId,
				clientId: clientId,
				clientName: clientName,
				date: formatDate(orderDate),
				country: country,
				province: province,
				address: address,
				notes: value,
				shippingStatus: shippingStatus,
				trackingNum: tracking.length === 0 ? '' : tracking
			};

			history.push('/new-order/add-order/add-items', data);
		} catch (error) {
			console.log(`> App: Unable to save form data.\n ${error.message}`);
		}
	};
	if (CLIENTS === null) return <LoadingPage />;
	return (
		<main className="container p-3 toast-div">
			<Description />
			<OrderForm
				formatName={formatName.bind(this)}
				onSubmit={onSubmit.bind(this)}
				clients={CLIENTS}
				setShipping={setShipping.bind(this)}
				refs={{ client: clientRef, country: countryRef, province: provinceRef }}
				setText={setText.bind(this)}
			/>
		</main>
	);
};

const OrderForm = ({ formatName, onSubmit, clients, refs, setText, setShipping }) => (
	<form onSubmit={onSubmit}>
		<div className="form-group row">
			{/* <Clients refs={refs} formatName={formatName} getClients={getClients} /> */}
			<ClientsPicker formatName={formatName} data={clients} refs={refs} />
			<DatePicker />
		</div>
		<Destination refs={refs} countries={Countries} />
		<ShippingStatus onClick={setShipping} />
		<TextEditor setText={setText} />
		<ConfirmButtons />
	</form>
);

const ClientsPicker = ({ data, formatName, refs }) => (
	<div className="form-group col-md-6">
		<label>Client</label>
		<select required ref={refs.client} className="custom-select" id="client">
			<option value="" disabled selected>
				Select a client
			</option>
			{data.map((item, index) => {
				let fname = formatName(item.fname);
				let lname = formatName(item.lname);
				let full_name = `${fname} ${lname}`;
				return (
					<option value={item.id} key={index}>
						{full_name}
					</option>
				);
			})}
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

const Destination = ({ refs, countries }) => {
	const [ country, setCountry ] = useState(null);

	const onChange = (e) => {
		const value = e.target.selectedOptions[0].value;
		switch (value) {
			case 'united states':
				return setCountry('usa');
			case 'ecuador':
				return setCountry('ecu');
			default:
				return setCountry(null);
		}
	};

	return (
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
						className="custom-select"
						id="country"
						onChange={onChange.bind(this)}
					>
						<option value="" selected disabled>
							Select a Country
						</option>
						<option value="ecuador">Ecuador</option>
						<option value="united states">United States</option>
					</select>
				</div>
			</div>
			<div className="form-group row">
				<label htmlFor="province" className="col-sm-2 col-form-label">
					Province
				</label>
				<div className="col-sm-10">
					<select ref={refs.province} required className="custom-select" id="province">
						<option value="" disabled selected>
							-
						</option>
						{country !== null &&
							countries[country].map((item, index) => (
								<option key={index} value={item.value}>
									{item.name}
								</option>
							))}
					</select>
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
};

const ShippingStatus = ({ onClick }) => {
	const [ SHOW, setShow ] = useState(false);
	const OPTIONS = [ { name: 'Shipped', value: true }, { name: 'Not Yet Shipped', value: false } ];
	return (
		<div id="shipping-tracking">
			<h3 className="py-3">Shipping Status</h3>

			<label htmlFor="status" className="pr-5">
				Status
			</label>
			{OPTIONS.map((item, index) => (
				<div className="form-check form-check-inline" key={index}>
					<input
						required
						className="form-check-input"
						type="radio"
						name="inlineRadioOptions"
						id={item.value}
						value={item.value}
						onClick={() => {
							setShow(item.value);
							onClick(item.value);
						}}
					/>
					<label className="form-check-label" for={item.value}>
						{item.name}
					</label>
				</div>
			))}
			<div className={`form-group row${SHOW ? '' : ' d-none'}`}>
				<label htmlFor="tracking" className="col-sm-2 col-form-label">
					Tracking Number
				</label>
				<input
					className="col-sm-10 form-control"
					id="tracking"
					type="text"
					placeholder="Enter a tracking number, if available."
					name="tracking"
				/>
			</div>
		</div>
	);
};

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

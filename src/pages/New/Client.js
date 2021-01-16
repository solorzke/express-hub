import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Wrapper from '../../components/Wrapper/Wrapper';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import Toast from '../../components/Toast/Toast';
import { Config } from '../../data/Config';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Order = () => <Wrapper children={<Body />} current="New Client" />;

const Body = () => {
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ toast, setToast ] = useState(false);
	const [ message, setMessage ] = useState('Adding Client...');
	const [ heading, setHeading ] = useState('Processing');
	const history = useHistory();

	const onSubmit = async () => {
		if (img !== 'fas fa-spinner fa-pulse') setImg('fas fa-spinner fa-pulse');
		setToast(true);
		try {
			let fname = document.getElementById('fname').value.toLowerCase();
			let lname = document.getElementById('lname').value.toLowerCase();
			let email = document.getElementById('email').value.toLowerCase();
			let phone = document.getElementById('phone').value;
			let id = Number(new Date()).toString();
			const data = {
				fname: fname,
				lname: lname,
				email: email,
				phone: phone,
				id: id
			};
			//Add data to a new document from the collection 'clients' in the firestore
			await Firebase.firestore().collection('clients').doc(id).set(data);
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
			<h1>Add New Client</h1>
			<p className="mb-5">
				Enter the client's information before proceeding to adding their new shipment order to the database.
			</p>
			<form>
				<div className="form-group row">
					<div className="form-group col-md-6">
						<label htmlFor="fname">First Name</label>
						<input type="text" className="form-control" id="fname" placeholder="First Name" name="fname" />
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="lname">Last Name</label>
						<input type="text" className="form-control" id="lname" placeholder="Last Name" name="lname" />
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="email" className="col-sm-2 col-form-label">
						Email
					</label>
					<div className="col-sm-10">
						<input
							type="email"
							className="form-control"
							id="email"
							placeholder="Email Address"
							name="email"
						/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="phone" className="col-sm-2 col-form-label">
						Phone Number
					</label>
					<div className="col-sm-10">
						<input
							type="tel"
							className="form-control"
							id="phone"
							placeholder="Phone Number"
							name="phone"
							pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
						/>
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
				<div className="form-group row">
					<div className="col-md d-flex justify-content-end align-items-center">
						<a href="index.php?action=new-order" className="mr-2 btn btn-md btn-secondary">
							Cancel
						</a>
						<button type="button" className="btn btn-primary" id="btn-modal" onClick={() => onSubmit()}>
							Add Client
						</button>
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

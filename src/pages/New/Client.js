import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Wrapper from '../../components/Wrapper/Wrapper';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import Toast from '../../components/Toast/Toast';
import Input from '../../components/Inputs/Horizontal';
import InputCol from '../../components/Inputs/Input';
import { Config } from '../../data/Config';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Order = () => <Wrapper children={<Body />} current="New Client" />;

const Body = () => {
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ toast, setToast ] = useState(false);
	const [ message, setMessage ] = useState('Adding Client...');
	const [ heading, setHeading ] = useState('Processing');
	const history = useHistory();

	const onSubmit = async (e) => {
		//prevent the form's default submission behavior
		e.preventDefault();
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
			<form onSubmit={(e) => onSubmit(e)}>
				<div className="form-group row">
					<InputCol
						column="col-md-6"
						label="First Name"
						type="text"
						id="fname"
						placeholder="First Name"
						name="fname"
					/>
					<InputCol
						column="col-md-6"
						label="Last Name"
						type="text"
						id="lname"
						placeholder="Last Name"
						name="lname"
					/>
				</div>
				<div className="form-group row">
					<Input label="Email" type="email" id="email" placeholder="Email Address" name="email" />
				</div>
				<div className="form-group row">
					<Input label="Phone Number" type="tel" id="phone" placeholder="Phone Number" name="phone" />
				</div>
				<div className="form-group row">
					<Input label="Address" type="text" id="address" placeholder="Address" name="address" />
				</div>
				<div className="form-group row">
					<div className="col-md d-flex justify-content-end align-items-center">
						<a href="/new-order" className="mr-2 btn btn-md btn-secondary">
							Cancel
						</a>
						<input value="Add Client" type="submit" className="btn btn-primary" id="btn-modal" />
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

import React, { useState, useRef } from 'react';
import { Countries } from '../../data/Location';
import Wrapper from '../../components/Wrapper/Wrapper';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import Toast from '../../components/Toast/Toast';
import Input from '../../components/Inputs/Horizontal';
import InputCol from '../../components/Inputs/Input';
import { Config } from '../../data/Config';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Order = () => <Wrapper children={<Body />} current="New Client" active="new" />;

const Body = () => {
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ toast, setToast ] = useState(false);
	const [ message, setMessage ] = useState('Adding Client...');
	const [ heading, setHeading ] = useState('Processing');
	const [ gender, setGender ] = useState('other');
	let countryRef = useRef(null);
	let provinceRef = useRef(null);

	//Set the state for the toast props
	const setToastProps = (toastImg, toastHeading, toastMessage, log, action) => {
		setImg(toastImg);
		setHeading(toastHeading);
		setMessage(toastMessage);
		console.log(log);
		setTimeout(() => {
			setToast(false);
			if (action) window.location.href = '/new-order';
		}, 3000);
	};

	const onSubmit = async (e) => {
		//prevent the form's default submission behavior
		e.preventDefault();
		if (img !== 'fas fa-spinner fa-pulse') setImg('fas fa-spinner fa-pulse');
		setToast(true);
		try {
			let fname = document.getElementById('fname').value.toLowerCase();
			let lname = document.getElementById('lname').value.toLowerCase();
			let email = document.getElementById('email').value.toLowerCase();
			let address = document.getElementById('address').value.toLowerCase();
			let phone = document.getElementById('phone').value;
			const country = countryRef.current.selectedOptions[0].text;
			const province = provinceRef.current.selectedOptions[0].text;
			let id = Number(new Date()).toString();
			let clientSince = new Date().toLocaleString().split(',')[0];
			const data = {
				fname: fname,
				lname: lname,
				email: email,
				phone: phone,
				id: id,
				clientSince: clientSince,
				country: country,
				province: province,
				gender: gender,
				address: address
			};
			//Add data to a new document from the collection 'clients' in the firestore
			await Firebase.firestore().collection('clients').doc(id).set(data);
			setToastProps(
				'fas fa-check-circle toast-success',
				'Complete',
				'Client added!',
				'> Firebase: client data added',
				true
			);
		} catch (error) {
			setToastProps(
				'fas fa-window-close toast-fail',
				'Failed',
				`Client couldn't be added!`,
				'> Firebase: Error couldnt send request.',
				false
			);
			console.error(error);
		}
	};

	//Handle the radio button click for gender selection
	const onGenderClick = (e, id) => {
		setGender(id);
	};

	return (
		<main className="container-fluid p-3">
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<h1>Add New Client</h1>
			<p className="mb-5">
				Enter the client's information before proceeding to adding their new shipment order to the database.
			</p>
			<ClientForm
				refs={{ country: countryRef, province: provinceRef }}
				onSubmit={onSubmit.bind(this)}
				onGenderClick={onGenderClick.bind(this)}
			/>
		</main>
	);
};

export default Order;

const ClientForm = ({ refs, onSubmit, onGenderClick }) => (
	<form onSubmit={onSubmit}>
		<Names />
		<ContactInfo />
		<Location refs={refs} countries={Countries} />
		<Gender onClick={onGenderClick} />
		<ButtonGroup />
	</form>
);

const Gender = ({ onClick }) => {
	const genders = [
		{ name: 'Male', value: 'male' },
		{ name: 'Female', value: 'female' },
		{ name: 'Other', value: 'other' }
	];
	return (
		<div id="genders">
			<label className="pr-5">Gender</label>
			{genders.map((item, index) => (
				<div className="form-check form-check-inline" key={index}>
					<input
						className="form-check-input"
						type="radio"
						name="inlineRadioOptions"
						id={item.value}
						value={item.value}
						onClick={(e) => onClick(e, item.value)}
					/>
					<label className="form-check-label" htmlFor={item.value}>
						{item.name}
					</label>
				</div>
			))}
		</div>
	);
};

const Names = () => (
	<div className="form-group row">
		<InputCol column="col-md-6" label="First Name" type="text" id="fname" placeholder="First Name" name="fname" />
		<InputCol column="col-md-6" label="Last Name" type="text" id="lname" placeholder="Last Name" name="lname" />
	</div>
);

const ContactInfo = () => (
	<div id="contact">
		<div className="form-group row">
			<Input label="Email" type="email" id="email" placeholder="Email Address" name="email" />
		</div>
		<div className="form-group row">
			<Input label="Phone Number" type="tel" id="phone" placeholder="Phone Number" name="phone" />
		</div>
	</div>
);

const ButtonGroup = () => (
	<div className="form-group row">
		<div className="col-md d-flex justify-content-end align-items-center">
			<a href="/new-order" className="mr-2 btn btn-md btn-secondary">
				Cancel
			</a>
			<input value="Add Client" type="submit" className="btn btn-primary" id="btn-modal" />
		</div>
	</div>
);

const Location = ({ refs, countries }) => {
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
						<option value="" selected>
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
						<option value="">-</option>
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

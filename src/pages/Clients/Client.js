import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Wrapper from '../../components/Wrapper/Wrapper';
import File from '../../components/Files/File';
import Field from '../../components/SlideCard/Field';
import Empty from '../../components/Placeholders/Empty';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Config } from '../../data/Config';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Client = () => <Wrapper children={<Body />} current="Clients" active="clients" />;

const Body = () => {
	let { id } = useParams();
	const [ client, setClient ] = useState(null);
	const [ orders, setOrders ] = useState([]);
	useEffect(() => {
		console.log(id);
		getClient();
		getOrders();
	}, []);

	//Get info of the selected client from the firestore
	const getClient = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('clients').where('id', '==', id).get();
			if (snapshot.empty) return alert("> Firebase: User doesn't exist");
			let client = [];
			snapshot.forEach((doc) => client.push(doc.data()));
			setClient(client[0]);
		} catch (error) {
			console.log(`> Firebase: error`);
			console.log(error);
		}
	};

	//Get all orders relevant to the client's id
	const getOrders = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('orders').where('clientId', '==', id).get();
			if (snapshot.empty) return alert("> Firebase: User doesn't exist");
			let orders = [];
			snapshot.forEach((doc) => orders.push(doc.data()));
			setOrders(orders);
		} catch (error) {
			console.log(`> Firebase: error`);
			console.log(error);
		}
	};

	//Delete the client from the firestore
	//1. Delete all files associated with the order id in the storage collection.
	//2. Delete all orders associated with the client first in the 'Orders' collection.
	//3. Delete the client document in the 'Clients' collection.
	const deleteClient = async (e) => {
		e.preventDefault();
		try {
			if (orders.length === 0) throw new Error('No new items found.');
			for (let i = 0; i < orders.length; i++) {
				const orderId = orders[i].orderId;
				await Firebase.storage().ref(`images/${orderId}`).delete();
				await Firebase.firestore().collection('orders').doc(orderId).delete();
			}
			await Firebase.firestore().collection('clients').doc(id).delete();
			console.log(`> Firebase: Client: ${id} and all his/her orders are deleted from the system.`);
			setTimeout(() => {
				window.location.href = '/clients';
			}, 3000);
		} catch (error) {
			console.log(`> Firebase: error`);
			console.log(error);
		}
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	return (
		<main className="container-fluid pt-3">
			<div className="row">
				<div className="col-md-12 w-100 client-pane">
					<Description state={client} formatString={formatString.bind(this)} />
					<ButtonsPane />
				</div>
			</div>
			<hr />
			<section className="row">
				<Fields state={client} formatString={formatString.bind(this)} />
				<Orders state={orders} names={client} />
			</section>
		</main>
	);
};

const Menu = () => (
	<Dropdown className="float-sm-right">
		<Dropdown.Toggle id="dropdown-basic">
			<i className="fas fa-cog" />
		</Dropdown.Toggle>
		<Dropdown.Menu>
			<Dropdown.Item href="#/action-1">
				<i className="far fa-user pr-2" />
				Update Client Info
			</Dropdown.Item>
			<Dropdown.Item href="#/action-2">
				<i className="fas fa-download pr-2" />
				Download Order History
			</Dropdown.Item>
			<Dropdown.Item href="#/action-3">
				<i className="fas fa-trash-alt pr-2" />
				Delete Client
			</Dropdown.Item>
		</Dropdown.Menu>
	</Dropdown>
);

const Description = ({ state, formatString }) => (
	<div id="description">
		<h2>Client: {state !== null ? formatString(`${state.fname} ${state.lname}`) : ''}</h2>
		<p>Client since: {state !== null ? state.clientSince : 'Not Available'}</p>
		<p style={{ width: '50%' }}>
			See information about your client's account, download an archive of their order history, or make changes to
			their information with the options provided.
		</p>
	</div>
);

const ButtonsPane = () => (
	<div id="buttons-pane">
		<Menu />
		<a href="/clients" className="float-sm-right btn btn-link btn-sm text-primary mx-2 px-3">
			<i className="fas fa-arrow-left pr-3" />Go Back
		</a>
	</div>
);

const Fields = ({ state, formatString }) => {
	const types = [
		{ name: 'First Name', img: 'fas fa-signature pr-1' },
		{ name: 'Last Name', img: 'fas fa-signature pr-1' },
		{ name: 'Gender', img: 'fas fa-venus-mars pr-1' },
		{ name: 'Email Address', img: 'fas fa-at pr-1' },
		{ name: 'Phone Number', img: 'fas fa-phone pr-1' },
		{ name: 'Country', img: 'fas fa-globe-americas pr-1' },
		{ name: 'Province', img: 'fas fa-city pr-1' },
		{ name: 'Address', img: 'far fa-address-card pr-1' }
	];
	if (state !== null) {
		types[0]['value'] = state.fname;
		types[1]['value'] = state.lname;
		types[2]['value'] = state.gender;
		types[3]['value'] = state.email;
		types[4]['value'] = state.phone;
		types[5]['value'] = state.country;
		types[6]['value'] = state.province;
		types[7]['value'] = state.address;
		return (
			<div className="col-md-6 mb-4">
				<h4>Information</h4>
				<div className="client-lists">
					{types.map((item, index) => (
						<Field types={types} index={index} item={item} formatString={formatString} />
					))}
				</div>
			</div>
		);
	}
	return <Empty />;
};

const Orders = ({ state, names }) => {
	const sortOrdersByDate = (orders) => {
		const filteredDates = orders.sort((a, b) => {
			a = a.date.split('/');
			b = b.date.split('/');
			return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
		});
		return filteredDates;
	};
	if (state !== null && names !== null) {
		names.fname = names.fname.replace(' ', '%20');
		names.lname = names.lname.replace(' ', '%20');
		const sortedOrders = sortOrdersByDate(state);
		return (
			<div className="col-md-6">
				<h4>Recent Orders</h4>
				<ol
					className="list-group list-group-flush client-lists"
					id="clients"
					style={{ backgroundColor: '#FDFFFC' }}
				>
					{Object.keys(sortedOrders).map((item, index) => {
						const order = state[item];
						const items = order.items.map((item) => item.name).join(', ');
						return <File key={index} id={order.orderId} date={order.date} items={items} names={names} />;
					})}
				</ol>
			</div>
		);
	}

	return <Empty />;
};

export default Client;

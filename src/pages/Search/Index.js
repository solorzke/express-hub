import React, { useState } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import SearchBar from '../../components/Inputs/Search';
import Logo from '../../logo.jpeg';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from '../../data/Config';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const SearchIndex = () => <Wrapper children={<Body />} active="search" current="Buscar" />;

const Body = () => {
	const [ RESULTS, setResults ] = useState([]);

	const queryRequest = (query, value) =>
		new Promise(async (resolve, reject) => {
			let results = [];
			let orders = [];
			const snapshot = await Firebase.firestore().collection('orders').get();
			snapshot.forEach((doc) => orders.push(doc.data()));
			for (let i = 0; i < orders.length; i++) {
				const order = orders[i];
				const queryValue = order[query].toLowerCase();
				if (queryValue.includes(value) && value.length > 0) {
					const duplicates = results.filter((result) => result.orderId === order.orderId);
					if (duplicates.length === 0) {
						const items = order.items.map((item) => item.name).join(', ');
						const names = await getClientById(order.clientId);
						results.push({
							detail: `${order.orderId}: ${items}`,
							path: `/order?id=${order.orderId}&fname=${names.fname}&lname=${names.lname}`,
							orderId: order.orderId
						});
					}
				}
			}
			console.log(results);
			resolve(results);
		});

	const getClientById = (id) =>
		new Promise((resolve, reject) => {
			Firebase.firestore().collection('clients').where('id', '==', id).get().then((snapshot) => {
				let result = [];
				snapshot.forEach((doc) => result.push(doc.data()));
				const fname = result[0].fname.replace(' ', '%20');
				const lname = result[0].lname.replace(' ', '%20');
				resolve({ fname: fname, lname: lname });
			});
		});

	const queryRequestForClient = (value) =>
		new Promise(async (resolve, reject) => {
			let clients = [];
			let order = [];
			value = value.toLowerCase();
			const snapshot = await Firebase.firestore().collection('clients').get();
			snapshot.forEach((doc) => clients.push(doc.data()));
			for (let i = 0; i < clients.length; i++) {
				const client = clients[i];
				const fullName = `${client.fname} ${client.lname}`;
				if (fullName.includes(value) && value.length > 0) {
					order = await queryRequest('clientId', client.id);
					break;
				}
			}
			resolve(order);
		});

	const onChange = async (e) => {
		e.preventDefault();
		try {
			const query = document.getElementById('query').selectedOptions[0].value;
			const value = e.target.value.toLowerCase();
			const results = query === 'client' ? await queryRequestForClient(value) : await queryRequest(query, value);
			setResults(results);
		} catch (error) {
			console.error("> Firebase: Couldn't send request");
			console.error(error);
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
		<main className="container p-3">
			<PortraitHeader />
			<SearchBox
				setResults={setResults.bind(this)}
				onChange={onChange.bind(this)}
				data={RESULTS}
				formatString={formatString.bind(this)}
			/>
		</main>
	);
};

const PortraitHeader = () => (
	<div className="w-100 d-flex justify-content-center align-items-center pb-5 flex-column">
		{/* <i className="fas fa-shipping-fast login-logo" style={{ fontSize: 200 }} />
		<h1 className="pt-5">Teloentrego</h1> */}
		<img src={Logo} height="400" width="650" className="rounded" />
	</div>
);

const SearchBox = ({ onChange, data, formatString, setResults }) => (
	<div className="">
		<form>
			<div className="form-group row">
				<div className="form-group col-md-2 justify-content-center align-items-center0 d-flex">
					<QueryBox setResults={setResults} />
				</div>
				<div className="form-group col-md-10">
					<SearchBar onChange={onChange} data={data} formatString={formatString} />
				</div>
			</div>
		</form>
	</div>
);

const QueryBox = ({ setResults }) => {
	const options = [
		{ name: 'Cliente', value: 'client' },
		{ name: 'Dirección', value: 'address' },
		{ name: 'País', value: 'country' },
		{ name: 'Provincia', value: 'province' },
		{ name: 'Orden-Id', value: 'orderId' },
		{ name: 'Cliente-Id', value: 'clientId' },
		{ name: 'Fecha', value: 'date' },
		{ name: 'Número De Rastreo', value: 'trackingNum' }
	];

	const onChange = (e) => {
		e.preventDefault();
		setResults([]);
		document.getElementById('search').value = '';
		document.getElementById('search').text = '';
		document.getElementById('search').placeholder = setPlaceholder(e.target.value);
	};

	const setPlaceholder = (type) => {
		switch (type) {
			case 'address':
				return 'Search an address';
			case 'country':
				return 'Search a country';
			case 'province':
				return 'Search a province';
			case 'orderId':
				return 'Search an order-id number';
			case 'clientId':
				return 'Search a client-id number';
			case 'date':
				return 'Search a date of the order';
			case 'trackingNum':
				return 'Search a tracking number';
			default:
				return "Search client's name";
		}
	};

	return (
		<select className="custom-select mr-sm-2" id="query" onChange={onChange.bind(this)}>
			{options.map((option, index) => (
				<option key={index} value={option.value}>
					{option.name}
				</option>
			))}
		</select>
	);
};

export default SearchIndex;

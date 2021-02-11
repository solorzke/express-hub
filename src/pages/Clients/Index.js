import React, { useRef, useState } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import SearchBar from '../../components/Inputs/Search';
import AsyncSelect from '../../components/Inputs/Select';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from '../../data/Config';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Index = () => <Wrapper children={<Body />} current="Clients" active="clients" />;

const Body = () => {
	let selectRef = useRef(null);
	const [ names, setNames ] = useState([]);

	//Request a list of clients from the firestore
	const getClients = async () => {
		const snapshot = await Firebase.firestore().collection('clients').get();
		let clients = [];
		snapshot.forEach((doc) => clients.push(doc.data()));
		return clients;
	};

	//On every change done to the search bar, update the names state variable whenever a name matches in the firestore
	const onChange = async (e) => {
		e.preventDefault();
		//Get the current value from the search bar
		const value = e.target.value;
		//This array will hold all the matching results with the value when the iteration is complete and be updated to the state
		let matchingResults = [];
		//Request a list of clients from the firestore
		const snapshot = await Firebase.firestore().collection('clients').get();
		snapshot.forEach((doc) => {
			const data = doc.data();
			const full_name = `${data.fname} ${data.lname}`;
			if (full_name.includes(value) && value.length > 0) {
				console.log(`Val: ${value} Client: ${full_name}`);
				const matching = matchingResults.filter((item) => item.name === full_name);
				if (matching.length === 0) {
					matchingResults.push({ name: full_name, id: data.id });
				}
				console.table(matching);
			}
		});
		setNames(matchingResults);
	};

	//On a selected value from client list, open to a new page
	const onSelect = (e) => {
		e.preventDefault();
		const value = e.target.value;
		window.location.href = `/clients/${value}`;
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
			<h1>Client Search</h1>
			<p className="pb-5">
				Find a client by search or selection to bring up their information and recent orders.
			</p>
			<SearchForm
				onChange={onChange.bind(this)}
				formatString={formatString.bind(this)}
				getClients={getClients.bind(this)}
				onSelect={onSelect.bind(this)}
				selectRef={selectRef}
				names={names}
			/>
		</main>
	);
};

export default Index;

const SearchForm = ({ onChange, names, formatString, selectRef, getClients, onSelect }) => (
	<form autoComplete="off">
		<SearchClients onChange={onChange} names={names} formatString={formatString} />
		<Divider />
		<SelectClient selectRef={selectRef} getClients={getClients} formatString={formatString} onSelect={onSelect} />
	</form>
);

const Divider = () => (
	<div className="form-group row">
		<div className="form-group col-md-5">
			<hr />
		</div>
		<div className="form-group col-md-2 text-center">
			<p>Or</p>
		</div>
		<div className="form-group col-md-5">
			<hr />
		</div>
	</div>
);

const SearchClients = ({ onChange, names, formatString }) => (
	<div className="form-group row">
		<div className="form-group col-md-11">
			<SearchBar onChange={onChange} data={names} formatString={formatString} />
		</div>
		<div className="form-group col-md-1">
			<button className="btn btn-md btn-primary" id="submit">
				<i className="fas fa-search" />
			</button>
		</div>
	</div>
);

const SelectClient = ({ selectRef, getClients, formatString, onSelect }) => (
	<div className="form-group row">
		<div className="form-group col-md-12">
			<AsyncSelect
				refs={selectRef}
				required="required"
				promiseFn={getClients}
				formatString={formatString}
				onChange={onSelect}
			/>
		</div>
	</div>
);

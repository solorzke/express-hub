import React, { useRef, useState } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import SearchBar from '../../components/Inputs/Search';
import AsyncSelect from '../../components/Inputs/Select';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from '../../data/Config';
import { Card } from 'react-bootstrap';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Index = () => <Wrapper children={<Body />} current="Clients" active="clients" />;

const Body = () => {
	let selectRef = useRef(null);
	const [ names, setNames ] = useState([]);

	//Request a list of clients from the firestore
	const getClients = async () => {
		const snapshot = await Firebase.firestore().collection('clients').get();
		let clients = [];
		snapshot.forEach((doc) => {
			if (!doc.data().hasOwnProperty('ghost')) clients.push(doc.data());
		});
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
			if (doc.data().hasOwnProperty('ghost')) return;
			const data = doc.data();
			const full_name = `${data.fname} ${data.lname}`;
			if (full_name.includes(value) && value.length > 0) {
				console.log(`Val: ${value} Client: ${full_name}`);
				const matching = matchingResults.filter((item) => item.detail === full_name);
				if (matching.length === 0) {
					matchingResults.push({ detail: full_name, path: `/cloud/clients/${data.id}` });
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
		window.location.href = `/cloud/clients/${value}`;
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	return (
		<main className="container-fluid p-3">
			<h1>Búsqueda De Indice De Clientes</h1>
			<p className="pb-1">
				Encuentre un cliente mediante búsqueda o selección para mostrar su información y pedidos recientes.
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
		<CardBox
			header="Buscar"
			title="Buscar Por Nombre"
			text="Agregue un nuevo cliente y su orden de envío, incluida información como su nombre y sus detalles de envío para que se registre en la base de datos."
			children={<SearchClients onChange={onChange} names={names} formatString={formatString} />}
		/>
		<CardBox
			header="Seleccione"
			title="Seleccionar De Una Lista De Clientes"
			text="Agregue un nuevo cliente y su orden de envío, incluida información como su nombre y sus detalles de envío para que se registre en la base de datos."
			children={
				<SelectClient
					selectRef={selectRef}
					getClients={getClients}
					formatString={formatString}
					onSelect={onSelect}
				/>
			}
		/>
	</form>
);

const SearchClients = ({ onChange, names, formatString }) => (
	<div className="form-group row">
		<div className="form-group col-md-12">
			<SearchBar onChange={onChange} data={names} formatString={formatString} />
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

const CardBox = ({ header, title, text, children }) => (
	<Card className="mt-4">
		<Card.Header>{header}</Card.Header>
		<Card.Body>
			<Card.Title>{title}</Card.Title>
			<Card.Text>{text}</Card.Text>
			{children}
		</Card.Body>
	</Card>
);

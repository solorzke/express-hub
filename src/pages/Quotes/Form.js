import React, { useState, useEffect, useRef } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import Toast from '../../components/Toast/Toast';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import Editor from '../../components/TextEditor/Editor';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from '../../data/Config';
import { Breadcrumb } from 'react-bootstrap';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Form = () => <Wrapper children={<Body />} active="quotes" current="Cotizaciones" />;

const Body = () => {
	let clientRef = useRef(null);
	let itemRef = useRef(null);
	let priceRef = useRef(null);
	let costRef = useRef(null);
	let value = '';
	const [ clients, setClients ] = useState(null);
	//State data that control the toast message
	const [ toast, setToast ] = useState(false);
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ message, setMessage ] = useState('Guardando cotización...');
	const [ heading, setHeading ] = useState('Procesando');

	useEffect(() => {
		if (clients === null) getClients();
	}, []);

	//Get a list of clients from the firestore collection 'clients' and update that to the state
	const getClients = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('clients').get();
			let results = [];
			snapshot.forEach((doc) => results.push(doc.data()));
			setClients(results);
			console.log('> Firebase: all clients fetched.');
			return results;
		} catch (error) {
			console.error(error);
		}
	};

	//Submit the data to firestore
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setToast(true);
			await Firebase.firestore().collection('quotes').add({
				client: clientRef.current.selectedOptions[0].value,
				item: itemRef.current.value,
				'quoted-price': priceRef.current.value,
				cost: costRef.current.value,
				notes: value,
				date: getTodaysDate()
			});
			console.log('> Firebase: quote added successfully!');
			setToastProps(
				'fas fa-check-circle toast-success',
				'Cotizacion guardada!',
				`¡Tu cotización fue guardada!`,
				'> Firebase: quote added successfully!',
				true
			);
		} catch (error) {
			console.error(error);
			setToastProps(
				'fas fa-window-close toast-fail',
				'Fallido',
				`¡La cotización no se pudo guardar!`,
				`> Firebase: Error couldnt send request.`,
				false
			);
		}
	};

	//Set the state for the toast props
	const setToastProps = (toastImg, toastHeading, toastMessage, log, action) => {
		setImg(toastImg);
		setHeading(toastHeading);
		setMessage(toastMessage);
		console.log(log);
		setTimeout(() => {
			if (action) window.location.href = '/quotes';
			setToast(false);
			setImg('fas fa-spinner fa-pulse');
			setHeading('Procesando');
			setMessage('Guardando Cotización...');
			console.log('Toast Props set to normal.');
		}, 3000);
	};

	//Format the selected names to first letter uppercase followed by lowercase
	const formatName = (str = '') => {
		return str.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	};

	const getTodaysDate = () => {
		const today = new Date();
		let day = today.getDate();
		let month = today.getMonth() + 1;
		let year = today.getFullYear();
		day = day < 10 ? `0${day}` : day;
		month = month < 10 ? `0${month}` : month;
		return `${month}/${day}/${year}`;
	};

	const setText = (data) => (value = data);

	if (clients === null) return <LoadingPage />;
	return (
		<main className="mt-3 px-2">
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<Paths />
			<div className="container">
				<Description />
				<QuoteForm
					data={clients}
					formatName={formatName.bind(this)}
					onTextEditorChange={setText.bind(this)}
					onSubmit={onSubmit.bind(this)}
					refs={{
						clients: clientRef,
						item: itemRef,
						price: priceRef,
						cost: costRef
					}}
				/>
			</div>
		</main>
	);
};

const Description = () => (
	<div className="description text-center">
		<h1>Agregar Nueva Cotización</h1>
		<div className="justify-content-center align-items-center d-flex">
			<p className="w-50">
				Agregue una nueva cotización a un cliente existente en el sistema. Proporcione información como el
				nombre del artículo cotizado, precio cotizado, su costo y un enlace a ese artículo si es posible.
			</p>
		</div>
	</div>
);

const QuoteForm = ({ onSubmit, refs, data, formatName, onTextEditorChange }) => (
	<form onSubmit={onSubmit}>
		<ClientsPicker refs={refs} data={data} formatName={formatName} />
		<Item refs={refs} />
		<QuotedPrice refs={refs} />
		<Cost refs={refs} />
		<TextEditor setText={onTextEditorChange} />
		<ConfirmButtons />
	</form>
);

const ClientsPicker = ({ refs, data, formatName }) => (
	<div className="form-group">
		<label htmlFor="clients">Clientes</label>
		<select id="clients" ref={refs.clients} className="custom-select" required>
			<option value="" disabled selected>
				Selecciona un cliente
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

const Item = ({ refs }) => (
	<div className="form-group">
		<label htmlFor="item">Articulo</label>
		<input required ref={refs.item} type="text" className="form-control" id="item" placeholder="Enter an item" />
	</div>
);

const QuotedPrice = ({ refs }) => (
	<div className="form-group row">
		<label className="col-sm-2 pt-2" htmlFor="quoted-price">
			Precio cotizado: $
		</label>
		<input
			required
			ref={refs.price}
			type="number"
			step="any"
			min="1"
			id="quoted-price"
			className="form-control col-sm-1"
			style={{ width: '10%' }}
			placeholder="0.00"
		/>
	</div>
);

const Cost = ({ refs }) => (
	<div className="form-group row">
		<label htmlFor="cost" className="col-sm-2 pt-2">
			Costo: $
		</label>
		<input
			required
			ref={refs.cost}
			type="number"
			step="any"
			min="1"
			id="cost"
			className="form-control col-sm-1"
			style={{ width: '10%' }}
			placeholder="0.00"
		/>
	</div>
);

const TextEditor = ({ setText }) => (
	<div id="editor">
		<h3 className="py-3">Notas</h3>
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
			<a href="/quotes" className="mr-2 btn btn-md btn-secondary">
				Cancelar
			</a>
			<input type="submit" value="Guardar" className="btn btn-primary" id="btn-modal" />
		</div>
	</div>
);

const Paths = () => {
	const onClick = (e, path) => {
		e.preventDefault();
		const message = '¿Estás seguro de que quieres regresar? Toda la información no enviada aquí se perderá.';
		if (window.confirm(message)) window.location.href = path;
	};
	return (
		<Breadcrumb>
			<Breadcrumb.Item href="/quotes" onClick={(e) => onClick(e, '/quotes')}>
				Home
			</Breadcrumb.Item>
			<Breadcrumb.Item active>Agregar Nueva Cotización</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default Form;

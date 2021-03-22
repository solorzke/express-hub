import React, { useEffect, useState } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import Field from '../../components/SlideCard/Field';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from '../../data/Config';
import { useLocation } from 'react-router-dom';
import { QuoteTypes } from '../../data/InputTypes';
import { Breadcrumb, Dropdown, Button } from 'react-bootstrap';
import Toast from '../../components/Toast/Toast';

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => new URLSearchParams(useLocation().search);

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Quote = () => <Wrapper children={<Body />} active={'quotes'} current="Cotizaciónes" />;

const Body = () => {
	const quote_id = useQuery().get('id');
	const [ quote, setQuote ] = useState(null);
	const [ client, setClient ] = useState(null);
	//State data that control the toast message
	const [ toast, setToast ] = useState(false);
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ message, setMessage ] = useState('Actualizando Cotizacion');
	const [ heading, setHeading ] = useState('Procesando');

	useEffect(() => {
		if (quote_id === null) window.location.href = '/quotes';
		if (quote === null) getQuote(quote_id);
	}, []);

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
			setMessage('Actualizando Cotizacion');
			console.log('Toast Props set to normal.');
		}, 3000);
	};

	//Get the quote data from firestore using the quote id
	const getQuote = async (uid) => {
		try {
			const quoteSnapshot = (await Firebase.firestore().collection('quotes').doc(uid).get()).data();
			const clientSnapshot = (await Firebase.firestore()
				.collection('clients')
				.doc(quoteSnapshot.client)
				.get()).data();
			setQuote({ ...quoteSnapshot, uid: uid });
			setClient(clientSnapshot);
			return quoteSnapshot;
		} catch (error) {
			console.error(error);
		}
	};

	//Update quote to the firestore and refresh the page afterwards
	const updateQuote = async (e, data) => {
		e.preventDefault();
		try {
			setToast(true);
			const value = Object.values(data)[0];
			if (value === '') return alert('Ingrese un valor antes de actualizar');
			await Firebase.firestore().collection('quotes').doc(quote_id).update(data);
			setToastProps(
				'fas fa-check-circle toast-success',
				'Cotizacion Actualizado!',
				`¡El cotizacion fue guardado en la nube!`,
				`> Firebase: Quote: ${quote_id} has been updated.`,
				false
			);
			window.location.reload();
		} catch (error) {
			setToastProps(
				'fas fa-window-close toast-fail',
				'Fallido',
				`¡No se pudo guardar el cotizacion!`,
				error.message,
				false
			);
		}
	};

	//Delete the quote from the firestore
	const deleteQuote = async () => {
		try {
			if (!window.confirm('¿Está seguro de que desea eliminar esta cotización?')) return;
			setToast(true);
			setHeading('Procesando');
			setMessage('Borrando el cotizacion');
			await Firebase.firestore().collection('quotes').doc(quote_id).delete();
			setToastProps(
				'fas fa-check-circle toast-success',
				'Cotizacion Borrado!',
				`¡El cotizacion fue borrado de la nube!`,
				`> Firebase: Quote: ${quote_id} has been deleted.`,
				true
			);
		} catch (error) {
			setToastProps(
				'fas fa-window-close toast-fail',
				'Fallido',
				`¡No se pudo borrar el cotizacion!`,
				error.message,
				false
			);
		}
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	if (quote === null || client === null) return <LoadingPage />;
	return (
		<main className="container-fluid pt-3">
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<Paths />
			<Description id={quote_id} client={`${formatString(client.fname + ' ' + client.lname)}`} />
			<Menu onDelete={deleteQuote.bind(this)} />
			<Details state={quote} formatString={formatString.bind(this)} onUpdate={updateQuote.bind(this)} />
		</main>
	);
};

const Description = ({ id, client }) => (
	<div id="description">
		<h1>Quote: {id}</h1>
		<p>
			Below is the information listed for this quote, belonging to <strong>{client}</strong>.
		</p>
		<p>Review the information however you wish and make any changes needed. </p>
	</div>
);

const Details = ({ state, formatString, onUpdate }) => {
	const types = QuoteTypes(state);
	return (
		<div className="client-lists">
			{types.map((item, index) => (
				<Field
					key={index}
					types={types}
					index={index}
					item={item}
					formatString={formatString}
					onUpdate={onUpdate}
				/>
			))}
		</div>
	);
};

const Paths = () => (
	<Breadcrumb className="py-2">
		<Breadcrumb.Item href="/quotes">Volver Al Origen</Breadcrumb.Item>
		<Breadcrumb.Item active>Cotizacion</Breadcrumb.Item>
	</Breadcrumb>
);

const Menu = ({ onDelete }) => (
	<Dropdown className="float-sm-right">
		<Dropdown.Toggle id="dropdown-basic">
			<i className="fas fa-cog" />
		</Dropdown.Toggle>
		<Dropdown.Menu>
			<Dropdown.Item href="#/action-2">
				<i className="fas fa-download pr-2" />
				Descargar Cotizacion
			</Dropdown.Item>
			<Dropdown.Item as={Button} onClick={onDelete}>
				<i className="fas fa-trash-alt pr-2" />
				Eliminar Cotizacion
			</Dropdown.Item>
		</Dropdown.Menu>
	</Dropdown>
);

export default Quote;

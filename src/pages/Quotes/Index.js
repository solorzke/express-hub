import React, { useState, useEffect } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import { Card } from 'react-bootstrap';
import { Config } from '../../data/Config';
import { QuoteHeadings } from '../../data/TableHeadings';
import { Spreadsheet } from '../../components/Spreadsheet/Spreadsheet';
import Toast from '../../components/Toast/Toast';
import Firebase from 'firebase/app';
import 'firebase/firestore';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Index = () => <Wrapper children={<Body />} active="quotes" current="Cotizaciónes" />;

const Body = () => {
	const [ quotes, setQuotes ] = useState(null);
	const [ filtered_quotes, setFilteredQuotes ] = useState(null);
	const [ clients, setClients ] = useState(null);
	//State data that control the toast message
	const [ toast, setToast ] = useState(false);
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ message, setMessage ] = useState('Borrando Cotizaciones ...');
	const [ heading, setHeading ] = useState('Procesando');

	useEffect(
		() => {
			if (quotes === null) getQuotes();
		},
		[ quotes, filtered_quotes ]
	);

	//Set the state for the toast props
	const setToastProps = (toastImg, toastHeading, toastMessage, log, action) => {
		setImg(toastImg);
		setHeading(toastHeading);
		setMessage(toastMessage);
		console.log(log);
		setTimeout(() => {
			if (action) window.location.reload();
			setToast(false);
			setImg('fas fa-spinner fa-pulse');
			setMessage('Borrando Cotizaciones ...');
			setHeading('Procesando');
		}, 1500);
	};

	const getQuotes = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('quotes').get();
			let results = [];
			snapshot.forEach((doc) => {
				if (!doc.data().hasOwnProperty('ghost')) results.push({ ...doc.data(), uid: doc.id });
			});
			setQuotes(results);
			setFilteredQuotes(results);
			getClients();
			return results;
		} catch (error) {
			console.error(error);
		}
	};

	const getClients = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('clients').get();
			let results = [];
			snapshot.forEach((doc) => {
				if (!doc.data().hasOwnProperty('ghost')) results.push(doc.data());
			});
			setClients(results);
			return results;
		} catch (error) {
			console.error(error);
		}
	};

	const onClientChange = (e) => {
		const clientId = e.target.value;
		const copy = [ ...quotes ];
		const filtered = copy.filter((quote) => quote.client === clientId);
		setFilteredQuotes(filtered);
	};

	const sortOrders = (type, field) => {
		let copy = [ ...quotes ];
		switch (type) {
			case 'string':
				const sortedStrings = copy.sort((a, b) => {
					if (a[field] < b[field]) return -1;
					else if (a[field] > b[field]) return 1;
					else return 0;
				});
				setFilteredQuotes(sortedStrings);
				return sortedStrings;
			case 'num':
				const sortedNums = copy.sort((a, b) => {
					a = parseInt(a[field]);
					b = parseInt(b[field]);
					return b - a;
				});
				setFilteredQuotes(sortedNums);
				return sortedNums;
			case 'date':
				const sortedDates = copy.sort((a, b) => {
					a = a.date.split('/');
					b = b.date.split('/');
					return b[2] - a[2] || b[0] - a[0] || b[1] - a[1];
				});
				setFilteredQuotes(sortedDates);
				return sortedDates;
			case 'boolean':
				const sortedBooleans = copy.sort((a, b) => Number(a.shippingStatus) - Number(b.shippingStatus));
				setFilteredQuotes(sortedBooleans);
				return sortedBooleans;
		}
	};

	const sortDescendingOrders = (sorted) => setFilteredQuotes(sorted.reverse());

	//Format the selected names to first letter uppercase followed by lowercase
	const formatName = (str = '') => {
		const formatted = str.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1));
		return formatted.join(' ');
	};

	//Delete all quotes with their uid from the firestore and rerender the DOM
	const onDeleteQuotes = async (quotes) => {
		try {
			setToast(true);
			for (let i = 0; i < quotes.length; i++) {
				const uid = quotes[i];
				await Firebase.firestore().collection('quotes').doc(uid).delete();
			}
			setToastProps(
				'fas fa-check-circle toast-success',
				'Cotizaciones borrado!',
				`¡Sus cotizaciones selecionados estan borrados!`,
				'> Firebase: order data added',
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

	if (filtered_quotes === null || clients === null) return <LoadingPage />;
	return (
		<main className="container-fluid mt-3 index landing-page">
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<div className="row pb-3">
				<div className="col-xl">
					<Description />
					<ClientForm
						clients={clients}
						formatName={formatName.bind(this)}
						onClientChange={onClientChange.bind(this)}
					/>
				</div>
				<CardBox
					header="Agregar Cotización"
					title="Crear Una Nueva Cotización"
					text="Comience a crear sus cotizaciones para sus clientes de inmediato aquí, incluido el precio y el costo cotizados."
					path="/cloud/quotes/add"
					image="fas fa-plus-square"
				/>
			</div>
			<hr />
			<Spreadsheet
				type="quotes"
				headings={QuoteHeadings}
				data={filtered_quotes}
				onDeleteRows={onDeleteQuotes.bind(this)}
				onSortAsc={sortOrders.bind(this)}
				onSortDes={sortDescendingOrders.bind(this)}
			/>
		</main>
	);
};

const Description = () => (
	<div id="description">
		<h1>Cotizaciones</h1>
		<p>
			Bienvenido a la página de Cotizaciones. Aquí puede agregar nuevas cotizaciones para establecer recordatorios
			sobre qué elementos están el cliente ha solicitado el envío.
		</p>
		<p>
			También podrá ver estas citas aquí, realizar los cambios necesarios y eliminarlas cuando has terminado de
			usarlos.
		</p>
	</div>
);

const CardBox = ({ header, title, text, path, image }) => (
	<div className="col-xl">
		<a href={path}>
			<Card className="index-add-client-view mt-4">
				<Card.Header>{header}</Card.Header>
				<Card.Body>
					<div className="row">
						<div className="col-md-3 text-center ">
							<i className={`${image} quote-logo pb-1`} />
						</div>
						<div className="col-md-9">
							<Card.Title>{title}</Card.Title>
							<Card.Text>{text}</Card.Text>
						</div>
					</div>
				</Card.Body>
			</Card>
		</a>
	</div>
);

const ClientForm = ({ onClientChange, clients, formatName }) => (
	<div className="pt-3">
		<h4>Filtrar Por Cliente</h4>
		<div className="input-group">
			<select onChange={onClientChange} className="custom-select" id="client">
				<option value="" disabled selected>
					Selecciona un cliente
				</option>
				{clients.map((client, index) => {
					let fname = formatName(client.fname);
					let lname = formatName(client.lname);
					let full_name = `${fname} ${lname}`;
					return (
						<option value={client.id} key={index}>
							{full_name}
						</option>
					);
				})}
			</select>
		</div>
	</div>
);

export default Index;

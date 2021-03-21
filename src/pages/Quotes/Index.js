import React, { useState, useEffect, Fragment } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import { Card, Table, Pagination } from 'react-bootstrap';
import { Config } from '../../data/Config';
import { QuoteHeadings } from '../../data/TableHeadings';
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
				<div className="col">
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
					path="/quotes/add"
					image="fas fa-plus-square"
				/>
			</div>
			<hr />
			<Spreadsheet
				onDeleteRows={onDeleteQuotes.bind(this)}
				data={filtered_quotes}
				onClick={sortOrders.bind(this)}
				onSortDescending={sortDescendingOrders.bind(this)}
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
	<div className="col">
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

const Spreadsheet = ({ data, onClick, onSortDescending, onDeleteRows }) => {
	const [ filter, setFilter ] = useState({ key: 9999, status: 'none' });
	const [ indices, setIndices ] = useState([ [ 0 ] ]);
	const [ currentPage, setCurrentPage ] = useState(0);
	const [ selectedRows, setSelectedRows ] = useState([]);
	const headers = QuoteHeadings(onClick);

	useEffect(
		() => {
			onIndexingPages(data);
		},
		[ filter, data ]
	);

	const onIndexingPages = (quotes) => {
		let pages = [];
		let copy = [ ...quotes ];
		do {
			let page = [];
			for (let i = 0; i < 10; i++) {
				if (copy.length === 0) break;
				else page.push(copy.shift());
			}
			pages.push(page);
		} while (copy.length > 0);
		setIndices(pages);
		console.log(quotes);
	};

	const onFilterClick = (e, index) => {
		e.preventDefault();
		return filter.key === index ? onSetStatus(filter.key, filter.status) : onSetStatus(index, filter.status);
	};

	const onSetStatus = (key, status) => {
		switch (status) {
			case 'none':
				setFilter({ key: key, status: 'asc' });
				return 'asc';
			case 'asc':
				setFilter({ key: key, status: 'des' });
				return 'des';
			case 'des':
				setFilter({ key: key, status: 'asc' });
				return 'asc';
		}
	};

	const onOrderPageClick = (uid) => (window.location.href = `/quotes/quote?id=${uid}`);

	const onClientPageClick = (clientId) => (window.location.href = `/clients/${clientId}`);

	const setChevron = (item, index) => {
		if (filter.key !== index) return item.class.none;
		else if (filter.status === 'asc') return item.class.asc;
		else if (filter.status === 'des') return item.class.des;
	};

	const onChevronClick = (e, item, index) => {
		const status = onFilterClick(e, index);
		switch (status) {
			case 'asc':
				return item.onClick();
			case 'des':
				const orders = item.onClick();
				return onSortDescending(orders);
		}
	};

	//Set the row id of the quote obj to the state for removal afterwards
	const onCheckBoxClick = (e) => {
		const row_id = e.target.value;
		let matching = selectedRows.filter((row) => row === row_id);
		if (matching.length === 0) {
			setSelectedRows((prevState) => [ ...prevState, row_id ]);
		} else {
			matching = selectedRows.filter((row) => row !== row_id);
			setSelectedRows(matching);
		}
	};

	//Handle trash button click
	const onTrashClick = () => {
		if (selectedRows.length === 0) return;
		if (!window.confirm('¿Está seguro de que desea eliminar estas cotizaciones? No se pueden recuperar.')) return;
		onDeleteRows(selectedRows);
	};

	return (
		<Fragment>
			<Table striped bordered hover className="mb-1">
				<thead>
					<tr>
						<th className="text-center">
							<button className="btn-default btn p-0 m-0" onClick={onTrashClick.bind(this)}>
								<i
									className={`fas fa-trash${selectedRows.length > 0
										? ' text-danger'
										: ' text-secondary'}`}
								/>
							</button>
						</th>
						{headers.map((item, index) => {
							const chevron = setChevron(item, index);
							return (
								<th key={index}>
									{item.name}
									<i
										style={item.style}
										className={chevron}
										onClick={(e) => onChevronClick(e, item, index)}
									/>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{indices[currentPage].map((item, index) => (
						<tr key={index}>
							<td className="text-center">
								<input type="checkbox" value={item.uid} onChange={onCheckBoxClick} />
							</td>
							<td
								className="btn-link"
								style={{ cursor: 'pointer' }}
								onClick={() => onOrderPageClick(item.uid)}
							>
								{item.uid}
							</td>
							<td
								className="btn-link"
								style={{ cursor: 'pointer' }}
								onClick={() => onClientPageClick(item.client)}
							>
								{item.client}
							</td>
							<td>{item.date}</td>
							<td>{item.item}</td>
							<td>${item['quoted-price']}</td>
							<td>${item.cost}</td>
						</tr>
					))}
				</tbody>
			</Table>
			<p className="text-right p-0 m-0 text-secondary">* Se muestran {data.length} resultados</p>
			<div className="d-flex justify-content-center align-items-center flex-row">
				<Pagination>
					{indices.map((item, index) => {
						return (
							<Pagination.Item
								key={index}
								active={index === currentPage}
								onClick={() => setCurrentPage(index)}
							>
								{index + 1}
							</Pagination.Item>
						);
					})}
				</Pagination>
			</div>
		</Fragment>
	);
};

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

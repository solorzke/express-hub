import React, { useState, useEffect } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import Toast from '../../components/Toast/Toast';
import { Months, Days, Years } from '../../data/Dates';
import { Headings } from '../../data/TableHeadings';
import { Config } from '../../data/Config';
import { Spreadsheet } from '../../components/Spreadsheet/Spreadsheet';
import Firebase from 'firebase/app';
import 'firebase/firestore';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Index = () => <Wrapper children={<Body />} active="orders" current="Pedidos" />;

const Body = () => {
	const [ ORDERS, setOrders ] = useState(null);
	const [ FILTERED_ORDERS, setFilteredOrders ] = useState(null);
	const [ CLIENTS, setClients ] = useState(null);
	//State data that control the toast message
	const [ toast, setToast ] = useState(false);
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ message, setMessage ] = useState('Eliminando Ordenes');
	const [ heading, setHeading ] = useState('Se está eliminando los pedidos ...');

	useEffect(
		() => {
			if (ORDERS === null) {
				getOrders();
			}
		},
		[ ORDERS, CLIENTS, FILTERED_ORDERS ]
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
			setHeading('Se está eliminando los pedidos ...');
			setMessage('Eliminando Ordenes');
			console.log('Toast Props set to normal.');
		}, 3000);
	};

	const getClients = async (orders) => {
		for (let i = 0; i < orders.length; i++) {
			const order = orders[i];
			const client = (await Firebase.firestore().collection('clients').doc(order.clientId).get()).data();
			setClients((prevState) => ({
				...prevState,
				[order.clientId]: {
					fname: client.fname,
					lname: client.lname,
					id: client.id
				}
			}));
		}
	};

	const getOrders = async () => {
		try {
			let results = [];
			const snapshot = await Firebase.firestore().collection('orders').get();
			snapshot.forEach((doc) => results.push(doc.data()));
			setOrders(results);
			setFilteredOrders(results);
			console.log(`> Firebase: ${results.length} results found.`);
			getClients(results);
		} catch (error) {
			console.error("> Firebase: Couldn't send request.");
			console.error(error);
		}
	};

	const sortOrders = (type, field) => {
		let copy = [ ...FILTERED_ORDERS ];
		switch (type) {
			case 'string':
				const sortedStrings = copy.sort((a, b) => {
					if (a[field] < b[field]) return -1;
					else if (a[field] > b[field]) return 1;
					else return 0;
				});
				setFilteredOrders(sortedStrings);
				return sortedStrings;
			case 'num':
				const sortedNums = copy.sort((a, b) => {
					a = parseInt(a[field]);
					b = parseInt(b[field]);
					return b - a;
				});
				setFilteredOrders(sortedNums);
				return sortedNums;
			case 'date':
				const sortedDates = copy.sort((a, b) => {
					a = a.date.split('/');
					b = b.date.split('/');
					return b[2] - a[2] || b[0] - a[0] || b[1] - a[1];
				});
				setFilteredOrders(sortedDates);
				return sortedDates;
			case 'boolean':
				const sortedBooleans = copy.sort((a, b) => Number(a.shippingStatus) - Number(b.shippingStatus));
				setFilteredOrders(sortedBooleans);
				return sortedBooleans;
		}
	};

	const sortDescendingOrders = (sorted) => setFilteredOrders(sorted.reverse());

	const onDateChange = () => {
		const selected_month = document.getElementById('month').selectedOptions[0].value;
		const selected_day = document.getElementById('day').selectedOptions[0].value;
		const selected_year = document.getElementById('year').selectedOptions[0].value;
		const copy = [ ...ORDERS ];
		const filtered = copy.filter((item) => {
			const currentMonth = item.date.split('/')[0];
			const currentDay = item.date.split('/')[1];
			const currentYear = item.date.split('/')[2];
			return currentMonth === selected_month && currentDay >= selected_day && currentYear === selected_year;
		});
		setFilteredOrders(filtered);
	};

	//Delete all orders with their id from the firestore and storage and rerender the DOM
	const onDeleteOrders = async (orders) => {
		try {
			setToast(true);
			for (let i = 0; i < orders.length; i++) {
				const id = orders[i];
				//Run a loop to delete every file in the storage belonging to the order id
				const files = (await Firebase.storage().ref(`images/${id}`).list()).items;
				for (let j = 0; j < files.length; j++) {
					const file_path = files[j]['_delegate']['_location']['path_'];
					await Firebase.storage().ref(file_path).delete();
				}
				//Then delete the order from the firestore
				await Firebase.firestore().collection('orders').doc(id).delete();
			}
			setToastProps(
				'fas fa-check-circle toast-success',
				'Pedidos borrado!',
				`¡Sus pedidos selecionados estan borrados!`,
				'> Firebase: order data deleted',
				true
			);
		} catch (error) {
			console.error(error);
			setToastProps(
				'fas fa-window-close toast-fail',
				'Fallido',
				`¡No se pudo borrar el pedido!`,
				error.message,
				false
			);
		}
	};

	if (ORDERS === null || CLIENTS === null) return <LoadingPage />;
	return (
		<main className="container-fluid">
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<div className="row">
				<Description />
				<DateForm onDateChange={onDateChange.bind(this)} />
			</div>
			<Spreadsheet
				type="orders"
				headings={Headings}
				clients={CLIENTS}
				data={FILTERED_ORDERS}
				onSortAsc={sortOrders.bind(this)}
				onSortDes={sortDescendingOrders.bind(this)}
				onDeleteRows={onDeleteOrders.bind(this)}
			/>
		</main>
	);
};

const Description = () => (
	<div id="description" className="col-md-7 pt-3">
		<h1>Manifiesto de Órdenes de Teloentrego</h1>
		<p>
			Bienvenido a la página del manifiesto de pedidos de Teloentrego. Aquí podrá ver todos los pedidos que están
			guardados actualmente en el registro y verlos.
		</p>
		<p>También puede filtrar estos resultados según el parámetro de filtro que desee.</p>
	</div>
);

const DateForm = ({ onDateChange }) => (
	<div className="col-md-5 py-3">
		<h4>Filtrar Por Fecha</h4>
		<div className="input-group">
			<select onChange={onDateChange} className="custom-select" id="month">
				{Months.map((month, index) => (
					<option key={index} value={month.value}>
						{month.name}
					</option>
				))}
			</select>
			<select onChange={onDateChange} className="custom-select" id="day">
				{Days.map((day, index) => (
					<option key={index} value={day}>
						{day}
					</option>
				))}
			</select>
			<select onChange={onDateChange} className="custom-select" id="year">
				{Years.map((year, index) => (
					<option key={index} value={year}>
						{year}
					</option>
				))}
			</select>
		</div>
	</div>
);

export default Index;

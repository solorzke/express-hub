import React, { useState, useEffect, Fragment } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import { Table, Pagination } from 'react-bootstrap';
import { Headings } from '../../data/TableHeadings';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from '../../data/Config';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import { Months, Days, Years } from '../../data/Dates';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Index = () => <Wrapper children={<Body />} active="orders" current="Pedidos" />;

const Body = () => {
	const [ ORDERS, setOrders ] = useState(null);
	const [ FILTERED_ORDERS, setFilteredOrders ] = useState(null);
	const [ CLIENTS, setClients ] = useState(null);

	useEffect(
		() => {
			if (ORDERS === null) {
				getOrders();
			}
		},
		[ ORDERS, CLIENTS, FILTERED_ORDERS ]
	);

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
		console.log(FILTERED_ORDERS);
		setFilteredOrders(filtered);
	};

	if (ORDERS === null || CLIENTS === null) return <LoadingPage />;
	return (
		<main className="container-fluid">
			<div className="row">
				<Description />
				<DateForm onDateChange={onDateChange.bind(this)} />
			</div>
			<Spreadsheet
				clients={CLIENTS}
				data={FILTERED_ORDERS}
				onClick={sortOrders.bind(this)}
				onSortDescending={sortDescendingOrders.bind(this)}
			/>
		</main>
	);
};

const Spreadsheet = ({ clients, data, onClick, onSortDescending }) => {
	const [ filter, setFilter ] = useState({ key: 9999, status: 'none' });
	const [ indices, setIndices ] = useState([ [ 0 ] ]);
	const [ currentPage, setCurrentPage ] = useState(0);
	const headers = Headings(onClick);

	useEffect(
		() => {
			onIndexingPages(data);
		},
		[ filter, data ]
	);

	const onIndexingPages = (orders) => {
		let pages = [];
		let copy = [ ...orders ];
		do {
			let page = [];
			for (let i = 0; i < 10; i++) {
				if (copy.length === 0) break;
				else page.push(copy.shift());
			}
			pages.push(page);
		} while (copy.length > 0);
		setIndices(pages);
		console.log(orders);
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

	const onOrderPageClick = (orderId, clientId) => {
		const fname = clients[clientId].fname;
		const lname = clients[clientId].lname;
		window.location.href = `/order?id=${orderId}&fname=${fname}&lname=${lname}`;
	};

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

	return (
		<Fragment>
			<Table striped bordered hover className="mb-1">
				<thead>
					<tr>
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
							<td
								className="btn-link"
								style={{ cursor: 'pointer' }}
								onClick={() => onOrderPageClick(item.orderId, item.clientId)}
							>
								{item.orderId}
							</td>
							<td
								className="btn-link"
								style={{ cursor: 'pointer' }}
								onClick={() => onClientPageClick(item.clientId)}
							>
								{item.clientId}
							</td>
							<td>{item.date}</td>
							<td>{item.country}</td>
							<td>{item.province}</td>
							<td>{item.address}</td>
							<td className={item.shippingStatus ? 'text-success' : 'text-danger'}>
								{item.shippingStatus ? 'Enviado' : 'No Enviado'}
							</td>
							<td>{item.trackingNum}</td>
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
	<div className="col-md-5 pt-3">
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

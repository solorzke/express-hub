import React, { useState, useEffect } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import { Table } from 'react-bootstrap';
import { Headings } from '../../data/TableHeadings';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from '../../data/Config';
import LoadingPage from '../../components/Placeholders/LoadingPage';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Index = () => <Wrapper children={<Body />} active="orders" current="Orders" />;

const Body = () => {
	const [ ORDERS, setOrders ] = useState(null);
	const [ CLIENTS, setClients ] = useState(null);

	useEffect(
		() => {
			if (ORDERS === null) {
				getOrders();
			}
		},
		[ ORDERS, CLIENTS ]
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
			console.log(`> Firebase: ${results.length} results found.`);
			getClients(results);
		} catch (error) {
			console.error("> Firebase: Couldn't send request.");
			console.error(error);
		}
	};

	const sortOrders = (type, field) => {
		let copy = [ ...ORDERS ];
		switch (type) {
			case 'string':
				const sortedStrings = copy.sort((a, b) => {
					if (a[field] < b[field]) return -1;
					else if (a[field] > b[field]) return 1;
					else return 0;
				});
				setOrders(sortedStrings);
				return sortedStrings;
			case 'num':
				const sortedNums = copy.sort((a, b) => {
					a = parseInt(a[field]);
					b = parseInt(b[field]);
					return b - a;
				});
				setOrders(sortedNums);
				return sortedNums;
			case 'date':
				const sortedDates = copy.sort((a, b) => {
					a = a.date.split('/');
					b = b.date.split('/');
					return b[2] - a[2] || b[0] - a[0] || b[1] - a[1];
				});
				setOrders(sortedDates);
				return sortedDates;
			case 'boolean':
				const sortedBooleans = copy.sort((a, b) => Number(a.shippingStatus) - Number(b.shippingStatus));
				setOrders(sortedBooleans);
				return sortedBooleans;
		}
	};

	const sortDescendingOrders = (sorted) => setOrders(sorted.reverse());

	if (ORDERS === null || CLIENTS === null) return <LoadingPage />;
	return (
		<main className="container-fluid">
			<Description />
			<Spreadsheet
				clients={CLIENTS}
				data={ORDERS}
				onClick={sortOrders.bind(this)}
				onSortDescending={sortDescendingOrders.bind(this)}
			/>
		</main>
	);
};

const Spreadsheet = ({ clients, data, onClick, onSortDescending }) => {
	const [ filter, setFilter ] = useState({ key: 9999, status: 'none' });
	const headers = Headings(onClick);

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

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					{headers.map((item, index) => {
						const chevron = () => {
							if (filter.key !== index) return item.class.none;
							else if (filter.status === 'asc') return item.class.asc;
							else if (filter.status === 'des') return item.class.des;
						};
						return (
							<th key={index}>
								{item.name}
								<i
									style={item.style}
									className={chevron()}
									onClick={(e) => {
										const status = onFilterClick(e, index);
										switch (status) {
											case 'asc':
												return item.onClick();
											case 'des':
												const orders = item.onClick();
												return onSortDescending(orders);
										}
									}}
								/>
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{data.map((item, index) => (
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
							{item.shippingStatus ? 'Shipped' : 'Not Shipped'}
						</td>
						<td>{item.trackingNum}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

const Description = () => (
	<div id="description" className="col-md-7 pt-3">
		<h1>Mtech Express Orders Manifest</h1>
		<p>
			Welcome to the Mtech Express Orders Manifest page. Here you'll be able to view all the orders that are
			currently saved on record, and view them.
		</p>
		<p>You can also filter these results based on the desired filter parameter you'd like.</p>
	</div>
);

export default Index;

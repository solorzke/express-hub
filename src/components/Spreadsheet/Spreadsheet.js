import React, { useState, useEffect, Fragment } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import './Spreadsheet.css';

export const Spreadsheet = ({ headings, clients, data, onSortAsc, onSortDes, onDeleteRows, type }) => {
	const [ filter, setFilter ] = useState({ key: 9999, status: 'none' });
	const [ indices, setIndices ] = useState([ [ 0 ] ]);
	const [ currentPage, setCurrentPage ] = useState(0);
	const [ selectedRows, setSelectedRows ] = useState([]);
	const headers = headings(onSortAsc);

	useEffect(() => onIndexingPages(data), [ filter, data ]);

	const onIndexingPages = (payload) => {
		let pages = [];
		let copy = [ ...payload ];
		do {
			let page = [];
			for (let i = 0; i < 10; i++) {
				if (copy.length === 0) break;
				else page.push(copy.shift());
			}
			pages.push(page);
		} while (copy.length > 0);
		setIndices(pages);
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
				const payload = item.onClick();
				return onSortDes(payload);
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

	const onOrderPageClick = (orderId, clientId) => {
		const fname = clients[clientId].fname;
		const lname = clients[clientId].lname;
		window.location.href = `/cloud/order?id=${orderId}&fname=${fname}&lname=${lname}`;
	};

	const onQuotePageClick = (uid) => (window.location.href = `/cloud/quotes/quote?id=${uid}`);

	const onClientPageClick = (clientId) => (window.location.href = `/cloud/clients/${clientId}`);

	return (
		<Fragment>
			<div className="table-responsive">
				<Table striped bordered hover className="mb-1">
					<Head
						headers={headers}
						selectedRows={selectedRows}
						onTrashClick={onTrashClick.bind(this)}
						setChevron={setChevron.bind(this)}
						onChevronClick={onChevronClick.bind(this)}
					/>
					{type === 'orders' && (
						<Orders
							currentPage={indices[currentPage]}
							onCheckBoxClick={onCheckBoxClick.bind(this)}
							onOrderPageClick={onOrderPageClick.bind(this)}
							onClientPageClick={onClientPageClick.bind(this)}
						/>
					)}
					{type === 'quotes' && (
						<Quotes
							currentPage={indices[currentPage]}
							onCheckBoxClick={onCheckBoxClick.bind(this)}
							onQuotePageClick={onQuotePageClick.bind(this)}
							onClientPageClick={onClientPageClick.bind(this)}
						/>
					)}
				</Table>
			</div>
			<PaginateBox
				currentPage={currentPage}
				data={data}
				indices={indices}
				setCurrentPage={setCurrentPage.bind(this)}
			/>
		</Fragment>
	);
};

const Head = ({ onTrashClick, selectedRows, headers, setChevron, onChevronClick }) => (
	<thead>
		<tr>
			<th className="text-center">
				<button className="btn-default btn p-0 m-0" onClick={onTrashClick.bind(this)}>
					<i className={`fas fa-trash${selectedRows.length > 0 ? ' text-danger' : ' text-secondary'}`} />
				</button>
			</th>
			{headers.map((item, index) => {
				const chevron = setChevron(item, index);
				return (
					<th key={index} className="spreadsheet-header">
						{item.name}
						<i style={item.style} className={chevron} onClick={(e) => onChevronClick(e, item, index)} />
					</th>
				);
			})}
		</tr>
	</thead>
);

const Orders = ({ currentPage, onCheckBoxClick, onOrderPageClick, onClientPageClick }) => (
	<tbody>
		{currentPage.map((item, index) => (
			<tr key={index}>
				<td className="text-center">
					<input type="checkbox" value={item.orderId} onChange={onCheckBoxClick} />
				</td>
				<td
					className="btn-link"
					style={{ cursor: 'pointer' }}
					onClick={() => onOrderPageClick(item.orderId, item.clientId)}
				>
					{item.orderId}
				</td>
				<td className="btn-link" style={{ cursor: 'pointer' }} onClick={() => onClientPageClick(item.clientId)}>
					{item.clientId}
				</td>
				<td>{item.date}</td>
				<td>{item.province}</td>
				<td>{item.address}</td>
				<td className={item.shippingStatus ? 'text-success' : 'text-danger'}>
					{item.shippingStatus ? 'Enviado' : 'No Enviado'}
				</td>
				<td>{item.trackingNum}</td>
			</tr>
		))}
	</tbody>
);

const Quotes = ({ currentPage, onCheckBoxClick, onQuotePageClick, onClientPageClick }) => (
	<tbody>
		{currentPage.map((item, index) => (
			<tr key={index} className="spreadsheet-data">
				<td className="text-center">
					<input type="checkbox" value={item.uid} onChange={onCheckBoxClick} />
				</td>
				<td className="btn-link" style={{ cursor: 'pointer' }} onClick={() => onQuotePageClick(item.uid)}>
					{item.uid}
				</td>
				<td className="btn-link" style={{ cursor: 'pointer' }} onClick={() => onClientPageClick(item.client)}>
					{item.client}
				</td>
				<td>{item.date}</td>
				<td>{item.item}</td>
				<td>${item['quoted-price']}</td>
				<td>${item.cost}</td>
			</tr>
		))}
	</tbody>
);

const PaginateBox = ({ data, indices, setCurrentPage, currentPage }) => (
	<Fragment>
		<p className="text-right pb-3 m-0 text-secondary">* Se muestran {data.length} resultados</p>
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

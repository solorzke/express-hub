import React, { useRef, useEffect } from 'react';
import { Accordion, Button, Card, ListGroup } from 'react-bootstrap';
import './Receipt.css';

const Receipt = ({ form, files }) => {
	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	const formatDate = (str) => {
		const bits = str.split('-');
		return `${bits[1]}-${bits[2]}-${bits[0]}`;
	};

	const clientName = form.clientName;

	return (
		<div className="receipt">
			<div className="receipt-breakdown">
				<div className="receipt-breakdown--header">
					<p>Receipt for</p>
					<h2>{clientName}</h2>
				</div>
				<ul className="receipt-breakdown--list">
					<BreakDownEntry icon="fa fa-calendar-day" title="Order Date:" value={formatDate(form.date)} />
					<BreakDownEntry
						icon="fa fa-globe-americas"
						title="Province, Country:"
						value={`${form.province}, ${form.country}`}
					/>
					<BreakDownEntry
						icon="fa fa-address-card"
						title="Shipping Address:"
						value={formatString(form.address)}
					/>
					<BreakDownEntry icon="fa fa-barcode" title="Confirmation No:" value={form.orderId} />
				</ul>
			</div>
			<Overview
				product="Mtech Express Order Summary"
				merchant={'Allied Steel Buildings'}
				merchantEmail={'info@alliedbuildings.com'}
				name={form.clientName}
				value={'$20,000.00 USD'}
				files={files}
			/>
		</div>
	);
};

const BreakDownEntry = ({ icon, title, value }) => {
	return (
		<li>
			<span className={icon} />
			<div className="list-content">
				<p>
					{title}
					<span className="list-bold">{value}</span>
				</p>
			</div>
		</li>
	);
};

const Overview = (props) => {
	return (
		<div className="receipt-overview pb-3">
			<OverviewHeader logo={'http://www.alliedbuildings.com/wp-content/uploads/2016/11/Allied-Black-Logo.png'} />
			<OverviewBody {...props} />
			{Object.keys(props.files).map((item) => <Item data={props.files[item]} />)}
			<OverviewFooter {...props} />
		</div>
	);
};

const OverviewHeader = ({ logo }) => {
	const day = new Date().getDay();
	const year = new Date().getFullYear();
	const month = () => {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		return months[new Date().getMonth()];
	};

	const calcTime = () => {
		// create Date object for current location
		const d = new Date();
		const hours = d.getHours();
		const min = d.getMinutes();
		return `${hours}:${min}`;
	};

	return (
		<div className="overview-header">
			<img className="logo" src={logo} />
			<div className="timestamp">
				<span>{`${month()} ${day}, ${year}`}</span>
				<span>{`${calcTime()} EST`}</span>
			</div>
			<hr />
		</div>
	);
};

const PurchaseOverview = () => (
	<div className="purchase-overview">
		<h3>Mtech Express Order Summary</h3>
	</div>
);

const OverviewBody = (props) => {
	return (
		<div className="overview-body">
			<PurchaseOverview {...props} />
			<div className="user-info">
				<p className="user-info-name"> Hello {props.name},</p>
				<p className="user-info-text">
					The following item(s) listed below will be ordered and shipped to you once they are ready. Mtech
					Express will contact you soon regarding the status of the order and its shipment.
				</p>
				<p className="user-info-text">
					Of course, if you have any questions, please feel free to contact Marco Solorzano.
				</p>
				<p>Thank you for choosing Mtech Express.</p>
				<p className="salutation">
					<img src="https://ec2-52-40-174-59.us-west-2.compute.amazonaws.com/banners/about_us_pic.png" />
				</p>
			</div>

			<div className="descriptor">
				<p>It may take a few days for this order to be ready to ship</p>
			</div>
		</div>
	);
};

const OverviewFooter = () => {
	return (
		<footer className="overview-footer">
			<span className="site">
				<a href="http://www.alliedbuildings.com/contact-us/" target="_blank">
					www.allied.build/help
				</a>
			</span>
			<span className="invoice-id">+1.877.94 STEEL</span>
		</footer>
	);
};

const Item = ({ data }) => {
	let aviRef = useRef(null);
	useEffect(() => {
		if (aviRef !== null) {
			const url = typeof data.avi === 'object' ? URL.createObjectURL(data.avi) : data.avi;
			aviRef.current.src = url;
		}
	});

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	return (
		<div className="w-100">
			<Accordion>
				<Card>
					<Card.Header className="px-2 py-0">
						<div className="row">
							<div className="col-md-2 d-flex justify-content-center align-items-center">
								<button className="btn btn-default btn-file">
									<img ref={aviRef} className="text-center" height="50" width="50" id="avi" />
								</button>
							</div>
							<div className="col-md-10 pl-3 text-left pt-2">
								<Accordion.Toggle
									as={Button}
									variant="link"
									eventKey="0"
									className="p-0 float-right d-inline"
								>
									<i className="fas fa-chevron-down float-right" />
								</Accordion.Toggle>
								<span className="d-inline">
									<h5 className="d-inline">{formatString(data.name)}</h5>
									<p>Quantity: {data.quantity}</p>
								</span>
							</div>
						</div>
					</Card.Header>
					<Accordion.Collapse eventKey={'0'}>
						<Card.Body className="p-0">
							<ListGroup variant="flush">
								{data.files.map((item, index) => {
									return (
										<ListGroup.Item
											key={index}
											className="file-item"
											style={{
												borderBottom: index === data.files.length - 1 ? '1px solid #e8e8e8' : ''
											}}
										>
											{item.name}
										</ListGroup.Item>
									);
								})}
							</ListGroup>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		</div>
	);
};

export default Receipt;

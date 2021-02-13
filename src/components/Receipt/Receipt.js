import React from 'react';
import Item from '../Files/Item';
import './Receipt.css';

const Receipt = ({ form, files }) => {
	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
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
					<BreakDownEntry icon="fa fa-calendar-day" title="Order Date:" value={form.date} />
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

export default Receipt;

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
					<p>Recibo de</p>
					<h2>{clientName}</h2>
				</div>
				<ul className="receipt-breakdown--list">
					<BreakDownEntry icon="fa fa-calendar-day" title="Fecha De Orden:" value={form.date} />
					<BreakDownEntry
						icon="fa fa-globe-americas"
						title="Provincia, País:"
						value={`${form.province}, ${form.country}`}
					/>
					<BreakDownEntry
						icon="fa fa-address-card"
						title="Dirección de Envío:"
						value={formatString(form.address)}
					/>
					<BreakDownEntry icon="fa fa-barcode" title="Confirmación No:" value={form.orderId} />
				</ul>
			</div>
			<Overview
				product="Teloentrego Order Summary"
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
			{Object.keys(props.files).map((item, index) => <Item key={index} data={props.files[item]} />)}
			<OverviewFooter {...props} />
		</div>
	);
};

const OverviewHeader = ({ logo }) => {
	const day = new Date().getDate();
	const year = new Date().getFullYear();
	const month = () => {
		const months = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre'
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
		<h3>Resumen del pedido de Teloentrego</h3>
	</div>
);

const OverviewBody = (props) => {
	return (
		<div className="overview-body">
			<PurchaseOverview {...props} />
			<div className="user-info">
				<p className="user-info-name">Hola {props.name},</p>
				<p className="user-info-text">
					Los siguientes artículos que se enumeran a continuación se ordenarán y se le enviarán una vez que
					estén listos. Teloentrego Shipping se pondrá en contacto contigo a la brevedad sobre el estado del
					pedido y su envío.
				</p>
				<p className="user-info-text">
					Por supuesto, si tiene alguna pregunta, no dude en ponerse en contacto con Marco Solorzano.{' '}
				</p>
				<p>Gracias por elegir Teloentrego Shipping.</p>
				<p className="salutation">
					<img src="https://ec2-52-40-174-59.us-west-2.compute.amazonaws.com/banners/about_us_pic.png" />
				</p>
			</div>

			<div className="descriptor">
				<p>Es posible que este pedido tarde unos días en estar listo para enviarse.</p>
			</div>
		</div>
	);
};

const OverviewFooter = () => {
	return (
		<footer className="overview-footer">
			<span className="site">
				<a href="https://www.teloentrego.com" target="_blank">
					https://teloentregoec.com
				</a>
			</span>
			<span className="invoice-id">+1 (973)-474-7298</span>
		</footer>
	);
};

export default Receipt;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Accordion, Card, ListGroup, Button } from 'react-bootstrap';
import { fieldTypes } from '../../data/InputTypes';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import Wrapper from '../../components/Wrapper/Wrapper';
import SlideCard from '../../components/SlideCard/Card';
import Field from '../../components/SlideCard/Field';
import Empty from '../../components/Placeholders/Empty';
import Loading from '../../components/Placeholders/Loading';
import Receipt from '../../components/Receipt/Receipt';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Config } from '../../data/Config';

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => new URLSearchParams(useLocation().search);

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Order = () => <Wrapper children={<Body />} current="Orders" active="orders" />;

const Body = () => {
	let QUERY = useQuery();
	const ORDER_ID = QUERY.get('id');
	const [ FNAME, setFname ] = useState('');
	const [ LNAME, setLname ] = useState('');
	const [ ORDER, setOrder ] = useState(null);
	const [ UPDATING, setUpdating ] = useState(false);

	useEffect(
		() => {
			setFname(QUERY.get('fname').replace('%20', ' '));
			setLname(QUERY.get('lname').replace('%20', ' '));
			getOrder();
		},
		[ UPDATING ]
	);

	//Get the order data from the firestore based on the orderId
	const getOrder = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('orders').where('orderId', '==', ORDER_ID).get();
			if (snapshot.empty) return alert("> Firebase: Didn't return any orders");
			let order_doc = [];
			snapshot.forEach((doc) => order_doc.push(doc.data()));
			setOrder(order_doc[0]);
		} catch (error) {
			console.log('> Firebase: Error with the request.');
			console.error(error);
		}
	};

	//Update order to the firestore and refresh the page afterwards
	const updateOrder = async (e, data) => {
		e.preventDefault();
		try {
			setUpdating(true);
			const value = Object.values(data)[0];
			if (value === '' && typeof value !== 'boolean') return alert('Please enter a value before updating');
			await Firebase.firestore().collection('orders').doc(ORDER_ID).update(data);
			window.location.reload();
		} catch (error) {
			setUpdating(false);
			console.log("> Firebase: Request couldn't go through");
			console.error(error);
		}
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	if (ORDER === null) return <LoadingPage />;
	return (
		<main className="container-fluid pt-3">
			<div className="row">
				<Description
					state={{ fname: FNAME, lname: LNAME }}
					formatString={formatString.bind(this)}
					orderId={QUERY.get('id')}
				/>
				<ShipmentConfirmation
					shipped={ORDER !== null ? ORDER.shippingStatus : false}
					onClick={updateOrder.bind(this)}
					progress={UPDATING}
				/>
			</div>

			<ButtonsPane client={ORDER} />
			<div className="row">
				<SlideCard
					children={
						<Details
							state={ORDER}
							formatString={formatString.bind(this)}
							onUpdate={updateOrder.bind(this)}
						/>
					}
					title="Order Details"
					icon="fas fa-list-alt pr-2"
				/>
				<SlideCard
					children={<Documents state={ORDER} formatString={formatString.bind(this)} />}
					title="Documents"
					options={
						<a href={`/order/update-items?id=${ORDER_ID}`} className="btn btn-link">
							Add/Update Docs List
						</a>
					}
					icon="fas fa-clipboard-list pr-2"
				/>
				<SlideCard
					children={
						ORDER !== null ? (
							<Receipt
								form={{
									clientName: formatString(`${FNAME} ${LNAME}`),
									address: ORDER.address,
									country: ORDER.country,
									province: ORDER.province,
									orderId: ORDER_ID,
									date: ORDER.date
								}}
								files={[]}
							/>
						) : (
							<React.Fragment />
						)
					}
					title="Receipt"
					icon="fas fa-receipt pr-2"
				/>
			</div>
		</main>
	);
};

const Description = ({ state, formatString, orderId }) => (
	<div id="description" className="col-md-7">
		<h2>Order Number: {orderId}</h2>
		<p>
			For Client: <strong>{state !== null ? formatString(`${state.fname} ${state.lname}`) : ''}</strong>
		</p>
		<p>
			Below is an in depth look at the shipment order that was created including details about its destination,
			cargo items, and pertinent files/documents.
		</p>
		<p>
			You can update the shipment status below when this order and its items are ready to be sent to the client.
		</p>
		<p>Update the contents of this order and add/remove any files or documents too.</p>
	</div>
);

const ShipmentConfirmation = ({ shipped, onClick, progress }) => {
	const itHasShipped = `Currently, this order has already been shipped`;
	const hasNotShipped = `Currently, this order isn't marked for shipping yet.`;
	const subtitle = shipped ? itHasShipped : hasNotShipped;
	const btnText = shipped ? "Change to 'Not ready to ship'" : "Confirm 'Ready to Ship'";
	const btnColor = shipped ? 'text-danger' : 'text-success';
	return (
		<div id="shipment-confirmation" className="col-md-5 d-flex justify-content-center align-items-end">
			<Card>
				<Card.Body>
					<Card.Title>
						<i className="fas fa-dolly pr-3" />Shipment Status
					</Card.Title>
					<Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
					<Card.Text>Confirm this order is ready for shipping or revert its status.</Card.Text>
					<Card.Link
						variant="link"
						className={btnColor}
						as={Button}
						onClick={(e) => onClick(e, { shippingStatus: !shipped })}
					>
						{progress ? <Loading /> : btnText}
					</Card.Link>
				</Card.Body>
			</Card>
		</div>
	);
};

const Details = ({ state, formatString, onUpdate }) => {
	if (state !== null) {
		const types = fieldTypes(state);
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
	}
	return <Empty />;
};

const ButtonsPane = ({ client }) => (
	<div id="buttons-pane" className="p-3">
		<a href={document.referrer} className="float-sm-right btn btn-link btn-sm text-primary mx-2 px-3">
			<i className="fas fa-arrow-left pr-3" />Go Back
		</a>
	</div>
);

const Documents = ({ state, formatString }) => {
	const findFiles = (data, delimeter) => {
		let files = [];
		for (let i = 0; i < data.length; i++) {
			const key = data[i];
			if (key !== delimeter) files.push({ name: key, path: state['item-images'][key] });
		}
		return files;
	};

	if (state !== null) {
		const images = Object.keys(state['item-images']);
		return (
			<div className="items">
				{state.items.map((item, index) => {
					const itemKey = item.name.split(' ').join('');
					const relevant_images = images.filter((key) => key.includes(itemKey));
					const avi = relevant_images.filter((key) => `${itemKey}-avi` === key).join('');
					const files = findFiles(relevant_images, avi);
					const data = {
						avi: state['item-images'][avi],
						files: files,
						quantity: item.quantity,
						name: formatString(item.name)
					};
					return <Item key={index} data={data} formatString={formatString} />;
				})}
			</div>
		);
	}
	return <Empty />;
};

const Item = ({ data, formatString }) => {
	const Header = () => (
		<Card.Header className="px-2 py-0">
			<div className="row">
				<div className="col-md-2 d-flex justify-content-center align-items-center">
					<a className="btn btn-default btn-file" href={data.avi} target="_blank">
						<img src={data.avi} className="text-center" height="50" width="50" id="avi" />
					</a>
				</div>
				<div className="col-md-10 pl-3 text-left pt-2">
					<Accordion.Toggle as={Button} variant="link" eventKey="0" className="p-0 float-right d-inline">
						<i className="fas fa-chevron-down float-right" />
					</Accordion.Toggle>
					<span className="d-inline">
						<h5 className="d-inline">{formatString(data.name)}</h5>
						<p>Quantity: {data.quantity}</p>
					</span>
				</div>
			</div>
		</Card.Header>
	);

	const Body = () => (
		<Accordion.Collapse eventKey={'0'}>
			<Card.Body className="p-0">
				<ListGroup variant="flush">
					{data.files.map((item, index) => <ListItem key={index} item={item} index={index} />)}
				</ListGroup>
			</Card.Body>
		</Accordion.Collapse>
	);

	const ListItem = ({ item, index }) => (
		<ListGroup.Item
			// key={index}
			className="file-item"
			style={{
				borderBottom: index === data.files.length - 1 ? '1px solid #e8e8e8' : ''
			}}
		>
			<a href={item.path} target="_blank">
				{item.name}
			</a>
		</ListGroup.Item>
	);

	return (
		<div className="w-100">
			<Accordion>
				<Card>
					<Header />
					<Body />
				</Card>
			</Accordion>
		</div>
	);
};

export default Order;

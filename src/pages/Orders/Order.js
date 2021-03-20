import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Accordion, Card, ListGroup, Button, Breadcrumb, Dropdown } from 'react-bootstrap';
import { fieldTypes } from '../../data/InputTypes';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import Wrapper from '../../components/Wrapper/Wrapper';
import SlideCard from '../../components/SlideCard/Card';
import Field from '../../components/SlideCard/Field';
import Empty from '../../components/Placeholders/Empty';
import Loading from '../../components/Placeholders/Loading';
import Toast from '../../components/Toast/Toast';
import Receipt from '../../components/Receipt/Receipt';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Config } from '../../data/Config';

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => new URLSearchParams(useLocation().search);

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Order = () => <Wrapper children={<Body />} current="Pedidos" active="orders" />;

const Body = () => {
	let QUERY = useQuery();
	const ORDER_ID = QUERY.get('id');
	const confirm_message =
		'¿Está seguro de que desea eliminar este pedido? Todos los documentos y la información se borrarán y no se podrán recuperar.';
	const [ FNAME, setFname ] = useState('');
	const [ LNAME, setLname ] = useState('');
	const [ ORDER, setOrder ] = useState(null);
	const [ UPDATING, setUpdating ] = useState(false);
	//State data that control the toast message
	const [ toast, setToast ] = useState(false);
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ message, setMessage ] = useState('Eliminando Orden');
	const [ heading, setHeading ] = useState('Se está eliminando el pedido ...');

	useEffect(
		() => {
			setFname(QUERY.get('fname').replace('%20', ' '));
			setLname(QUERY.get('lname').replace('%20', ' '));
			getOrder();
		},
		[ UPDATING ]
	);

	//Set the state for the toast props
	const setToastProps = (toastImg, toastHeading, toastMessage, log, action) => {
		setImg(toastImg);
		setHeading(toastHeading);
		setMessage(toastMessage);
		console.log(log);
		setTimeout(() => {
			setToast(false);
			setImg('fas fa-spinner fa-pulse');
			setHeading('Se está eliminando el pedido ...');
			setMessage('Eliminando Orden');
			console.log('Toast Props set to normal.');
			if (action) window.location.href = '/orders';
		}, 3000);
	};

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
			if (value === '' && typeof value !== 'boolean') return alert('Ingrese un valor antes de actualizar');
			await Firebase.firestore().collection('orders').doc(ORDER_ID).update(data);
			window.location.reload();
		} catch (error) {
			setUpdating(false);
			console.log("> Firebase: Request couldn't go through");
			console.error(error);
		}
	};

	/* 
		Delete the order from firestore and storage platforms
		1. Get the order id first
		2. Use the order id to delete the reference folder in storage that matches that id
		3. Finally delete the order id from the firestore
		4. Open a new page to /orders
	*/
	const deleteOrder = async () => {
		try {
			const answer = window.confirm(confirm_message);
			if (answer) {
				setToast(true);
				const list = await Firebase.storage().ref(`images/${ORDER_ID}`).list();
				const items = list.items;
				for (let i = 0; i < items.length; i++) {
					const item_path = items[i]['_delegate']['_location']['path_'];
					await Firebase.storage().ref(item_path).delete();
				}
				await Firebase.firestore().collection('orders').doc(ORDER_ID).delete();
				setToastProps(
					'fas fa-check-circle toast-success',
					'Orden Eliminado!',
					`¡El pedido fue eliminado de la nube!`,
					`> Firebase: Order: ${ORDER_ID} and its information are deleted from the system.`,
					true
				);
			}
		} catch (error) {
			console.error("> Firebase: Couldn't process request.");
			console.error(error);
			setToastProps(
				'fas fa-window-close toast-fail',
				'Fallido',
				`¡No se pudo borrar el pedido!`,
				`> Firebase: Error couldnt send request.\n ${error.message}`,
				false
			);
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
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<div className="row">
				<Description
					state={{ fname: FNAME, lname: LNAME }}
					formatString={formatString.bind(this)}
					orderId={QUERY.get('id')}
				/>
				<ShipmentConfirmation
					shipped={ORDER.shippingStatus}
					onClick={updateOrder.bind(this)}
					progress={UPDATING}
				/>
			</div>
			<Paths />
			<Menu onDelete={deleteOrder.bind(this)} />
			<div className="row">
				<SlideCard
					children={
						<Details
							state={ORDER}
							formatString={formatString.bind(this)}
							onUpdate={updateOrder.bind(this)}
						/>
					}
					title="Detalles Del Pedido"
					icon="fas fa-list-alt pr-2"
				/>
				<SlideCard
					children={<Documents state={ORDER} formatString={formatString.bind(this)} />}
					title="Documentos"
					options={
						<a href={`/order/update-items?id=${ORDER_ID}`} className="btn btn-link">
							Agregar / actualizar lista de documentos
						</a>
					}
					icon="fas fa-clipboard-list pr-2"
				/>
				<SlideCard
					children={
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
					}
					title="Recibo"
					icon="fas fa-receipt pr-2"
				/>
			</div>
		</main>
	);
};

const Description = ({ state, formatString, orderId }) => (
	<div id="description" className="col-md-7">
		<h1>Número de orden: {orderId}</h1>
		<p>
			Para El Cliente: <strong>{state !== null ? formatString(`${state.fname} ${state.lname}`) : ''}</strong>
		</p>
		<p>
			A continuación se muestra un análisis en profundidad del pedido de envío que se creó, incluidos los detalles
			sobre su destino, artículos de carga y archivos / documentos pertinentes.
		</p>
		<p>
			Puede actualizar el estado del envío a continuación cuando este pedido y sus artículos estén listos para ser
			enviados al cliente.
		</p>
		<p>Actualice el contenido de este pedido y agregue / elimine cualquier archivo o documento también.</p>
	</div>
);

const ShipmentConfirmation = ({ shipped, onClick, progress }) => {
	const itHasShipped = `Actualmente, este pedido ya ha sido enviado.`;
	const hasNotShipped = `Actualmente, este pedido aún no está marcado para envío.`;
	const subtitle = shipped ? itHasShipped : hasNotShipped;
	const btnText = shipped ? "Cambiar a 'No listo para enviar'" : "Confirmar 'Listo para enviar'";
	const btnColor = shipped ? 'text-danger' : 'text-success';
	return (
		<div id="shipment-confirmation" className="col-md-5 d-flex justify-content-center align-items-end">
			<Card>
				<Card.Body>
					<Card.Title>
						<i className="fas fa-dolly pr-3" />Estado del Envío
					</Card.Title>
					<Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
					<Card.Text>Confirma que este pedido está listo para enviarse o revierte su estado.</Card.Text>
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

const Menu = ({ onDelete }) => (
	<Dropdown className="text-right mt-1">
		<Dropdown.Toggle id="dropdown-basic">
			<i className="fas fa-cog" />
		</Dropdown.Toggle>
		<Dropdown.Menu>
			<Dropdown.Item href="#/action-2">
				<i className="fas fa-download pr-2" />
				Descargar historial de pedidos
			</Dropdown.Item>
			<Dropdown.Item as={Button} onClick={onDelete}>
				<i className="fas fa-trash-alt pr-2" />
				Eliminar Pedido
			</Dropdown.Item>
		</Dropdown.Menu>
	</Dropdown>
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
						<p>Cantidad: {data.quantity}</p>
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

const Paths = () => (
	<Breadcrumb className="py-2">
		<Breadcrumb.Item href="/orders">Volver Al Origen</Breadcrumb.Item>
		<Breadcrumb.Item active>Pedido</Breadcrumb.Item>
	</Breadcrumb>
);

export default Order;

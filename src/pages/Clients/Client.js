import React, { useEffect, useState } from 'react';
import { Dropdown, Button, Breadcrumb } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ClientTypes } from '../../data/InputTypes';
import { Config } from '../../data/Config';
import Slidecard from '../../components/SlideCard/Card';
import Wrapper from '../../components/Wrapper/Wrapper';
import File from '../../components/Files/File';
import Field from '../../components/SlideCard/Field';
import Empty from '../../components/Placeholders/Empty';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import Toast from '../../components/Toast/Toast';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Client = () => <Wrapper children={<Body />} current="Clientes" active="clients" />;

const Body = () => {
	let { id } = useParams();
	//State data that control the toast message
	const [ toast, setToast ] = useState(false);
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ message, setMessage ] = useState('Eliminando Cliente y sus pedidos ...');
	const [ heading, setHeading ] = useState('Eliminar Cliente');
	//State data that controls client and order info
	const [ client, setClient ] = useState(null);
	const [ orders, setOrders ] = useState([]);
	const [ empty, setEmpty ] = useState(false);

	useEffect(() => {
		console.log(id);
		getClient();
		getOrders();
	}, []);

	//Set the state for the toast props
	const setToastProps = (toastImg, toastHeading, toastMessage, log, action) => {
		setImg(toastImg);
		setHeading(toastHeading);
		setMessage(toastMessage);
		console.log(log);
		setTimeout(() => {
			setToast(false);
			setImg('fas fa-spinner fa-pulse');
			setHeading('Eliminando Cliente y sus pedidos ...');
			setMessage('Eliminar cliente');
			console.log('Toast Props set to normal.');
			if (action) window.location.href = document.referrer;
		}, 3000);
	};

	//Get info of the selected client from the firestore
	const getClient = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('clients').where('id', '==', id).get();
			if (snapshot.empty)
				return alert(
					'No hay ningún usuario que coincida con este ID de cliente. Por favor, regrese y vuelva a intentarlo.'
				);
			let client = [];
			snapshot.forEach((doc) => client.push(doc.data()));
			setClient(client[0]);
		} catch (error) {
			console.error(`> Firebase: Couldn\'t get user information`);
			console.error(error);
		}
	};

	//Get all orders relevant to the client's id
	const getOrders = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('orders').where('clientId', '==', id).get();
			if (snapshot.empty) return setEmpty(true);
			let orders = [];
			snapshot.forEach((doc) => orders.push(doc.data()));
			setOrders(orders);
		} catch (error) {
			console.error(`> Firebase: Couldn\'t get orders.`);
			console.error(error);
		}
	};

	//Update order to the firestore and refresh the page afterwards
	const updateClient = async (e, data) => {
		e.preventDefault();
		try {
			// setUpdating(true);
			const value = Object.values(data)[0].toLowerCase();
			if (value === '' && typeof value !== 'boolean') return alert('Ingrese un valor antes de actualizar');
			await Firebase.firestore().collection('clients').doc(id).update(data);
			window.location.reload();
		} catch (error) {
			// setUpdating(false);
			console.log("> Firebase: Request couldn't go through");
			console.error(error);
		}
	};

	//Delete the client from the firestore
	//1. Delete all files associated with the order id in the 'storage' collection.
	//2. Delete all orders associated with the client first in the 'Orders' collection.
	//3. Delete the client document in the 'Clients' collection.
	const deleteClient = async (e) => {
		e.preventDefault();
		try {
			const answer = window.confirm(
				`¿Está seguro de que desea eliminar este cliente? Todos los pedidos, la información y los archivos asociados con esta cuenta se borrarán y no se podrán recuperar.`
			);
			if (answer) {
				setToast(true);
				for (let i = 0; i < orders.length; i++) {
					const orderId = orders[i].orderId;
					const list = await Firebase.storage().ref(`images/${orderId}`).list();
					const items = list.items;
					for (let j = 0; j < list.items.length; j++) {
						const item_path = items[j]['_delegate']['_location']['path_'];
						await Firebase.storage().ref(item_path).delete();
					}
					await Firebase.firestore().collection('orders').doc(orderId).delete();
				}
				await Firebase.firestore().collection('clients').doc(id).delete();
				setToastProps(
					'fas fa-check-circle toast-success',
					'Cliente Eliminado!',
					`¡El cliente fue eliminado de la nube!`,
					`> Firebase: Client: ${id} and all his/her orders are deleted from the system.`,
					true
				);
			}
		} catch (error) {
			console.error(`> Firebase: Couldn\'t delete the user from Firebase`);
			console.error(error);
			setToastProps(
				'fas fa-window-close toast-fail',
				'Fallido',
				`¡No se pudo eliminar el cliente!`,
				`> Firebase: Error couldnt send request.\n ${error.message}`,
				false
			);
		}
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const parsedStr = str.replaceAll('%20', ' ');
		console.log(`${str} => ${parsedStr}`);
		const words = parsedStr.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	if (client === null) return <LoadingPage />;
	return (
		<main className="container-fluid pt-3">
			<Paths />
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				sssss
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<div className="row">
				<div className="col-md-12 w-100 client-pane">
					<Description state={client} formatString={formatString.bind(this)} />
					<ButtonsPane onDelete={deleteClient.bind(this)} />
				</div>
			</div>
			<hr />
			<section className="row">
				<Slidecard
					children={
						<Fields
							state={client}
							formatString={formatString.bind(this)}
							onUpdate={updateClient.bind(this)}
						/>
					}
					title="Información Del Cliente"
					icon="fas fa-user-circle pr-2"
				/>
				<Slidecard
					children={!empty ? <Orders state={orders} names={client} /> : <EmptyBox />}
					title="Pedidos Recientes"
					icon="fas fa-list-alt pr-2"
				/>
			</section>
		</main>
	);
};

const Menu = ({ onDelete }) => (
	<Dropdown className="float-sm-right">
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
				Eliminar cliente
			</Dropdown.Item>
		</Dropdown.Menu>
	</Dropdown>
);

const Description = ({ state, formatString }) => (
	<div id="description">
		<h1>Cliente: {state !== null ? formatString(`${state.fname} ${state.lname}`) : ''}</h1>
		<p>Cliente desde: {state !== null ? state.clientSince : 'Not Available'}</p>
		<p style={{ width: '50%' }}>
			Vea información sobre la cuenta de su cliente, descargue un archivo de su historial de pedidos o realice
			cambios en su información con las opciones proporcionadas.
		</p>
	</div>
);

const ButtonsPane = ({ onDelete }) => <Menu onDelete={onDelete} />;

const Fields = ({ state, formatString, onUpdate }) => {
	if (state !== null) {
		const types = ClientTypes(state);
		return (
			<div className="col-md">
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
			</div>
		);
	}
	return <Empty />;
};

const Orders = ({ state, names }) => {
	const sortOrdersByDate = (orders) => {
		const filteredDates = orders.sort((a, b) => {
			a = a.date.split('/');
			b = b.date.split('/');
			return b[2] - a[2] || b[0] - a[0] || b[1] - a[1];
		});
		return filteredDates;
	};
	if (state !== null && names !== null) {
		names.fname = names.fname.replace(' ', '%20');
		names.lname = names.lname.replace(' ', '%20');
		const sortedOrders = sortOrdersByDate(state);
		return (
			<div className="col-md-12">
				<ol
					className="list-group list-group-flush order-lists"
					id="clients"
					style={{ backgroundColor: '#FDFFFC' }}
				>
					{Object.keys(sortedOrders).map((item, index) => {
						const order = state[item];
						const items = order.items.map((item) => item.name).join(', ');
						return <File key={index} id={order.orderId} date={order.date} items={items} names={names} />;
					})}
				</ol>
			</div>
		);
	}

	return <Empty />;
};

const EmptyBox = () => (
	<div className="col-md-12">
		<div className="text-center justify-content-center align-items-center d-flex flex-column">
			<i
				className="fab fa-creative-commons-zero p-5"
				style={{ fontSize: 100, color: '#ee4266', backgroundColor: '#2a1e5c', borderRadius: 20 }}
			/>
			<p className="pt-5">Este cliente no ha hecho ningún pedido todavía.</p>
		</div>
	</div>
);

const Paths = () => (
	<Breadcrumb>
		<Breadcrumb.Item href="/clients">Volver al origen</Breadcrumb.Item>
		<Breadcrumb.Item active>Cliente</Breadcrumb.Item>
	</Breadcrumb>
);

export default Client;

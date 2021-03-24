import React, { useState } from 'react';
import { useLocation, Redirect, useHistory } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import { Config } from '../../data/Config';
import Wrapper from '../../components/Wrapper/Wrapper';
import Receipt from '../../components/Receipt/Receipt';
import ConfirmDiv from '../../components/BackButton/Confirm';
import Toast from '../../components/Toast/Toast';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Submit = () => <Wrapper children={<Body />} current="New Order" active="new" />;

const Body = () => {
	//State data that control the toast message
	const [ toast, setToast ] = useState(false);
	const [ img, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ message, setMessage ] = useState('Añadiendo orden ...');
	const [ heading, setHeading ] = useState('Procesando');
	const location = useLocation();
	const history = useHistory();

	//Set the state for the toast props
	const setToastProps = (toastImg, toastHeading, toastMessage, log, action) => {
		setImg(toastImg);
		setHeading(toastHeading);
		setMessage(toastMessage);
		console.log(log);
		setTimeout(() => {
			setToast(false);
			if (action) window.location.href = '/new-order';
		}, 3000);
	};

	//Upload the files and form data to firebase
	const onConfirm = (e) => {
		e.preventDefault();
		if (img !== 'fas fa-spinner fa-pulse') setImg('fas fa-spinner fa-pulse');
		setToast(true);
		try {
			const data = location.state;
			uploadAllFiles(data.items, data.form, (urls) => {
				setHeading('¡Archivos cargados! Añadiendo orden a la nube ...');
				setMessage('Todos los archivos cargados en la nube.');
				urls.forEach(
					(item) => (data.form['item-images'] = { ...data.form['item-images'], [item.name]: item.url })
				);
				//Don't need the clientname for the firestore update
				delete data.form.clientName;
				console.log(data);
				Firebase.firestore().collection('orders').doc(data.form.orderId).set(data.form).then(() => {
					setToastProps(
						'fas fa-check-circle toast-success',
						'Pedido agregado!',
						`¡El pedido se agregó a la nube!`,
						'> Firebase: order data added',
						true
					);
				});
			});
		} catch (error) {
			setToastProps(
				'fas fa-window-close toast-fail',
				'Fallido',
				`¡No se pudo agregar el pedido!`,
				`> Firebase: Error couldnt send request.\n ${error.message}`,
				false
			);
		}
	};

	//Returns a promise with the downloaded url of the image uploaded to the cloud storage
	const uploadFile = (doc, orderId) => {
		return new Promise((resolve) => {
			// const item = { name: doc.name, file: doc.ref.current.files[0] };
			const formatedDocName = doc.name.replace('.', '_');
			const path = `images/${orderId}/${formatedDocName}`;
			Firebase.storage().ref(path).put(doc.file).then((snapshot) => {
				snapshot.ref.getDownloadURL().then((url) => {
					console.log({ name: formatedDocName, url: url });
					resolve({ name: formatedDocName, url: url });
				});
			});
		});
	};

	/* Return the downloaded urls to the callback once all files are uploaded */
	const uploadAllFiles = async (docs, data, callback) => {
		let urls = [];
		let items = Object.keys(docs);
		const orderId = data.orderId;
		do {
			const key = items.pop();
			const item = docs[key];
			let documents = [];
			let avi = { name: `${key}-avi`, file: item.avi };
			let allFiles = item.files.map((file) => ({ name: `${key}-${file.name}`, file: file }));
			documents.push(...allFiles);
			typeof item.avi === 'object' ? documents.push(avi) : urls.push({ name: avi.name, url: avi.file });
			for (let i = 0; i < documents.length; i++) {
				const file = documents[i]; //<- { ...file-data }
				const url = await uploadFile({ name: file.name, file: file.file }, orderId);
				urls.push(url);
				console.log('> Firebase: File uploaded!');
				setMessage('Subiendo archivos a la nube.');
			}
		} while (items.length !== 0);
		callback(urls);
	};

	return (
		<main className="container p-3">
			{location.state !== undefined ? '' : <Redirect to="error" />}
			<Paths
				message="¿Estás seguro de que quieres volver? Todos sus elementos y archivos se eliminarán y no se podrán recuperar."
				historyHook={history}
			/>
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<h1>Confirmar pedido</h1>
			<div className="row mb-3">
				<div className="col-lg">
					<p>
						Revise todos los artículos y los datos del formulario agregados a este pedido de envío antes de
						agregarlo al sistema. Tenga en cuenta que puede actualizar o eliminar esta información más
						tarde.
					</p>
				</div>
				<div className="col-lg">
					<ConfirmDiv onConfirm={(e) => onConfirm(e)} />
				</div>
			</div>

			<Receipt form={location.state.form} files={location.state.items} />
		</main>
	);
};

const Paths = ({ historyHook, message }) => {
	const onClick = (e, path) => {
		e.preventDefault();
		if (window.confirm(message)) window.location.href = path;
	};
	return (
		<Breadcrumb>
			<Breadcrumb.Item href="/new-orders" onClick={(e) => onClick(e, '/new-order/')}>
				Home
			</Breadcrumb.Item>
			<Breadcrumb.Item href="/new-orders" onClick={(e) => onClick(e, '/new-order/add-order')}>
				Orden
			</Breadcrumb.Item>
			<Breadcrumb.Item
				href="/new-orders/add-order/add-items"
				onClick={(e) => {
					e.preventDefault();
					historyHook.goBack();
				}}
			>
				Artículos
			</Breadcrumb.Item>
			<Breadcrumb.Item active>Enviar</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default Submit;

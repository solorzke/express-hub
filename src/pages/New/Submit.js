import React, { useState } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
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
	const [ message, setMessage ] = useState('Adding Order...');
	const [ heading, setHeading ] = useState('Processing');
	const location = useLocation();

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
				setHeading('Files uploaded! Adding order to the cloud...');
				setMessage('All files uploaded to the cloud.');
				urls.forEach(
					(item) => (data.form['item-images'] = { ...data.form['item-images'], [item.name]: item.url })
				);
				//Don't need the clientname for the firestore update
				delete data.form.clientName;
				console.log(data);
				Firebase.firestore().collection('orders').doc(data.form.orderId).set(data.form).then(() => {
					setToastProps(
						'fas fa-check-circle toast-success',
						'Order Added!',
						`${message}\n The order was added to the cloud!`,
						'> Firebase: order data added',
						true
					);
				});
			});
		} catch (error) {
			setToastProps(
				'fas fa-window-close toast-fail',
				'Failed',
				`Order couldn't be added!`,
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
				setMessage('File uploaded to the cloud.');
			}
		} while (items.length !== 0);
		callback(urls);
	};

	return (
		<main className="container p-3">
			{location.state !== undefined ? '' : <Redirect to="error" />}
			<Toast
				onClose={() => setToast(false)}
				show={toast}
				message={message}
				heading={heading}
				img={<i className={`${img} p-3`} />}
			/>
			<h1>Confirm Order</h1>
			<p className="mb-2 w-50">
				Review all the items and form data added to this shipment order before adding it to the system. Keep in
				mind, you can update or delete this information later.
			</p>
			<ConfirmDiv onConfirm={(e) => onConfirm(e)} />
			<Receipt form={location.state.form} files={location.state.items} />
		</main>
	);
};

export default Submit;

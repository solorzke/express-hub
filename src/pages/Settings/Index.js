import React, { useEffect, useState } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import Field from '../../components/SlideCard/Field';
import Empty from '../../components/Placeholders/Empty';
import LoadingPage from '../../components/Placeholders/LoadingPage';
import Toast from '../../components/Toast/Toast';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Config } from '../../data/Config';
import { Cookie } from '../../data/Cookie';
import { fieldTypes } from '../../data/UserInputTypes';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Index = () => <Wrapper children={<Body />} current="Ajustes" active="settings" />;

const Body = () => {
	//State
	const [ USER, setUser ] = useState(null);
	//State data that control the toast message
	const [ TOAST, setToast ] = useState(false);
	const [ IMG, setImg ] = useState('fas fa-spinner fa-pulse');
	const [ MESSAGE, setMessage ] = useState('Actualizando la información del usuario...');
	const [ HEADING, setHeading ] = useState('Procesando');

	useEffect(() => {
		getUserInformation();
	}, []);

	//Set the state for the toast props
	const setToastProps = (toastImg, toastHeading, toastMessage, log, action) => {
		setImg(toastImg);
		setHeading(toastHeading);
		setMessage(toastMessage);
		console.log(log);
		setTimeout(() => {
			setToast(false);
			if (action) window.location.href = '/settings';
		}, 2500);
	};

	const getUserInformation = async () => {
		try {
			const snapshot = await Firebase.firestore().collection('users').doc(Cookie.getCookie('uid')).get();
			const user = snapshot.data();
			setUser(user);
		} catch (error) {
			console.error("> Firebase: Couldn't send request.");
			console.error(error);
		}
	};

	const onUpdate = async (e, data) => {
		e.preventDefault();
		setToast(true);
		try {
			const value = Object.values(data)[0].toLowerCase();
			const key = Object.keys(data)[0];
			if (value === '') return alert('Ingrese un valor antes de actualizar');
			data[key] = data[key].toLowerCase();
			switch (key) {
				case 'email':
					const confirmedUser = await Firebase.auth().signInWithEmailAndPassword(
						data['old-email'],
						data['password']
					);
					await confirmedUser.user.updateEmail(data['email']);
					await Firebase.firestore()
						.collection('users')
						.doc(Cookie.getCookie('uid'))
						.update({ email: data['email'] });
					break;
				case 'countersign':
					const confirmedPasswordUser = await Firebase.auth().signInWithEmailAndPassword(
						USER.email,
						data['old-password']
					);
					await confirmedPasswordUser.user.updatePassword(data['countersign']);
					break;
				case 'fname':
					Cookie.setCookie('fname', value);
					await Firebase.firestore().collection('users').doc(Cookie.getCookie('uid')).update(data);
					break;
				default:
					await Firebase.firestore().collection('user').doc(Cookie.getCookie('uid')).update(data);
					break;
			}
			setToastProps(
				'fas fa-check-circle toast-success',
				'Actualizacion completa',
				'La información del usuario se actualizó correctamente.',
				'> Firebase: data updated',
				true
			);
		} catch (error) {
			console.error(error);
			setToastProps(
				'fas fa-window-close toast-fail',
				'Fallido',
				`¡No se pudo agregar la información de actualización!`,
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

	if (USER !== null) {
		return (
			<main className="container-fluid pt-3">
				<div className="row">
					<Toast
						onClose={() => setToast(false)}
						show={TOAST}
						message={MESSAGE}
						heading={HEADING}
						img={<i className={`${IMG} p-3`} />}
					/>
					<Description />
					<Details state={USER} formatString={formatString.bind(this)} onUpdate={onUpdate.bind(this)} />
				</div>
			</main>
		);
	} else {
		return <LoadingPage />;
	}
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
	} else return <Empty />;
};

const Description = () => (
	<div id="description" className="px-5">
		<h1>Perfil Del Usuario</h1>
		<p>Actualice su información de usuario a continuación y guarde sus cambios.</p>
	</div>
);

export default Index;

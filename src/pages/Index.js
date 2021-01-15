import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Config } from '../data/Config';
import { Button } from 'react-bootstrap';
import { Cookie } from '../data/Cookie';
import '../css/login.css';

const Index = () => {
	const [ progress, setProgress ] = useState(false);
	const history = useHistory();

	useEffect(() => {
		//Initialize Firebase app if it hasn't already
		firebase.apps.length === 0 ? firebase.initializeApp(Config) : firebase.app();
	});

	const authenticate = async () => {
		setProgress(true);
		let email = document.getElementById('email').value;
		let password = document.getElementById('password').value;
		try {
			const user = await firebase.auth().signInWithEmailAndPassword(email, password);
			const store = await firebase.firestore().collection('users').doc(user.user.uid).get();
			Cookie.setCookie('fname', store.data().fname);
			Cookie.setCookie('uid', user.user.uid);
			setProgress(false);
			history.push('/home');
		} catch (error) {
			setProgress(false);
			alert(error.message);
		}
	};

	return (
		<div className="login login-body">
			<main className="login-login-container">
				<div className="container">
					<div className="row">
						<div className="col">
							<i className="fas fa-dolly login-logo" />
							<h2 className="pt-5">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
							</h2>
						</div>
						<div className="col d-flex justify-content-center align-content-center flex-column">
							<h1 className="text-center">Mtech Express</h1>
							<form>
								<input
									type="email"
									id="email"
									name="email"
									placeholder="Enter your email address"
									required
								/>
								<br />
								<input
									type="password"
									id="password"
									name="password"
									placeholder="Enter your password"
									required
								/>
								<br />
								{progress && <i className="fas fa-spinner fa-pulse py-3" />}
								<Button onClick={() => authenticate()} className="login-login-btn">
									Sign In
								</Button>
							</form>
							<p className="p-3 text-center">
								Forgot Password? <a href="index.php?action=recover">Recover it now!</a>
							</p>
						</div>
					</div>
				</div>
			</main>
			<footer>
				<p id="footer" className="text-center" />
			</footer>
		</div>
	);
};

export default Index;

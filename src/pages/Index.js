import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Config } from '../data/Config';
import { Button } from 'react-bootstrap';
import { Cookie } from '../data/Cookie';
import '../css/login.css';

const Index = () => {
	const [ progress, setProgress ] = useState(false);
	const [ area, setArea ] = useState('login');

	useEffect(() => {
		//Initialize Firebase app if it hasn't already
		firebase.apps.length === 0 ? firebase.initializeApp(Config) : firebase.app();
	});

	const authenticate = async (e) => {
		e.preventDefault();
		setProgress(true);
		let email = document.getElementById('email').value;
		let password = document.getElementById('password').value;
		try {
			const user = await firebase.auth().signInWithEmailAndPassword(email, password);
			const store = await firebase.firestore().collection('users').doc(user.user.uid).get();
			Cookie.setCookie('fname', store.data().fname);
			Cookie.setCookie('uid', user.user.uid);
			setProgress(false);
			window.location.href = '/new-order';
		} catch (error) {
			setProgress(false);
			alert(error.message);
		}
	};

	const onPasswordReset = (setFinish) => {
		const email = document.getElementById('email-for-request').value;
		//Send password reset request here
		firebase
			.auth()
			.sendPasswordResetEmail(email)
			.then(() => {
				console.log('> Firebase: Password reset request sent to the email associated with the account');
				setFinish(true);
			})
			.catch((error) => {
				console.error("> Firebase: Password reset request couldn't be sent.");
				setFinish(false);
				alert('Password request failed. Check your email address and type it again.');
			});
	};

	return (
		<div className="login login-body">
			<main className="login-login-container">
				<div className="container">
					<div className="row">
						<div className="col">
							<i className="fas fa-dolly login-logo" />
							<h2 className="pt-5">Come to Mtech Express Shipping, &amp; Let's Get It Done!</h2>
							<p className="pt-5">A Different Kind Of Company. A Different Kind Of Express Shipping.</p>
						</div>
						<div className="col d-flex justify-content-center align-content-end flex-column">
							{area === 'login' && (
								<LoginBox
									authenticate={authenticate.bind(this)}
									progress={progress}
									onClick={setArea}
								/>
							)}
							{area === 'forgot-pw' && (
								<ForgotPasswordBox onPasswordReset={onPasswordReset.bind(this)} onClick={setArea} />
							)}
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

const LoginBox = ({ authenticate, progress, onClick }) => (
	<React.Fragment>
		<h1 className="text-center">Mtech Express</h1>
		<form onSubmit={authenticate}>
			<input type="email" id="email" name="email" placeholder="Enter your email address" required />
			<br />
			<input type="password" id="password" name="password" placeholder="Enter your password" required />
			<br />
			{progress && <i className="fas fa-spinner fa-pulse py-3" />}
			<input type="submit" value="Sign In" className="login-login-btn btn btn-light" />
		</form>
		<p className="p-3 text-center">
			Forgot Password?
			<button className="btn btn-link p-0 mx-2 my-0 confirm-login-btn" onClick={() => onClick('forgot-pw')}>
				Recover it now!
			</button>
		</p>
	</React.Fragment>
);

const ForgotPasswordBox = ({ onPasswordReset, onClick }) => {
	const [ FINISHED, setFinish ] = useState(false);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		onPasswordReset(setFinish);
	};

	return (
		<div className="animate__animated animate__fadeInRight text-center">
			<h1 className="text-center">Reset Password</h1>
			{!FINISHED && <PasswordForm onSubmit={handleFormSubmit.bind(this)} onClick={onClick} />}
			{FINISHED && (
				<h2 className="animate__animated animate__fadeIn text-center">
					Password reset request was sent to your email address.
				</h2>
			)}
			{FINISHED && (
				<button onClick={() => onClick('login')} className="btn btn-link p-0 mx-2 my-0 confirm-login-btn">
					Go Back to Login
				</button>
			)}
		</div>
	);
};

const PasswordForm = (props) => (
	<React.Fragment>
		<form onSubmit={props.onSubmit}>
			<input
				name="email-for-request"
				id="email-for-request"
				placeholder="Enter your email address"
				type="email"
				required
			/>
			<input type="submit" value="Recover Password" className="login-login-btn btn btn-light" />
		</form>
		<p className="p-3 text-center">
			Remember Password?
			<button className="btn btn-link p-0 mx-2 my-0 confirm-login-btn" onClick={() => props.onClick('login')}>
				Login In
			</button>
		</p>
	</React.Fragment>
);

export default Index;

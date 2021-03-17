import React, { useEffect, useState, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '../teloentrego.png';
import Firebase from 'firebase/app';
import Loading from '../components/Placeholders/Loading';
import 'firebase/auth';
import { Config } from '../data/Config';
import '../css/login.css';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

// the query string for you.
const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPassword = () => {
	let QUERY = useQuery();
	const [ oobCode, setOobCode ] = useState(null);
	const [ mode, setMode ] = useState(null);
	const [ process, setProcess ] = useState('start');
	const [ heading, setHeading ] = useState('Reset Password');

	useEffect(() => {
		const query_mode = QUERY.get('mode');
		const query_oobCode = QUERY.get('oobCode');
		if (query_mode === null || query_oobCode === null) window.location.href = '/';
		setOobCode(query_oobCode);
		setMode(query_mode);
	}, []);

	const onSubmit = async (e, input_email, new_pw) => {
		e.preventDefault();
		try {
			setProcess('loading');
			setHeading('Please Wait...');
			const user_email = await Firebase.auth().verifyPasswordResetCode(oobCode);
			if (user_email !== input_email) {
				alert("Email Address doesn't match with the code it was sent from. Try again");
				setProcess('start');
				return;
			}
			await Firebase.auth().confirmPasswordReset(oobCode, new_pw);
			console.log('> Firebase: Password Reset Successful');
			setProcess('finished');
			setHeading('Complete');
		} catch (error) {
			console.error("> Firebase: Couldn't verify the reset process of the password with firebase");
			console.error(error);
			alert('The reset request code has expired / not been found');
			setProcess('start');
		} finally {
			setHeading('Reset Password');
		}
	};

	return (
		<div className="login login-body">
			<main className="login-login-container container">
				<div className="row">
					<div className="col">
						<img src={Logo} height="400" width="550" />
						<h2 className="pt-5 text-center jo-font">
							Shipping &amp; Packaging At Its Finest! Across the USA &amp; South America
						</h2>
						<p className="pt-5 text-center jo-font">
							A Different Kind Of Company. A Different Kind Of Express Shipping.
						</p>
					</div>
					<div className="col d-flex justify-content-center align-content-center flex-column">
						<h1 className="text-center">{heading}</h1>
						{process === 'start' && <ResetPasswordBox onSubmit={onSubmit.bind(this)} />}
						{process === 'loading' && <LoadingBox />}
						{process === 'finished' && <ConfirmationBox />}
					</div>
				</div>
			</main>
		</div>
	);
};

const ResetPasswordBox = ({ onSubmit }) => (
	<Fragment>
		<form
			onSubmit={(e) => {
				const email = document.getElementById('email').value;
				const new_pw = document.getElementById('new-pw').value;
				onSubmit(e, email, new_pw);
			}}
		>
			<input name="email" id="email" placeholder="Email Address" type="email" required />
			<input name="new-pw" id="new-pw" placeholder="New Password" type="password" required />
			<input type="submit" name="submit" value="Reset Password" className="login-login-btn" />
		</form>
		<p className="p-3 text-center">
			Remember Password?
			<a className="btn btn-link p-0 mx-2 my-0 confirm-login-btn" href="/">
				Login In
			</a>
		</p>
	</Fragment>
);

const ConfirmationBox = () => (
	<div className="animate__animated animate__fadeInUpBig text-center">
		<i className="fas fa-clipboard-check py-5" style={{ fontSize: 100, color: '#ee4266' }} />
		<p className="pt-5">
			Your password has been reset.
			<a className="btn btn-link p-0 mx-2 my-0 confirm-login-btn" href="/">
				You can now go back &amp; log in.
			</a>
		</p>
	</div>
);

const LoadingBox = () => (
	<div style={{ fontSize: 80 }} className="text-center py-5 animate__animated animate__fadeIn">
		<Loading />
		<p style={{ fontSize: 16, color: '#ee4266' }} className="pt-5">
			Your request is being processed...
		</p>
	</div>
);

export default ResetPassword;

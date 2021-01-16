import React from 'react';
import Wrapper from '../components/Wrapper/Wrapper';
import { Cookie } from '../data/Cookie';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from '../data/Config';
import '../css/index.css';
//Initialize Firebase app if it hasn't already
Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Home = () => {
	return <Wrapper children={<Body />} current="Home" />;
};

const Body = () => {
	const fname = Cookie.getCookie('fname').charAt(0).toUpperCase() + Cookie.getCookie('fname').slice(1);
	return (
		<div className="container-fluid">
			<h1 className="mt-4">Hello {fname}</h1>
			<p>
				The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed
				on larger screens. When toggled using the button below, the menu will change.
			</p>
			<p>
				Make sure to keep all page content within the <code>#page-content-wrapper</code>. The top navbar is
				optional, and just for demonstration. Just create an element with the <code>#menu-toggle</code> ID which
				will toggle the menu when clicked.
			</p>
		</div>
	);
};

export default Home;

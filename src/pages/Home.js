import React from 'react';
import Wrapper from '../components/Wrapper/Wrapper';
import { Cookie } from '../data/Cookie';

const Home = () => {
	return <Wrapper children={<Body />} current="Home" />;
};

const Body = () => {
	return (
		<div className="container-fluid">
			<h1 className="mt-4">Hello {Cookie.getCookie('uid')}</h1>
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

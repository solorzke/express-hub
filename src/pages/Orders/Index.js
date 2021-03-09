import React from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';

const Index = () => <Wrapper children={<Body />} active="orders" current="Orders" />;

const Body = () => {
	return (
		<main className="container-fluid">
			<h1>hgello</h1>
		</main>
	);
};

export default Index;

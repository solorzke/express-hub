import React from 'react';
import Loading from './Loading';

const LoadingPage = () => (
	<main
		className="container-fluid pt-3 justify-content-center align-items-center d-flex flex-column"
		style={{ fontSize: 100, height: '50%', color: '#2a1e5c' }}
	>
		<Loading />
		<h2 className="p-5" style={{ fontSize: 32 }}>
			Please Wait...
		</h2>
	</main>
);

export default LoadingPage;

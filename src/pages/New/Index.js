import React from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import '../../css/index.css';

const Index = () => <Wrapper children={<Body />} current="New Order" active="new" />;

const Body = () => {
	return (
		<main className="landing-page d-flex justify-content-center align-items-center index">
			<div className="container-fluid py-5">
				<h1 className="text-center">Select An Option</h1>
				<div className="row">
					<div className="col text-center index-add-client-view mx-1">
						<a href="/new-order/add-client">
							<i className="fas fa-user-circle index-new-user-logo pb-1" />
							<h2>New Client</h2>
							<p>
								Add a new client and their shipment order, including information such as their name and
								their shipping details to be logged into the datbase.
							</p>
						</a>
					</div>
					<div className="col text-center index-add-order-view mx-1">
						<a href="/new-order/add-order">
							<i className="fas fa-dolly-flatbed index-new-user-logo pb-1" />
							<h2>New Order</h2>
							<p>
								Create a new order for an existing client in the database and add their shipping
								information.
							</p>
						</a>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Index;

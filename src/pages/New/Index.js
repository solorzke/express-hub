import React from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import { Card } from 'react-bootstrap';
import '../../css/index.css';

const Index = () => <Wrapper children={<Body />} current="New Order" active="new" />;

const Body = () => {
	return (
		<main className="landing-page d-flex justify-content-center align-items-center index">
			<div className="container-fluid pt-2">
				<h1 className="jo-font">Select An Option</h1>
				<p>Add new client or order</p>
				<CardBox
					header="Client"
					title="New Client"
					text="Add a new client and their shipment order, including information such as their name and
								their shipping details to be logged into the database."
					path="/new-order/add-client"
					image="fas fa-user-circle"
				/>
				<CardBox
					header="Order"
					title="New Order"
					text="Create a new order for an existing client in the database and add their shipping
					information."
					path="/new-order/add-order"
					image="fas fa-dolly-flatbed"
				/>
			</div>
		</main>
	);
};

const CardBox = ({ header, title, text, path, image }) => (
	<a href={path}>
		<Card className="index-add-client-view mt-4">
			<Card.Header>{header}</Card.Header>
			<Card.Body>
				<div className="row">
					<div className="col-md-3 text-center ">
						<i className={`${image} index-new-user-logo pb-1`} />
					</div>
					<div className="col-md-9">
						<Card.Title>{title}</Card.Title>
						<Card.Text>{text}</Card.Text>
					</div>
				</div>
			</Card.Body>
		</Card>
	</a>
);

export default Index;

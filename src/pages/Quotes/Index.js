import React from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import { Card } from 'react-bootstrap';

const Index = () => <Wrapper children={<Body />} active="quotes" current="Quotes" />;

const Body = () => {
	return (
		<main className="container-fluid mt-3 index landing-page">
			<div className="row pb-3">
				<Description />
				<CardBox
					header="Add Quote"
					title="Create a new Quote"
					text="Get started with creating your quotes for your clients right away here including its quoted price and cost."
					path="/quotes/add"
					image="fas fa-plus-square"
				/>
			</div>
			<hr />
		</main>
	);
};

const Description = () => (
	<div id="description" className="col">
		<h1>Quotes</h1>
		<p>
			Welcome to the Quotes page. Here you can add new quotes to set reminders about which items an exisiting
			client has requested for shipping.
		</p>
		<p>
			You'll be able to view these quotes here as well and make appropriate changes to them and remove them when
			you're done using them.
		</p>
	</div>
);

const CardBox = ({ header, title, text, path, image }) => (
	<div className="col">
		<a href={path}>
			<Card className="index-add-client-view mt-4">
				<Card.Header>{header}</Card.Header>
				<Card.Body>
					<div className="row">
						<div className="col-md-3 text-center ">
							<i className={`${image} quote-logo pb-1`} />
						</div>
						<div className="col-md-9">
							<Card.Title>{title}</Card.Title>
							<Card.Text>{text}</Card.Text>
						</div>
					</div>
				</Card.Body>
			</Card>
		</a>
	</div>
);

export default Index;

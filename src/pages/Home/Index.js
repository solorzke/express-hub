import React from 'react';
import Nav from '../../components/Nav/Navbar';
import Banner from '../../components/Banner/Banner';
import Footer from '../../components/Footer/Footer';
import Box from '../../media/4.png';
import A1 from '../../media/5.png';
import A2 from '../../media/6.png';
import A3 from '../../media/7.png';
import { Jumbotron, ListGroup, CardGroup, Card } from 'react-bootstrap';
import Button from '../../components/Button/Button';
import { Fragment } from 'react';

const Home = () => {
	return (
		<Fragment>
			<Nav />
			<main style={{ backgroundColor: '#2A1E5C' }}>
				<Banner height="100vh" />
				<Article />
				<FirstFeature />
				<SecondFeature />
				<ThirdFeature />
				<Posts />
				<ContactUs />
				<Footer />
			</main>
		</Fragment>
	);
};

const Article = () => (
	<article className="row">
		<div className="article col-lg">
			<Jumbotron>
				<div className="row">
					<div className="col-lg">
						<i className="fas fa-id-card" style={{ fontSize: 25 }} />
						<br />
						<h6>Quality Express Shipping</h6>
						<h1>Who Are We?</h1>
						<hr />
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
							labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
							laboris nisi ut aliquip ex ea commodo consequat.
						</p>
						<p>
							<Button label="Learn more about us" />
						</p>
					</div>
					<div className="col-lg">
						<ListGroup variant="flush">
							<a href="#">
								<ListGroup.Item>
									<i className="fas fa-file-alt list-item" /> Cras justo odio
								</ListGroup.Item>
							</a>
							<a href="#">
								<ListGroup.Item>
									<i className="fas fa-file-alt list-item" /> Cras justo odio
								</ListGroup.Item>
							</a>
							<a href="#">
								<ListGroup.Item>
									<i className="fas fa-file-alt list-item" /> Cras justo odio
								</ListGroup.Item>
							</a>
						</ListGroup>
					</div>
				</div>
			</Jumbotron>
		</div>
	</article>
);

const FirstFeature = () => (
	<div className="piece animate__animated animate__slideInLeft">
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg-6 align-items-center justify-content-center piece">
					<i className="fas fa-compass banner-title" style={{ fontSize: 35 }} />
					<h6 className="banner-title">Great Streamline Delivery Service</h6>
					<h4 className="banner-title">Workflow & Management Tools</h4>
					<br />
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
						labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
						laboris nisi ut aliquip ex ea commodo consequat.
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<a href="#">
						<Button label="Learn more" />
					</a>
				</div>

				<div className="col-lg-6 d-flex align-items-center justify-content-center">
					<img
						src={Box}
						alt="Delivery Courier Royalty Free Illustration - Courier Png ..."
						height="250"
						width="250"
					/>
				</div>
			</div>
		</div>
	</div>
);

const SecondFeature = () => (
	<div className="piece animate__animated animate__slideInRight">
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg-6 d-flex align-items-center justify-content-center">
					<img
						src={Box}
						alt="Delivery Courier Royalty Free Illustration - Courier Png ..."
						height="250"
						width="250"
					/>
				</div>
				<div className="col-lg-6 align-items-center justify-content-center piece">
					<i className="fas fa-compass banner-title" style={{ fontSize: 35 }} />
					<h6 className="banner-title">Great Streamline Delivery Service</h6>
					<h4 className="banner-title">Workflow & Management Tools</h4>
					<br />
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
						labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
						laboris nisi ut aliquip ex ea commodo consequat.
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<a href="#">
						<Button label="Learn more" />
					</a>
				</div>
			</div>
		</div>
	</div>
);

const ThirdFeature = () => (
	<div className="piece animate__animated animate__slideInLeft">
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg-6 align-items-center justify-content-center piece">
					<i className="fas fa-compass banner-title" style={{ fontSize: 35 }} />
					<h6 className="banner-title">Great Streamline Delivery Service</h6>
					<h4 className="banner-title">Workflow & Management Tools</h4>
					<br />
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
						labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
						laboris nisi ut aliquip ex ea commodo consequat.
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<a href="#">
						<Button label="Learn more" />
					</a>
				</div>

				<div className="col-lg-6 d-flex align-items-center justify-content-center">
					<img
						src={Box}
						alt="Delivery Courier Royalty Free Illustration - Courier Png ..."
						height="250"
						width="250"
					/>
				</div>
			</div>
		</div>
	</div>
);

const Posts = () => (
	<CardGroup>
		<Card>
			<Card.Img
				fluid
				variant="top"
				src={A1}
				style={{
					height: 150,
					width: 150,
					justifyContent: 'center',
					alignSelf: 'center',
					display: 'flex'
				}}
			/>
			<Card.Body>
				<a href="#">
					<Card.Title>Card title</Card.Title>
					<Card.Text>
						This card has supporting text below as a natural lead-in to additional content.
					</Card.Text>
				</a>
			</Card.Body>
			<Card.Footer>
				<small className="text-muted">Last updated {new Date().getFullYear()}</small>
			</Card.Footer>
		</Card>

		<Card>
			<Card.Img
				fluid
				variant="top"
				src={A2}
				style={{
					height: 150,
					width: 150,
					justifyContent: 'center',
					alignSelf: 'center',
					display: 'flex'
				}}
			/>
			<Card.Body>
				<a href="#">
					<Card.Title>Card title</Card.Title>
					<Card.Text>
						This card has supporting text below as a natural lead-in to additional content.
					</Card.Text>
				</a>
			</Card.Body>
			<Card.Footer>
				<small className="text-muted">Last updated {new Date().getFullYear()}</small>
			</Card.Footer>
		</Card>
		<Card>
			<Card.Img
				fluid
				variant="top"
				src={A3}
				style={{
					height: 150,
					width: 150,
					justifyContent: 'center',
					alignSelf: 'center',
					display: 'flex'
				}}
			/>
			<Card.Body>
				<a href="#">
					<Card.Title>Card title</Card.Title>
					<Card.Text>
						This card has supporting text below as a natural lead-in to additional content.
					</Card.Text>
				</a>
			</Card.Body>
			<Card.Footer>
				<small className="text-muted">Last updated {new Date().getFullYear()}</small>
			</Card.Footer>
		</Card>
	</CardGroup>
);

const ContactUs = () => (
	<div className="container-fluid">
		<div className="row">
			<div className="col-md">
				<div className="section-contact-us">
					<h1 className="banner-title">Need Shipping?</h1>
					<a href="#">
						<Button label="Contact Us" />
					</a>
				</div>
			</div>
		</div>
	</div>
);

export default Home;

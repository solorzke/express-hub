import React from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import { Card } from 'react-bootstrap';
import '../../css/index.css';

const Index = () => <Wrapper children={<Body />} current="Nuevo Orden" active="new" />;

const Body = () => {
	return (
		<main className="landing-page d-flex justify-content-center align-items-center index">
			<div className="container-fluid pt-2">
				<h1 className="jo-font">Seleccione Una Opción</h1>
				<p>Agregar nuevo cliente o orden</p>
				<CardBox
					header="Cliente"
					title="Nuevo Cliente"
					text="Agregue un nuevo cliente y su orden de envío, incluida información como su nombre y sus detalles de envío para que se registre en la base de datos."
					path="/new-order/add-client"
					image="fas fa-user-circle"
				/>
				<CardBox
					header="Orden"
					title="Nuevo Orden"
					text="Cree un nuevo pedido para un cliente existente en la base de datos y agregue su información de envío."
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
					<div className="col-lg-3 text-center ">
						<i className={`${image} index-new-user-logo pb-1`} />
					</div>
					<div className="col-lg-9">
						<Card.Title>{title}</Card.Title>
						<Card.Text>{text}</Card.Text>
					</div>
				</div>
			</Card.Body>
		</Card>
	</a>
);

export default Index;

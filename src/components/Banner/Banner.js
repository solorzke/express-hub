import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Logo from '../../media/3.png';
import './Banner.css';
import Button from '../Button/Button';

const Banner = ({ height }) => {
	return (
		<div
			style={{
				height: height,
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				backgroundColor: '#34345B',
				marginBottom: 20,
				color: '#fff'
			}}
		>
			<Container>
				<Row>
					<div className="col-md-6 justify-content-center align-items-start d-flex flex-column">
						<h1 className="banner-title">Envío Exprés De Calidad</h1>
						<p>
							"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
							ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
							laboris nisi ut aliquip ex ea commodo consequat.{' '}
						</p>
						<Button label="Aprende Más" />
					</div>
					<div className="col-md-6">
						<img
							src={Logo}
							width="300"
							height="300"
							className="banner-img animate__animated animate__slideInLeft"
						/>
					</div>
				</Row>
			</Container>
		</div>
	);
};

export default Banner;

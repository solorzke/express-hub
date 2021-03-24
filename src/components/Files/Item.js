import React, { useEffect, useRef } from 'react';
import { Accordion, Card, Button, ListGroup } from 'react-bootstrap';

const Item = ({ data }) => {
	let aviRef = useRef(null);
	useEffect(() => {
		if (aviRef !== null) {
			const url = typeof data.avi === 'object' ? URL.createObjectURL(data.avi) : data.avi;
			aviRef.current.src = url;
		}
	});

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	return (
		<div className="w-100">
			<Accordion>
				<Card>
					<Card.Header className="px-2 py-0">
						<div className="row">
							<div className="col-md-2 d-flex justify-content-center align-items-center">
								<button className="btn btn-default btn-file">
									<img ref={aviRef} className="text-center avi-img" />
								</button>
							</div>
							<div className="col-md-10 pl-3 text-left pt-2">
								<Accordion.Toggle
									as={Button}
									variant="link"
									eventKey="0"
									className="p-0 float-right d-inline"
								>
									<i className="fas fa-chevron-down float-right" />
								</Accordion.Toggle>
								<span className="d-inline">
									<h5 className="d-inline">{formatString(data.name)}</h5>
									<p>Quantity: {data.quantity}</p>
								</span>
							</div>
						</div>
					</Card.Header>
					<Accordion.Collapse eventKey={'0'}>
						<Card.Body className="p-0">
							<ListGroup variant="flush">
								{data.files.map((item, index) => {
									return (
										<ListGroup.Item
											key={index}
											className="file-item"
											style={{
												borderBottom: index === data.files.length - 1 ? '1px solid #e8e8e8' : ''
											}}
										>
											{item.name}
										</ListGroup.Item>
									);
								})}
							</ListGroup>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		</div>
	);
};

export default Item;

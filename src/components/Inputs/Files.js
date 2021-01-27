import React, { useState, useRef, useEffect } from 'react';
import { Accordion, Card, Button, ListGroup } from 'react-bootstrap';
import './Files.css';

const FileInput = ({ itemName, quantity, onDelete, onFilesChange }) => {
	let aviRef = useRef(null);
	let fileRef = useRef(null);
	const [ files, setFiles ] = useState([]);
	const [ key, setKey ] = useState('1');

	useEffect(
		() => {
			setDefaultImage();
			onFilesChange(files);
		},
		[ files ]
	);

	const onChange = (e) => {
		let image = document.getElementById('avi');
		image.src = URL.createObjectURL(e.target.files[0]);
		console.log(e.target.files[0]);
	};

	const setDefaultImage = () => {
		let image = document.getElementById('avi');
		const url = 'https://www.nbmchealth.com/wp-content/uploads/rem/2018/04/default-placeholder.png';
		if (image.src === '') image.src = url;
	};

	const onClick = (type) => {
		switch (type) {
			case 'avi':
				aviRef.current.click();
				return;
			default:
				fileRef.current.click();
		}
	};

	const addFile = (e) => {
		const inputFiles = e.target.files;
		Object.keys(inputFiles).forEach((item) => setFiles((state) => [ ...state, inputFiles[item] ]));
		if (key !== 0) setKey('0');
	};

	const removeItem = (i) => {
		let copy = files;
		const filtered_array = copy.filter((item, index) => index !== i);
		if (filtered_array.length === 0) setKey('1');
		setFiles(filtered_array);
	};

	return (
		<div className="w-50">
			<Accordion>
				<Card>
					<Card.Header className="px-2 py-0">
						<div className="row">
							<div className="col-md-2 d-flex justify-content-center align-items-center">
								<button className="btn btn-default btn-file" onClick={() => onClick('avi')}>
									<input
										onChange={onChange}
										ref={aviRef}
										type="file"
										id="avi-1"
										style={{ display: 'none' }}
										accept="image/*"
									/>
									<img className="text-center" height="50" width="50" id="avi" />
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
									<h5 className="d-inline">{itemName}</h5>
									<p>
										Quantity: {quantity}
										<span className="pl-1">
											<button
												className="btn btn-link"
												type="button"
												onClick={() => onClick('file')}
											>
												<input
													ref={fileRef}
													type="file"
													multiple
													className="btn btn-link py-0 px-3"
													onChange={addFile}
													style={{ display: 'none' }}
												/>
												Add File
											</button>
											<button className="btn btn-link" type="button" onClick={onDelete}>
												<input
													ref={fileRef}
													type="file"
													multiple
													className="btn btn-link py-0 px-3"
													onChange={addFile}
													style={{ display: 'none' }}
												/>
												Remove Item
											</button>
										</span>
									</p>
								</span>
							</div>
						</div>
					</Card.Header>
					<Accordion.Collapse eventKey={key}>
						<Card.Body>
							<ListGroup variant="flush">
								{files.map((item, index) => {
									return (
										<ListGroup.Item key={index}>
											{item.name}
											<button
												className="btn btn-danger float-right"
												type="button"
												onClick={() => removeItem(index)}
											>
												Remove
											</button>
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

export default FileInput;

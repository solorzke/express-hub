import React, { useState, useRef, useEffect } from 'react';
import { Accordion, Card, Button, ListGroup } from 'react-bootstrap';
import './Files.css';

const FileInput = ({ itemName, quantity, onDelete, onFilesChange }) => {
	let aviRef = useRef(null);
	let aviInputRef = useRef(null);
	let fileRef = useRef(null);
	const [ files, setFiles ] = useState([]);
	const [ avi, setAvi ] = useState(null);
	const [ key, setKey ] = useState('1');

	useEffect(
		() => {
			setDefaultImage();
			onFilesChange(files, avi, itemName);
		},
		[ files, avi ]
	);

	const onChange = (e) => {
		const url = URL.createObjectURL(e.target.files[0]);
		aviRef.current.src = url;
		setAvi(e.target.files[0]);
	};

	const setDefaultImage = () => {
		const url = 'https://www.nbmchealth.com/wp-content/uploads/rem/2018/04/default-placeholder.png';
		if (aviRef.current.src === '') aviRef.current.src = url;
	};

	const onClick = (type) => {
		switch (type) {
			case 'avi':
				aviInputRef.current.click();
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
		<div className="w-100">
			<Accordion>
				<Card>
					<Card.Header className="px-2 py-0">
						<div className="row">
							<div className="col-md-2 d-flex justify-content-center align-items-center">
								<button className="btn btn-default btn-file" onClick={() => onClick('avi')}>
									<input
										onChange={onChange}
										ref={aviInputRef}
										type="file"
										id="avi-1"
										style={{ display: 'none' }}
										accept="image/*"
									/>
									<img ref={aviRef} className="text-center" height="50" width="50" id="avi" />
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
												Add File(s)
											</button>
											<button className="btn btn-link" type="button" onClick={onDelete}>
												Remove Item
											</button>
										</span>
									</p>
								</span>
							</div>
						</div>
					</Card.Header>
					<Accordion.Collapse eventKey={key}>
						<Card.Body className="p-0">
							<ListGroup variant="flush">
								{files.map((item, index) => {
									return (
										<ListGroup.Item
											key={index}
											className="file-item"
											style={{
												borderBottom: index === files.length - 1 ? '1px solid #e8e8e8' : ''
											}}
										>
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

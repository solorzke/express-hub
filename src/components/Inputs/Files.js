import React, { useState, useRef, useEffect } from 'react';
import { Accordion, Card, Button, ListGroup } from 'react-bootstrap';
import './Files.css';

const FileInput = ({ itemName, quantity, onDelete, onFilesChange, itemKey, onUpdate }) => {
	//Refs target the hidden inputs for avi and files, and the avi image element
	let aviRef = useRef(null);
	let aviInputRef = useRef(null);
	let fileRef = useRef(null);
	//State props for tracking the files, avi, and key data. Key references the eventKey for triggering the collapse or reveal
	//effect, not to be confused with object keys.
	const [ files, setFiles ] = useState([]);
	const [ avi, setAvi ] = useState(null);
	const [ key, setKey ] = useState('1');

	//Set default image if necessary, and log changes to the files and avi state, such as files uploaded
	useEffect(
		() => {
			setDefaultImage();
			onFilesChange(files, avi, itemKey);
		},
		[ files, avi ]
	);

	//Track changes to the input ref for avi image of the item, update its data to the state, and set the img source to
	//the uploaded avi image.
	const onAviChange = (e) => {
		const url = URL.createObjectURL(e.target.files[0]);
		aviRef.current.src = url;
		setAvi(e.target.files[0]);
	};

	//Set a default image from a url to the avi as a placeholder until it is changed
	const setDefaultImage = () => {
		const url = 'https://www.nbmchealth.com/wp-content/uploads/rem/2018/04/default-placeholder.png';
		if (aviRef.current.src === '') {
			aviRef.current.src = url;
			setAvi(url);
		}
	};

	//Track what type of action the onClick function was triggered for and execute its case subroutine
	const onClick = (type) => {
		switch (type) {
			case 'avi':
				aviInputRef.current.click();
				return;
			default:
				fileRef.current.click();
		}
	};

	//Update the files state by uploading the entire files' object/array from the event obj and set the event key to 0.
	//'0' meaning trigger the Accordian Body reveal with the file items displayed vs. '1' meaning hide the Accordian Body
	const addFile = (e) => {
		const inputFiles = e.target.files;
		Object.keys(inputFiles).forEach((item) => setFiles((state) => [ ...state, inputFiles[item] ]));
		if (key !== 0) setKey('0');
	};

	//Extract and remove the file item by matching the index of the item in the filter loop.
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
										onChange={onAviChange}
										ref={aviInputRef}
										type="file"
										style={{ display: 'none' }}
										accept="image/*"
									/>
									<img ref={aviRef} className="text-center avi-img" />
								</button>
							</div>
							<div className="col-md-10 pl-3 text-left pt-2 item-box">
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
												Agregar
											</button>
											<button className="btn btn-link" type="button" onClick={onUpdate}>
												Actualizar
											</button>
											<button className="btn btn-link" type="button" onClick={onDelete}>
												Borrar
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
												Borrar
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

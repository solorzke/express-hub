import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Input from '../Inputs/Input';

const Prompt = ({ modalShow, onHide, currentItem, currentQuantity, onPromptSubmission, itemKey }) => {
	const onSubmit = (e) => {
		e.preventDefault();
		const quantity = document.getElementById('quantity-prompt').value;
		const item = document.getElementById('item-prompt').value;
		onPromptSubmission(quantity, item, itemKey);
	};

	return (
		<Modal show={modalShow} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<form onSubmit={(e) => onSubmit(e)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Update Item Listing</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h4>Edit the name or the quantity of this item.</h4>
					<div className="form-group row">
						<Input
							required={false}
							column="col-md-10"
							id="item-prompt"
							label="Item"
							type="text"
							placeholder={currentItem}
							name="item-prompt"
						/>
						<Input
							required={false}
							column="col-md-2"
							id="quantity-prompt"
							label="Quantity"
							type="number"
							placeholder={currentQuantity}
							name="quantity-prompt"
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={onHide}>
						Close
					</Button>
					<input type="submit" value="Update Item" className="btn btn-primary" />
				</Modal.Footer>
			</form>
		</Modal>
	);
};

export default Prompt;

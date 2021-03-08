import React, { useRef, useState } from 'react';
import Input from '../../components/Inputs/Horizontal';
import Editor from '../TextEditor/Editor';

export const TextField = ({ storeKey, heading, value, onClick, id, onCancel }) => {
	let textRef = useRef(null);
	return (
		<div className="col-md-11 py-1 update-item">
			<div className="row">
				<div className="col-md">
					<label htmlFor={id}>{heading}</label>
					<input ref={textRef} type="text" className="form-control" id={id} placeholder={value} name={id} />
				</div>
				<div className="col-md align-items-end justify-content-start d-flex">
					<button className="btn btn-link text-danger" onClick={onCancel}>
						Cancel
					</button>
					<button className="btn btn-link" onClick={(e) => onClick(e, { [storeKey]: textRef.current.value })}>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};

export const RadioField = ({ storeKey, heading, onClick, options, onCancel }) => {
	const [ SELECTED, setSelected ] = useState('');
	return (
		<div className="update-item col-md-11 py-2">
			<label className="pr-5">{heading}</label>
			{options.map((item, index) => (
				<div className="form-check form-check-inline" key={index}>
					<input
						className="form-check-input"
						type="radio"
						name="inlineRadioOptions"
						id={item.value}
						value={item.value}
						onClick={() => setSelected(item.value)}
					/>
					<label className="form-check-label" for={item.value}>
						{item.name}
					</label>
				</div>
			))}
			<button className="btn btn-link text-danger" onClick={onCancel}>
				Cancel
			</button>
			<button className="btn btn-link" onClick={(e) => onClick(e, { [storeKey]: SELECTED })}>
				Update
			</button>
		</div>
	);
};

export const ToggleField = ({ storeKey, onClick, value, onCancel }) => (
	<div className="update-item col-md-11">
		<h6 className="mb-0 mt-2">Change Shipping Status</h6>
		<button className="btn btn-link text-danger pl-0" onClick={onCancel}>
			Cancel
		</button>
		<button className="btn btn-link pl-0" onClick={(e) => onClick(e, { [storeKey]: !value })}>
			{`Change status to ${value ? '"Waiting To Be Shipped"' : '"Shipped"'}`}
		</button>
	</div>
);

export const DateField = ({ storeKey, onClick, onCancel, value }) => {
	let datePicker = useRef(null);

	const reformatDate = (type) => {
		if (type === 'yyyy-mm-dd') {
			const bytes = value.split('/');
			return `${bytes[2]}-${bytes[0]}-${bytes[1]}`;
		} else if (type === 'mm/dd/yyyy') {
			const bytes = datePicker.current.value.split('-');
			return `${bytes[1]}/${bytes[2]}/${bytes[0]}`;
		}
	};

	return (
		<div className="update-item col-md-11">
			<div className="row">
				<div className="col-md-4">
					<label htmlFor="order-date">Order Date</label>
					<input
						ref={datePicker}
						type="date"
						className="form-control"
						id="order-date"
						defaultValue={reformatDate('yyyy-mm-dd')}
						name="order-date"
						required
					/>
				</div>
				<div className="col-md-8 align-items-end justify-content-start d-flex">
					<button className="btn btn-link text-danger pl-0" onClick={onCancel}>
						Cancel
					</button>
					<button
						className="btn btn-link pl-0"
						onClick={(e) => onClick(e, { [storeKey]: reformatDate('mm/dd/yyyy') })}
					>
						Change Status
					</button>
				</div>
			</div>
		</div>
	);
};

export const PhoneField = ({ storeKey, onClick, id, value, heading, onCancel }) => {
	let phoneRef = useRef(null);

	return (
		<div className="col-md-11 py-1 update-item">
			<div className="row">
				<div className="col-md">
					<label htmlFor={id}>{heading}</label>
					<input ref={phoneRef} type="tel" className="form-control" id={id} placeholder={value} name={id} />
				</div>
				<div className="col-md align-items-end justify-content-start d-flex">
					<button className="btn btn-link text-danger" onClick={onCancel}>
						Cancel
					</button>
					<button
						className="btn btn-link"
						onClick={(e) => onClick(e, { [storeKey]: phoneRef.current.value })}
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};

export const UserEmailField = ({ storeKey, heading, onClick, id, onCancel }) => {
	let oldEmailRef = useRef(null);
	let newEmailRef = useRef(null);
	let passwordRef = useRef(null);

	return (
		<div className="col-md-11 py-1 update-item">
			<div className="row">
				<div className="col-md">
					<label htmlFor={id}>{heading}</label>
					<input
						ref={newEmailRef}
						type="email"
						className="form-control my-1"
						id="old-email"
						placeholder="Enter new email address"
						name={id}
						required
					/>
					<input
						ref={oldEmailRef}
						type="email"
						className="form-control my-1"
						id={id}
						placeholder="Enter current email address"
						name="old-email"
						required
					/>

					<input
						ref={passwordRef}
						type="password"
						className="form-control my-1"
						id="password"
						placeholder="Enter current password"
						name="password"
						required
					/>
				</div>
				<div className="col-md align-items-center justify-content-start d-flex">
					<button className="btn btn-link text-danger" onClick={onCancel}>
						Cancel
					</button>
					<button
						className="btn btn-link"
						onClick={(e) =>
							onClick(e, {
								[storeKey]: newEmailRef.current.value,
								'old-email': oldEmailRef.current.value,
								password: passwordRef.current.value
							})}
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};

export const ClientEmailField = ({ storeKey, heading, onClick, id, onCancel }) => {
	let emailRef = useRef(null);

	return (
		<div className="col-md-11 py-1 update-item">
			<div className="row">
				<div className="col-md">
					<label htmlFor={id}>{heading}</label>
					<input
						ref={emailRef}
						type="email"
						className="form-control my-1"
						id="email"
						placeholder="Enter new email address"
						name={id}
					/>
				</div>
				<div className="col-md align-items-end justify-content-start d-flex">
					<button className="btn btn-link text-danger" onClick={onCancel}>
						Cancel
					</button>
					<button
						className="btn btn-link"
						onClick={(e) => onClick(e, { [storeKey]: emailRef.current.value })}
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};

export const RichTextField = ({ storeKey, onClick, onCancel }) => {
	const [ TEXT, setText ] = useState('');

	return (
		<div className="col-md-11">
			<div className="row update-item">
				<div className="col-md-8 py-1">
					<Editor onChange={(text) => setText(text)} />
				</div>
				<div className="col-md-4 align-items-center justify-content-start d-flex">
					<button className="btn btn-link text-danger" onClick={onCancel}>
						Cancel
					</button>
					<button className="btn btn-link" onClick={(e) => onClick(e, { [storeKey]: TEXT })}>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};

export const PasswordField = ({ storeKey, heading, onClick, id, onCancel }) => {
	let oldPasswordRef = useRef(null);
	let newPasswordRef = useRef(null);

	return (
		<div className="col-md-11 py-1 update-item">
			<div className="row">
				<div className="col-md">
					<label htmlFor={id}>{heading}</label>
					<input
						ref={newPasswordRef}
						type="password"
						className="form-control my-1"
						id={id}
						placeholder="Enter new password"
						name="new-password"
						required
					/>
					<input
						ref={oldPasswordRef}
						type="password"
						className="form-control my-1"
						id="old-password"
						placeholder="Enter old password"
						name="old-password"
						required
					/>
				</div>
				<div className="col-md align-items-center justify-content-start d-flex">
					<button className="btn btn-link text-danger" onClick={onCancel}>
						Cancel
					</button>
					<button
						className="btn btn-link"
						onClick={(e) =>
							onClick(e, {
								[storeKey]: newPasswordRef.current.value,
								'old-password': oldPasswordRef.current.value
							})}
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};

import React, { useState } from 'react';
import parse from 'html-react-parser';
import {
	TextField,
	ToggleField,
	DateField,
	RichTextField,
	UserEmailField,
	PasswordField,
	RadioField,
	ClientEmailField,
	PhoneField,
	PriceField
} from './UpdateField';

const Field = ({ types, index, item, formatString, onUpdate }) => {
	//Trigger a change in the DOM to rerender this component with the update field component
	//If the field component was ever clicked on
	const [ SLIDE, setSlide ] = useState(false);

	const onSlide = (e) => {
		e.preventDefault();
		setSlide(true);
	};

	//Rerender the Slidebox depending on the type of input needed to display
	const SlideBox = ({ type }) => {
		switch (type) {
			case 'text':
				return (
					<TextField
						storeKey={item.key}
						heading={item.name}
						value={item.value}
						onClick={onUpdate}
						onCancel={() => setSlide(false)}
						id={`${item.value}-update`}
					/>
				);
			case 'toggle':
				return (
					<ToggleField
						onClick={onUpdate}
						onCancel={() => setSlide(false)}
						value={item.status}
						storeKey={item.key}
					/>
				);
			case 'date':
				return (
					<DateField
						storeKey={item.key}
						onClick={onUpdate}
						onCancel={() => setSlide(false)}
						value={item.value}
					/>
				);
			case 'user-email':
				return (
					<UserEmailField
						storeKey={item.key}
						heading={item.name}
						id={`${item.value}-update`}
						onClick={onUpdate}
						onCancel={() => setSlide(false)}
					/>
				);
			case 'client-email':
				return (
					<ClientEmailField
						storeKey={item.key}
						heading={item.name}
						id={`${item.value}-update`}
						onClick={onUpdate}
						onCancel={() => setSlide(false)}
					/>
				);

			case 'tel':
				return (
					<PhoneField
						storeKey={item.key}
						heading={item.name}
						value={item.value}
						id={item.value}
						onClick={onUpdate}
						onCancel={() => setSlide(false)}
					/>
				);
			case 'password':
				return (
					<PasswordField
						storeKey={item.key}
						heading={item.name}
						onClick={onUpdate}
						id={item.value}
						onCancel={() => setSlide(false)}
					/>
				);
			case 'radio':
				return (
					<RadioField
						storeKey={item.key}
						heading={item.name}
						options={item.options}
						onClick={onUpdate}
						onCancel={() => setSlide(false)}
					/>
				);
			case 'price':
				return (
					<PriceField
						storeKey={item.key}
						heading={item.name}
						value={item.value}
						onClick={onUpdate}
						onCancel={() => setSlide(false)}
					/>
				);
			case 'rich-text':
				return <RichTextField storeKey={item.key} onClick={onUpdate} onCancel={() => setSlide(false)} />;
			default:
				break;
		}
	};

	return (
		<div
			className={`row border ${types.length !== index + 1 ? 'border-bottom-0' : ''} border-light ml-2`}
			key={index}
		>
			<ImageBox item={item} />
			{SLIDE ? (
				<SlideBox type={item.type} />
			) : (
				<Body permitted={item.permitted} item={item} onSlide={onSlide.bind(this)} formatString={formatString} />
			)}
		</div>
	);
};

const ImageBox = ({ item }) => (
	<div className="col-sm-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#34345B' }}>
		<i className={`${item.img}`} style={{ color: '#ee4266' }} />
	</div>
);

const Body = ({ item, onSlide, formatString, permitted }) => (
	<div className="col-sm-11" style={{ backgroundColor: '#FFFCF2' }}>
		<h6 className="mb-0 mt-2">{item.name}</h6>
		{permitted ? <Chevron onSlide={onSlide} /> : <br />}
		{item.name === 'Notas' ? (
			parse(
				`<span class="text-secondary mb-1">${item.value !== undefined
					? item.value
					: 'No Information Available'}</span>`
			)
		) : (
			<p className="text-secondary mb-1">
				{item.value !== '' ? formatString(item.value) : 'No Information Available'}
			</p>
		)}
	</div>
);

const Chevron = ({ onSlide }) => (
	<p>
		<i className="edit-item fas fa-chevron-right float-right pr-5" onClick={onSlide} />
	</p>
);

export default Field;

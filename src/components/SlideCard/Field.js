import React from 'react';
import parse from 'html-react-parser';

const Field = ({ types, index, item, formatString }) => (
	<div className={`row border ${types.length !== index + 1 ? 'border-bottom-0' : ''} border-light ml-2`} key={index}>
		<div
			className="col-sm-1 d-flex justify-content-center align-items-center"
			style={{ backgroundColor: '#2a1e5c' }}
		>
			<i className={`${item.img}`} style={{ color: '#ee4266' }} />
		</div>
		<div className="col-sm-11" style={{ backgroundColor: '#FFFCF2' }}>
			<h6 className="mb-0 mt-2">{item.name}</h6>
			<p>
				<i className="fas fa-chevron-right float-right pr-5" />
			</p>
			{item.name === 'Notes' ? (
				parse(
					`<span className="text-secondary mb-1">${item.value !== undefined
						? item.value
						: 'No Information Available'}</span>`
				)
			) : (
				<p className="text-secondary mb-1">
					{item.value !== undefined ? formatString(item.value) : 'No Information Available'}
				</p>
			)}
		</div>
	</div>
);

export default Field;

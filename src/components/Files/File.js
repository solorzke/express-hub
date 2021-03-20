import React from 'react';
import './File.css';

const File = ({ id, date, items, names }) => {
	return (
		<a
			href={`/order?id=${id}&fname=${names.fname}&lname=${names.lname}`}
			className="pl-5 border border-light"
			style={{ backgroundColor: '#FFFCF2' }}
		>
			<li>
				Pedido: {id}
				<p className="file-items text-secondary px-0">
					<span className="file-date text-secondary pr-3">{date}</span>Articulos: {items}
				</p>
			</li>
		</a>
	);
};

export default File;

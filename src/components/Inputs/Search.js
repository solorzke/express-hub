import React, { useState } from 'react';
import Firebase from 'firebase/app';
import { Config } from '../../data/Config';
import 'firebase/firestore';
import './Search.css';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const SearchBar = () => {
	const [ names, setNames ] = useState([]);

	const onChange = async (e) => {
		const value = e.target.value;
		let matchingResults = [];
		//Request a list of clients from the firestore
		const snapshot = await Firebase.firestore().collection('clients').get();
		snapshot.forEach((doc) => {
			const data = doc.data();
			const full_name = `${data.fname} ${data.lname}`;
			if (full_name.includes(value) && value.length > 0) {
				console.log(`Val: ${value} Client: ${full_name}`);
				const matching = matchingResults.filter((item) => item.name === full_name);
				if (matching.length === 0) {
					matchingResults.push({ name: full_name, id: data.id });
				}
				console.table(matching);
			}
		});
		setNames(matchingResults);
	};

	//Change the casing of every word in the string
	const formatString = (str) => {
		//Check if its multi-word
		const words = str.split(' ');
		const newString = words.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
		return newString.join(' ');
	};

	return (
		<div>
			<input
				type="text"
				class="form-control"
				placeholder="Search client's name"
				name="search"
				id="search"
				onChange={onChange.bind(this)}
			/>
			<div className="search-bar">
				{names.map((item) => (
					<a href={`/clients?client=${item.id}`}>
						<p className="py-2 pl-3 my-0">{formatString(item.name)}</p>
					</a>
				))}
			</div>
		</div>
	);
};

export default SearchBar;

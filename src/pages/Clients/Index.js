import React from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import Firebase from 'firebase/app';
import 'firebase/firestore';

const Index = () => <Wrapper children={<Body />} current="Clients" active="clients" />;

const Body = () => {
	return (
		<main class="container p-3">
			<h1>Client Search</h1>
			<p class="pb-5">Find a client by search or selection to bring up their information and recent orders.</p>
			<form>
				<div class="form-group row">
					<div class="form-group col-md-4">
						<input
							type="text"
							class="form-control"
							placeholder="Search client's name"
							name="search"
							id="search"
						/>
					</div>
					<div class="form-group col-md-2">
						<button class="btn btn-md btn-primary" id="submit">
							<i class="fas fa-search" />
						</button>
					</div>
					<div class="form-group col-md-6">
						<select class="custom-select" id="client" onchange="onSelect();">
							<option value="0">Or select a client...</option>
							{/* <?php foreach($clients as $client): ?> */}
							{/* <option value="<?php echo $client['client_id']; ?>">
                        <?php 
                            $fname = ucfirst($client['fname']);
                            $lname = ucfirst($client['lname']);
                            echo $fname.' '.$lname;
                        ?>
                    </option>
                    <?php endforeach; ?> */}
						</select>
					</div>
				</div>
			</form>
			<section id="results" />
			<script src="./model/scripts/js/search-clients.js" type="text/javascript" />
		</main>
	);
};

export default Index;

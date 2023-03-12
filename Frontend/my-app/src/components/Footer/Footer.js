import React from "react";
import { Link } from "react-router-dom";
import "./footerStyle.css"

const Footer = () => {
return (
	<footer class="footer">
		<div class="container-fluid">
			<div class="row p-2">
				<div class="col-sm-6 col-md-6 col-lg-6 text-center">
				<h5>About Us</h5>
					<ul class="list-unstyled">
						<li>
						<Link to="/about/who">Who are we</Link>
						</li>
						<li>
						<Link to="/about/what">What do we stand for</Link>
						</li>
					</ul>
				</div>
				<div class="col-sm-6 text-center">
				<h5>Contact Us</h5>
					<ul class="list-unstyled">
						<li>
							<Link to="/contact/email">E-mail</Link>
						</li>
						<li>
							<Link to="/contact/phone">Phone</Link>
						</li>
						<li>
							<Link to="/contact/address">Address</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</footer>
);
};
export default Footer;


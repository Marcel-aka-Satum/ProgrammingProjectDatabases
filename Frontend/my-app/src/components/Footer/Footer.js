import React from "react";
import { Link } from "react-router-dom";
import "./footerStyle.css"

const Footer = () => {
return (
	<footer className="footer">
	<div className="container">
		<div className="row">
		<div className="column">
			<p>About Us</p>
			<ul>
			<li>
				<Link to="/about/who">Who are we</Link>
			</li>
			<li>
				<Link to="/about/what">What do we stand for</Link>
			</li>
			</ul>
			</div>
		<div className="column">
		<p>Contact Us</p>
		<ul>
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

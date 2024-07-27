"use client";
import Link from "next/link";
import { GitHub, Home, LinkedIn, Mail } from "@mui/icons-material";

const Footer = () => {
	return (
		<footer className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<h2 className="text-2xl font-bold">
							Mahir Labib Dihan
						</h2>
						<p className="text-sm">CSE Undergraduate | BUET</p>
					</div>
					<div className="flex space-x-4">
						<Link
							href="https://mahirlabibdihan.github.io"
							className="hover:text-blue-200 transition-colors"
						>
							<Home size={24} />
						</Link>
						<Link
							href="https://github.com/mahirlabibdihan"
							className="hover:text-blue-200 transition-colors"
						>
							<GitHub size={24} />
						</Link>
						<Link
							href="https://linkedin.com/in/mahirlabibdihan"
							className="hover:text-green-200 transition-colors"
						>
							<LinkedIn size={24} />
						</Link>
						<Link
							href="mailto:mahirlabibdihan@gmail.com"
							className="hover:text-white transition-colors"
						>
							<Mail size={24} />
						</Link>
					</div>
				</div>
				<div className="mt-8 text-center text-sm">
					<p>
						&copy; {new Date().getFullYear()} Mahir Labib Dihan. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

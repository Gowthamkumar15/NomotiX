import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BsArrowUpRight } from "react-icons/bs";

const menuLinks = [
	{ path: "/mybookings", label: "Your Bookings" },
	{ path: "#who-are-we", label: "Who Are We" },
	{
		path: "#feedback",
		label: "Feedback",
		className: "px-3 py-2 bg-secondary-200 rounded-md text-white",
	},
];
const Navbar = () => {
	const container = useRef();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const tl = useRef();
	const isDashboard = window.location.pathname.includes("/dashboard");
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	useGSAP(
		() => {
			gsap.set(".menu-link-item-holder", { y: 75 });

			tl.current = gsap
				.timeline({ paused: true })
				.to(".menu-overlay", {
					duration: 1,
					clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
					ease: "power4.inOut",
				})
				.to(".menu-link-item-holder", {
					y: 0,
					duration: 0.75,
					stagger: 0.1,
					ease: "power4.inOut",
					delay: -0.75,
				});
		},
		{ scope: container }
	);

	useEffect(() => {
		if (isMenuOpen) {
			tl.current.play();
		} else {
			tl.current.reverse();
		}
	}, [isMenuOpen]);

	useEffect(() => {
		const listenScroll = () =>
			window.addEventListener("scroll", () => {
				if (window.scrollY > 25) {
					navbar.classList.add("navbar-scrolled");
				} else if (window.scrollY < 25) {
					navbar.classList.remove("navbar-scrolled");
				}
			});

		const navbar = document.querySelector(".menu-container");
		listenScroll();

		return () => {
			window.removeEventListener("scroll", listenScroll);
		};
	}, []);

	return (
		<>
			<div className="menu-container bg-primary-100" ref={container}>
				<div className="menu-bar-wrapper">
					<div className="menu-bar">
						<div className="menu-logo">
							<div className="flex justify-center items-center gap-2">
								<h3 className="text-xl font-fraunces font-medium">
									NOMOTIX
								</h3>
							</div>
						</div>
						{!isDashboard && (
								<div className="menu-link-item">
									<div className="menu-link-item-holder" onClick={toggleMenu}>
									<a href="/breakdown" className="menu-link font-semibold text-[#6366f1] hover:underline">
										Book a Service
									</a>
									</div>
								</div>
								)}
						<div className="hidden md:flex gap-2 justify-center items-center">
							{menuLinks.map((link, index) => (
								<Navlink key={index} path={link.path} className={link.className}>
									{link.label}
								</Navlink>
							))}
						</div>
						<div
							className="menu-open md:hidden flex justify-center items-center gap-3"
							onClick={toggleMenu}
						>
							<p>Menu</p>
						</div>
					</div>
				</div>

				<div className="menu-overlay font-fraunces">
					<div className="menu-overlay-bar">
						<div className="menu-logo">
							<div className="flex justify-center items-center gap-2">
								<h1 className="text-black text-xl">NOMOTIX</h1>
							</div>
						</div>
					</div>
					<div className="menu-close-icon">
						<p>&#x2715;</p>
					</div>
					<div className="menu-copy">
						<div className="menu-links">
							<div>
								<w3m-button balance="hide" />
							</div>
							{!isDashboard && (
								<div className="menu-link-item">
									<div className="menu-link-item-holder" onClick={toggleMenu}>
									<a href="/breakdown" className="menu-link font-semibold text-[#6366f1] hover:underline">
										Book a Service
									</a>
									</div>
								</div>
								)}
							{menuLinks.map((link, index) => (
								<div className="menu-link-item" key={index}>
									<div className="menu-link-item-holder" onClick={toggleMenu}>
										<a href={link.path} className="menu-link">
											{link.label}
										</a>
									</div>
								</div>
							))}
						</div>
						<div className="menu-info">
							<div className="menu-info-col">
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="flex gap-2"
								>
									<span><a heref="https://www.instagram.com/nomotix?igsh=MTQ3bnI5NWN5bXBseA==">Instagram</a></span>
									<span>
										<BsArrowUpRight />
									</span>
								</a>
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="flex gap-2"
								>
									<span>Twitter</span>
									<span>
										<BsArrowUpRight />
									</span>
								</a>
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="flex gap-2"
								>
									<span>Discord</span>
									<span>
										<BsArrowUpRight />
									</span>
								</a>
								<p>info@ogexpress.com</p>
								<p>+91 9491955836</p>
							</div>
						</div>
					</div>
					<div className="menu-preview">
						<div className="menu-close" onClick={toggleMenu}>
							<p className="text-black font-poppins font-medium">Close</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;

export const Navlink = ({ children, path, className }) => {
	return (
		<a href={path}>
			<button
				className={
					className
						? className
						: "px-2 py-1 rounded-[4px] hover:bg-secondary-200 hover:bg-opacity-20 ease-in-out duration-500"
				}
			>
				{children}
			</button>
		</a>
	);
};

"use client";
import { useRouter } from "next/navigation";
import "../styles/Navbar.css";

const Navbar = () => {
  const router = useRouter();
  const cartCount = 0;

  return (
    <>
      <nav className="navbar">
        <img
          src="/images/logo_Ruvee.png"
          alt="Ruvee"
          className="w-20 logo"
          onClick={() => router.push("/")}
        />
        <div>
          <ul className="nav-links items-center">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li className="cart-icon">
              <a href="#cart" className="flex items-center">
                <i className="fa-solid fa-cart-shopping"></i>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </a>
            </li>
            <img src="/images/profile.png" alt="Profile" className="w-10 profile" />
          </ul>
        </div>
      </nav>
      <div className="search-container flex justify-center items-center">
        <i className="fa-solid fa-magnifying-glass ml-4"></i>
        <input
          type="text"
          className="searchItem"
          placeholder="search your attitude"
        />
      </div>
    </>
  );
};

export default Navbar;

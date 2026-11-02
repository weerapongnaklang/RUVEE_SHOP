import Image from "next/image";
import Link from "next/link";
import { CartIcon, SearchIcon } from "./icons";
import ProfileDrawer from "./ProfileDrawer";

const navLinkClass =
  "block px-4 py-2 text-ink rounded-[20px] transition-all duration-200 ease-in-out hover:bg-brand hover:text-on-brand hover:shadow-md";

const Navbar = () => {
  const cartCount = 0;

  return (
    <>
      <nav
        id="main-nav"
        aria-label="Main"
        className="flex justify-between items-center p-2"
      >
        <Link id="nav-logo-link" href="/home" aria-label="RUVEE home">
          <Image
            id="nav-logo"
            src="/images/logo_Ruvee.png"
            alt="Ruvee"
            width={375}
            height={104}
            className="w-20 h-auto"
          />
        </Link>
        <ul
          id="nav-menu"
          className="flex items-center gap-4 w-1/2 m-0 p-0 list-none"
        >
          <li className="w-full">
            <a id="nav-about-link" href="#about" className={navLinkClass}>
              About
            </a>
          </li>
          <li className="w-full">
            <a
              id="nav-services-link"
              href="#services"
              className={navLinkClass}
            >
              Services
            </a>
          </li>
          <li className="w-full">
            <a
              id="nav-contact-link"
              href="#contact"
              className={navLinkClass}
            >
              Contact
            </a>
          </li>
          <li className="relative w-full">
            <button
              id="cart-button"
              type="button"
              aria-label={`Cart, ${cartCount} items`}
              className={`${navLinkClass} flex items-center cursor-pointer`}
            >
              <CartIcon className="w-4 h-4" />
              {cartCount > 0 && (
                <span
                  id="cart-count"
                  className="absolute -top-1 right-1 bg-badge text-on-brand text-xs font-bold px-[7px] py-0.5 rounded-full"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </li>
          <li className="shrink-0">
            <ProfileDrawer />
          </li>
        </ul>
      </nav>
      <div
        id="search-bar"
        role="search"
        className="flex justify-center items-center w-1/2 h-10 mx-auto border-2 border-brand rounded-[20px]"
      >
        <SearchIcon className="w-4 h-4 ml-4 text-ink-subtle" />
        <label htmlFor="search" className="sr-only">
          Search products
        </label>
        <input
          id="search"
          type="search"
          className="w-[90%] h-full px-4 py-2 text-base bg-transparent border-none outline-none rounded-[20px]"
          placeholder="search your attitude"
        />
      </div>
    </>
  );
};

export default Navbar;

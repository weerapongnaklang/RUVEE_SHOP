import Image from "next/image";
import Link from "next/link";
import { CartIcon, SearchIcon } from "./icons";

const navLinkClass =
  "block px-4 py-2 text-black rounded-[20px] transition-all duration-200 ease-in-out hover:bg-[#b62547] hover:text-white hover:shadow-md";

const Navbar = () => {
  const cartCount = 0;

  return (
    <>
      <nav aria-label="Main" className="flex justify-between items-center p-2">
        <Link href="/" aria-label="RUVEE home">
          <Image
            src="/images/logo_Ruvee.png"
            alt="Ruvee"
            width={375}
            height={104}
            className="w-20 h-auto"
          />
        </Link>
        <ul className="flex items-center gap-4 w-1/2 m-0 p-0 list-none">
          <li className="w-full">
            <a href="#about" className={navLinkClass}>
              About
            </a>
          </li>
          <li className="w-full">
            <a href="#services" className={navLinkClass}>
              Services
            </a>
          </li>
          <li className="w-full">
            <a href="#contact" className={navLinkClass}>
              Contact
            </a>
          </li>
          <li className="relative w-full">
            <button
              type="button"
              aria-label={`Cart, ${cartCount} items`}
              className={`${navLinkClass} flex items-center cursor-pointer`}
            >
              <CartIcon className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs font-bold px-[7px] py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </li>
          <li>
            <Image
              src="/images/profile.png"
              alt="Profile"
              width={750}
              height={750}
              className="w-10 h-auto"
            />
          </li>
        </ul>
      </nav>
      <div
        role="search"
        className="flex justify-center items-center w-1/2 h-10 mx-auto border-2 border-[#b62547] rounded-[20px]"
      >
        <SearchIcon className="w-4 h-4 ml-4 text-gray-500" />
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

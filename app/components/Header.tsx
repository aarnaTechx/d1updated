"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import '../globals.css'; 
import Logo from '../public/images/logo.png';
import Image from 'next/image';
import jwt from 'jsonwebtoken';
import defaultImage from '../public/default.jpg';

interface DecodedToken {
  name: string;
  image?: string;
}

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [profilepic, setProfilepic] = useState<string>(defaultImage.src); // Use the src property
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // For mobile menu
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(); // Sign out using NextAuth.js
    localStorage.setItem('userImage', '')
    window.location.href = '/login';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (session) {
      // Optional: Handle session logic
    }
  }, [session]);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-black text-2xl font-bold flex-shrink-0" onClick={closeMenu}>
          <Image src={Logo} className='logo' alt="logo" />
        </Link>
        <div className="md:hidden flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="text-gray-500 focus:outline-none focus:text-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>
        <nav
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex md:items-center w-full md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-4 md:mt-0">
            {session ? (
              <>
                <li className='pt-[8px]'>
                  <Link href="/browse" className="text-black hover:text-black-300" onClick={closeMenu}>
                    Browse Coach
                  </Link>
                </li>
                <li className='pt-[8px]'>
                  <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={closeMenu}>
                    Hello, {session?.user?.name || "Player"}!
                  </Link>
                </li>
                <li className="relative">
                  <button onClick={toggleDropdown} className="flex items-center">
                    <Image 
                      src={localStorage.getItem('userImage') || defaultImage}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full" 
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                      <ul>
                        <li>
                          <Link href="/settings" className="block px-4 py-2 text-black hover:bg-blue-300" onClick={closeMenu}>
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-black hover:bg-blue-300">
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/browse" className="text-black hover:text-black-300" onClick={closeMenu}>
                    Browse Coach
                  </Link>
                </li>
                <li>
                  <Link href="/coach/signup" className="text-black hover:text-black-300" onClick={closeMenu}>
                    Coach Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={closeMenu}>
                    Player Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-black hover:text-blue-300" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

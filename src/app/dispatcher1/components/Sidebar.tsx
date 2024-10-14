"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../images/logo.png';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        const storedActiveLink = localStorage.getItem('activeLink');
        if (storedActiveLink) {
            setActiveLink(storedActiveLink);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('activeLink', activeLink);
    }, [activeLink]);

    return (
        <div className="flex max-h-screen">
            <button
                className="md:hidden h-12 w-12 p-2 bg-black flex items-center justify-center fixed top-4 left-4 z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                )}
            </button>

            <div className={`bg-custom-gray-2 border-r border-gray-200 text-black h-screen w-56 flex flex-col justify-between p-4 fixed top-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
                <div>
                    <div className="flex flex-col items-center space-y-2 p-2" style={{ marginTop: '-0.5rem' }}>
                        <Image src={logo} alt="logo" className='w-20' />
                        <span className="text-xl font-bold text-center">Markads TransCo</span>
                    </div>
                    <hr className="border" />
                    <nav className="mt-4">
                        <h1 className='mb-3'>Menu</h1>

                        <Link href="/dispatcher1/schedule"
                            className={`relative flex items-center space-x-2 p-2 rounded-md group cursor-pointer ${activeLink === '/dispatcher/schedule' ? 'bg-custom-white text-custom-black' : 'text-gray-400 hover:bg-custom-white hover:text-custom-black'}`}
                            onClick={() => setActiveLink('/dispatcher/schedule')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-6 8h6m-6 4h6m-6 4h6M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                            </svg>
                            <span className="text-sm font-bold">Schedule</span>
                        </Link>

                        <Link href="/dispatcher1/queue"
                            className={`relative flex items-center space-x-2 p-2 rounded-md mt-2 group cursor-pointer ${activeLink === '/dispatcher/queue' ? 'bg-custom-white text-custom-black' : 'text-gray-400 hover:bg-custom-white hover:text-custom-black'}`}
                            onClick={() => setActiveLink('/dispatcher/queue')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                            <span className="text-sm font-bold">Queue</span>
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="flex-1 ml-56 md:ml-0 md:pl-56">
                {/* Content goes here */}
                <div className="p-4">
                    {activeLink === '/dispatcher/schedule' && (
                        <div>
                            {/* Schedule content */}
                        </div>
                    )}
                    {activeLink === '/dispatcher/queue' && (
                        <div>
                            {/* Queue content */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
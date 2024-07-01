import React, { useState, useEffect, useRef }from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';
import {
  LayoutGrid,
  Clock3,
  BarChart2,
  ArrowRightLeftIcon,
  LogOutIcon
} from "lucide-react";

const Links = [
  { 
    title: 'Dashboard',
    icon: LayoutGrid, 
    href: "./dashboard"

  },
  { 
    title: 'Activity', 
    icon: Clock3,
    href: "./activity"
  },
  { 
    title: 'Analytics',
    icon: BarChart2, 
    href: "./analytics"
  },
  {
    title: 'Transactions',
    icon: ArrowRightLeftIcon,
    href: "./transactions"
  },
  { 
    title: 'Logout', 
    icon: LogOutIcon,
    href: "./logout"
  },
]

function Sidebar() {
  const [show, setShow] = useState(false);
  const sidebarRef = useRef(null);

  const handleToggle = () => {
    setShow(!show);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
    document.addEventListener('mousedown', handleClickOutside);
  }
    else {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  return (
    <nav role="navigation">
      <div ref={sidebarRef} className="absolute top-12 left-12 z-0 select-none">
        <input 
          type="checkbox" 
          className="w-10 h-8 absolute flex top-0 left-0 opacity-0 z-20 cursor-pointer antialiased " 
          checked={show}
          onChange={handleToggle}
          onClick={handleToggle}
        />
       
       {/* Sidebar Logo (Hamburger) */}
        <div className="fixed flex-col z-30 cursor-pointer" onClick={handleToggle}>
          <span className="relative block w-8 h-1 mb-1 bg-gray-300 rounded transition-transform duration-450 ease-in-out"></span>
          <span className="relative block w-8 h-1 mb-1 bg-gray-300 rounded transition-transform duration-450 ease-in-out"></span>
          <span className="relative block w-8 h-1 bg-gray-300 rounded transition-transform duration-450 ease-in-out"></span>
        </div>

        {/* Sidebar Menu */}
        <ul className={`fixed top-0 left-0 px-14 py-10 flex flex-col w-64 h-full bg-teal-900 list-none transform transition-transform duration-500 ease-in-out ${show ? 'translate-x-0' : '-translate-x-full'} z-20`}>
          <li className="absolute mt-10 py-2 flex flex-col space-y-8 antialiased">
            {Links.map((item, index) => (
              <NavLink to={item.href} key={index} className="text-white">
                <div key={index} className="relative flex flex-grow-0 space-x-3 p-3 antialiased rounded-md transition-transform duration-300 ease-in-out hover:text-gray-700 hover:bg-gray-200">
                  <item.icon size={25} />
                  <span>{item?.title}</span>
                </div>
              </NavLink>
            ))}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
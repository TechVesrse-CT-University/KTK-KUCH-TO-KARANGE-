import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full p-5">
            <h2 className="text-xl font-bold mb-4">RescueGrid</h2>
            <ul>
                <li className="mb-2">
                    <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
                </li>
                <li className="mb-2">
                    <Link to="/sos-portal" className="hover:text-gray-400">SOS Portal</Link>
                </li>
                <li className="mb-2">
                    <Link to="/agency-profile" className="hover:text-gray-400">My Profile</Link>
                </li>
                <li className="mb-2">
                    <Link to="/admin" className="hover:text-gray-400">Admin Panel</Link>
                </li>
                <li className="mb-2">
                    <Link to="/map" className="hover:text-gray-400">Map View</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
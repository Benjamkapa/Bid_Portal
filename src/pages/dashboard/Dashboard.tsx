import React from 'react';
import { FaUsers, FaBuilding, FaFileContract, FaBell, FaFileAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Management */}
        <div className="bg-gray-400 shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-2"><FaUsers className="inline-block mr-2" /> User Management</h2>
          <p>Manage users, add, edit, or delete user accounts.</p>
          {/* <button className="mt-2 btn btn-primary">Manage Users</button> */}
        </div>

        {/* Company Management */}
        <div className="bg-gray-400 shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-2"><FaBuilding className="inline-block mr-2" /> Company Management</h2>
          <p>Approve, reject, or delete company registrations.</p>
          {/* <button className="mt-2 btn btn-primary">Manage Companies</button> */}
        </div>

        {/* Bid Bond Management */}
        <div className="bg-gray-400 shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-2"><FaFileContract className="inline-block mr-2" /> Bid Bond Management</h2>
          <p>Review and validate bid bonds submitted by companies.</p>
          {/* <button className="mt-2 btn btn-primary">Manage Bid Bonds</button> */}
        </div>

        {/* Tender Management */}
        <div className="bg-gray-400 shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-2"><FaFileAlt className="inline-block mr-2" /> Tender Management</h2>
          <p>Add, edit, or delete tenders.</p>
          {/* <button className="mt-2 btn btn-primary">Manage Tenders</button> */}
        </div>

        {/* Notifications */}
        <div className="bg-gray-400 shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-2"><FaBell className="inline-block mr-2" /> Notifications</h2>
          <p>View and manage notifications sent to companies and users.</p>
          {/* <button className="mt-2 btn btn-primary">View Notifications</button> */}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
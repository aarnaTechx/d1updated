import { useState } from 'react';
import { FaPen, FaClipboardList, FaCog, FaSignOutAlt, FaDashcube, FaDollarSign } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useSession, signOut } from 'next-auth/react';
const Sidebar: React.FC = () => {
  const [isEvaluationListOpen, setIsEvaluationListOpen] = useState(false);

  const toggleEvaluationList = () => {
    setIsEvaluationListOpen((prev) => !prev);
  };
  const handleLogout = async () => {
    await signOut(); // Sign out using NextAuth.js
    localStorage.setItem('userImage', '')
    window.location.href = '/login';
  };
  return (
    <aside className="w-64 bg-gray-800 text-white h-full flex flex-col">
      
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          <li className="hover:bg-gray-700 rounded transition duration-200">
            <a href="/dashboard" className="flex items-center space-x-2 p-2">
              <MdDashboard className="text-xl" />
              <span>Dashboard</span>
            </a>
          </li>
         
          <li className="hover:bg-gray-700 rounded transition duration-200">
            <a 
              href="#tab1" 
              className="flex items-center space-x-2 p-2" 
              onClick={toggleEvaluationList}
            >
              <FaClipboardList className="text-xl" />
              <span>Evaluation List</span>
            </a>
            {isEvaluationListOpen && (
              <ul className="ml-4 mt-1 space-y-1">
                <li className="hover:bg-gray-600 rounded transition duration-200">
                  <a href="/evaluations" className="flex items-center space-x-2 p-2">
                    <span>All</span>
                  </a>
                </li>
                <li className="hover:bg-gray-600 rounded transition duration-200">
                  <a href="/evaluations?status=0" className="flex items-center space-x-2 p-2">
                    <span>Requested</span>
                  </a>
                </li>
                <li className="hover:bg-gray-600 rounded transition duration-200">
                  <a href="/evaluations?status=1" className="flex items-center space-x-2 p-2">
                    <span>Accepted</span>
                  </a>
                </li>
                <li className="hover:bg-gray-600 rounded transition duration-200">
                  <a href="/evaluations?status=2" className="flex items-center space-x-2 p-2">
                    <span>Completed</span>
                  </a>
                </li>
                <li className="hover:bg-gray-600 rounded transition duration-200">
                  <a href="/evaluations?status=3" className="flex items-center space-x-2 p-2">
                    <span>Rejected</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="hover:bg-gray-700 rounded transition duration-200">
            <a href="/payment-history" className="flex items-center space-x-2 p-2">
            
              <FaDollarSign className='text-xl'/>
              <span>Payment History</span>
            </a>
          </li>
          <li className="hover:bg-gray-700 rounded transition duration-200">
            <a href="#tab4" className="flex items-center space-x-2 p-2">
              <FaCog className="text-xl" />
              <span>Settings</span>
            </a>
          </li>
          <li className="hover:bg-gray-700 rounded transition duration-200">
            <a  onClick={handleLogout} className="flex items-center space-x-2 p-2">
              <FaSignOutAlt className="text-xl" />
              <span>Sign Out</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

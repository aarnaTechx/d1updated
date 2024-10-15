// components/Sidebar.tsx
// Example icon from react-icons
import { FaPen,FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-full flex flex-col">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-700">Dashboard</h2>
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          <li className="hover:bg-gray-700 rounded transition duration-200">
            <a href="#tab1" className="flex items-center space-x-2 p-2">
              <MdDashboard className="text-xl" /> {/* Icon */}
              <span>Dashboard</span>
            </a>
          </li>
          <li className="hover:bg-gray-700 rounded transition duration-200">
            <a href="#tab1" className="flex items-center space-x-2 p-2">
              <FaPen className="text-xl" /> {/* Icon */}
              <span>Evaluation</span>
            </a>
          </li>
          
          
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

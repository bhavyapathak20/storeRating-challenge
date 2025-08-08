import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Roxiler Systems</Link>

      <ul className="flex gap-10 items-center mr-[3rem]">
        <li><Link to='/'>Home</Link></li>
        {/* ADD Dropdown */}
        <li className="relative group">
          <button
            onClick={() => {
              setOpenAdd(!openAdd);
              setOpenView(false);
            }}
            className="hover:text-gray-300"
          >
            Add ▾
          </button>

          {openAdd && (
            <ul className="absolute mt-5 right-0 bg-gray-700 rounded shadow-lg w-40 z-50">
              <li>
                <Link
                  to="/add-user"
                  className="block px-4 py-2 hover:bg-gray-600"
                  onClick={() => setOpenAdd(false)}
                >
                  Add new user
                </Link>
              </li>
              <li>
                <Link
                  to="/add-store"
                  className="block px-4 py-2 hover:bg-gray-600"
                  onClick={() => setOpenAdd(false)}
                >
                  Add new store
                </Link>
              </li>
              <li>
                <Link
                  to="/add-admin"
                  className="block px-4 py-2 hover:bg-gray-600"
                  onClick={() => setOpenAdd(false)}
                >
                  Add admin user
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* VIEW Dropdown */}
        <li className="relative group">
          <button
            onClick={() => {
              setOpenView(!openView);
              setOpenAdd(false);
            }}
            className="hover:text-gray-300"
          >
            View ▾
          </button>
          {openView && (
            <ul className="absolute top-full mt-5 right-0 bg-gray-700 rounded shadow-lg w-31 z-50">
              <li>
                <Link
                  to="/view-users"
                  className="block px-4 py-2 hover:bg-gray-600"
                  onClick={() => setOpenView(false)}
                >
                  View Users
                </Link>
              </li>
              <li>
                <Link
                  to="/view-stores"
                  className="block px-4 py-2 hover:bg-gray-600"
                  onClick={() => setOpenView(false)}
                >
                  View Stores
                </Link>
              </li>
              <li>
                <Link
                  to="/view-ratings"
                  className="block px-4 py-2 hover:bg-gray-600"
                  onClick={() => setOpenView(false)}
                >
                  View Ratings
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

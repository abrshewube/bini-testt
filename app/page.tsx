"use client";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import EmployeeTree from "./components/EmployeeTree";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/form" className="hover:text-gray-300">Employee Form</Link>
            </li>
            <li>
              <Link to="/tree" className="hover:text-gray-300">Employee Tree</Link>
            </li>
            <li>
              <Link to="/list" className="hover:text-gray-300">Employee List</Link>
            </li>
          </ul>
        </nav>
        <br /><br />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<EmployeeForm />} />
            <Route path="/form" element={<EmployeeForm />} />
            <Route path="/tree" element={<EmployeeTree />} />
            <Route path="/list" element={<EmployeeList />} />
          </Routes>
        </div>
      </div>
    </Router>
    </main>
  );
}

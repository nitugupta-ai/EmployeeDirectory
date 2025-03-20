import React, { useState, useEffect } from "react";
import API from "../services/api"; 
import './EmployeeDirectory.css'; 
const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editingId, setEditingId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(""); 

  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5); 

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await API.get("/employees"); 
      setEmployees(response.data); 
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Add a new employee
  const addEmployee = async () => {
    try {
      await API.post("/employees", { name, email, role }); 
      fetchEmployees();
      setName("");
      setEmail("");
      setRole("");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };


  const deleteEmployee = async (id) => {
    try {
      await API.delete(`/employees/${id}`); 
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };


  const editEmployee = (employee) => {
    setName(employee.name);
    setEmail(employee.email);
    setRole(employee.role);
    setEditingId(employee.id); 
  };


  const updateEmployee = async () => {
    try {
      await API.put(`/employees/${editingId}`, { name, email, role }); 
      fetchEmployees();
      setName("");
      setEmail("");
      setRole("");
      setEditingId(null); 
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); 
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination: Get current employees to display
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="employee-directory">
      <h1>Employee Directory</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange} 
        />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button onClick={editingId ? updateEmployee : addEmployee}>
          {editingId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>
                <button className="edit-btn" onClick={() => editEmployee(employee)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteEmployee(employee.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {/* Render page numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeDirectory;

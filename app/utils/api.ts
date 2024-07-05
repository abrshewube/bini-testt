// utils/api.ts

import axios from 'axios';
import { Employee } from '../utils/types';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust your server URL accordingly
});

// Fetch employees (not changed)
export const fetchEmployees = () => api.get<Employee[]>('/employees');

// Add employee with auto-incrementing id
export const addEmployeeApi = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  try {
    // Fetch the latest employees to determine the next id
    const response = await fetchEmployees();
    const employees = response.data;
    const nextId = employees.length > 0 ? employees[employees.length - 1].id + 1 : 1;

    // Create the new employee object with the generated id
    const newEmployee: Employee = {
      id: nextId,
      ...employee,
    };

    // Post the new employee to the server
    const result = await api.post<Employee>('/employees', newEmployee);
    return result.data;
  } catch (error:any) {
    throw new Error(`Failed to add employee: ${error.message}`);
  }
};

// Update employee (not changed)
export const updateEmployeeApi = (employee: Employee) => api.put<Employee>(`/employees/${employee.id}`, employee);

// Delete employee (not changed)
export const deleteEmployeeApi = (id: number) => api.delete(`/employees/${id}`);

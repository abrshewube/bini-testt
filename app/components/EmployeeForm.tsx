"use client";
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

import { Employee } from '../utils/types';
import { addEmployee, updateEmployee } from '../redux/slices/employeeSlice';
import { addEmployeeApi, updateEmployeeApi } from '../utils/api';

interface EmployeeFormProps {
  employee?: Employee;
  parentId?: number;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, parentId }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Employee>();
  const dispatch = useDispatch<AppDispatch>();

  // Set form values if editing an existing employee
  React.useEffect(() => {
    if (employee) {
      setValue('name', employee.name);
      setValue('description', employee.description || '');
    }
  }, [employee, setValue]);

  const onSubmit: SubmitHandler<Employee> = async (data) => {
    try {
      if (employee) {
        await updateEmployeeApi({ ...data, id: employee.id });
        dispatch(updateEmployee(data)); // Update locally in Redux store
      } else {
        const newEmployee = await addEmployeeApi({ ...data, parentId });
        dispatch(addEmployee(newEmployee)); // Add new employee to Redux store
      }
    } catch (error) {
      console.error('Error while adding/updating employee:', error);
      // Handle error if needed
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label htmlFor="parentId" className="block text-gray-700 font-bold mb-2">Parent ID</label>
        <input {...register("parentId", { valueAsNumber: true })} id="parentId" type="number" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none" defaultValue={parentId || ''} />
      </div>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
        <input {...register("name", { required: true })} id="name" type="text" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500" placeholder="Enter name" />
        {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
        <textarea {...register("description")} id="description" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500" placeholder="Enter description"></textarea>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">{employee ? 'Update' : 'Add'} Employee</button>
    </form>
  );
};

export default EmployeeForm;

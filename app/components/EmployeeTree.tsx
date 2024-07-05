"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchEmployeesThunk } from '../redux/slices/employeeSlice';
import { Employee } from '../utils/types';
import { Tree } from 'react-d3-tree';

const EmployeeTree: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const employees = useSelector((state: RootState) => state.employees.employees);

  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);

  // Transform employees into a tree structure that react-d3-tree can use
  const buildTreeData = (employees: Employee[]): any => {
    const treeData: any = {
      name: 'Employees',
      children: []
    };

    const idToNodeMap: { [key: number]: any } = {};

    employees.forEach(emp => {
      const shortDescription = emp.description.substring(0, 30); // Truncate description to first 100 characters
      idToNodeMap[emp.id] = { name: emp.name, attributes: { description: shortDescription } };
    });

    employees.forEach(emp => {
      // Ensure parentId is defined before accessing idToNodeMap[emp.parentId]
      if (emp.parentId !== undefined && idToNodeMap[emp.parentId]) {
        if (!idToNodeMap[emp.parentId].children) {
          idToNodeMap[emp.parentId].children = [];
        }
        idToNodeMap[emp.parentId].children.push(idToNodeMap[emp.id]);
      } else {
        treeData.children.push(idToNodeMap[emp.id]);
      }
    });

    return treeData;
  };

  const [treeData, setTreeData] = useState<any>({});

  useEffect(() => {
    if (employees.length > 0) {
      const data = buildTreeData(employees);
      setTreeData(data);
    }
  }, [employees]);

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Employee Tree</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg text-gray-700 mb-4">
            This interactive tree visualizes the employee hierarchy within your organization.
          </p>
          <div style={{ height: '500px' }}>
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: 300, y: 250 }} // Adjust the x and y coordinates to center the tree
              separation={{ siblings: 1, nonSiblings: 3 }} // Optional: Adjust spacing between nodes
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTree;

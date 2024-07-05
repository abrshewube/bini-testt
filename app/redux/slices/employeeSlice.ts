import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Employee } from '../../utils/types';

export interface EmployeeState {
  employees: Employee[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: EmployeeState = {
  employees: [],
  status: 'idle',
};

export const fetchEmployeesThunk = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await axios.get<Employee[]>('http://localhost:5000/employees');
  return response.data;
});

export const addEmployeeThunk = createAsyncThunk('employees/addEmployee', async (employee: Employee) => {
  const response = await axios.post<Employee>('http://localhost:5000/employees', employee);
  return response.data;
});

export const updateEmployeeThunk = createAsyncThunk('employees/updateEmployee', async (employee: Employee) => {
  const response = await axios.put<Employee>(`http://localhost:5000/employees/${employee.id}`, employee);
  return response.data;
});

export const deleteEmployeeThunk = createAsyncThunk('employees/deleteEmployee', async (id: number) => {
  await axios.delete(`http://localhost:5000/employees/${id}`);
  return id;
});

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action: PayloadAction<number>) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployeesThunk.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.status = 'idle';
        state.employees = action.payload;
      })
      .addCase(fetchEmployeesThunk.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(addEmployeeThunk.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action: PayloadAction<Employee>) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(deleteEmployeeThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
      });
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeeSlice.actions;

export const selectEmployees = (state: RootState) => state.employees.employees;
export const selectEmployeeById = (state: RootState, id: number) =>
  state.employees.employees.find(emp => emp.id === id);

export default employeeSlice.reducer;

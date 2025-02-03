import { createReducer, on } from "@ngrx/store";
import { employeeState } from "./Employee.State";
import { addEmployeeSuccess, deleteEmployeeSuccess, getEmployee, loadEmployeeFail, loadEmployeeSuccess, updateEmployeeSuccess } from "./Employee.Actions";

const _employeeReducer = createReducer(employeeState,
    on(loadEmployeeSuccess, (state, action) => {
        return { ...state, list: action.list, errorMessage: '' }
    }),
    on(loadEmployeeFail, (state, action) => {
        return { ...state, list: [], errorMessage: action.errorMessage }
    }),
    on(deleteEmployeeSuccess, (state, action) => {
        const newData = state.list.filter(o => o.id !== action.empId)
        return { ...state, list: newData, errorMessage: '' }
    }),
    on(addEmployeeSuccess, (state, action) => {
        const newData = { ...action.data }
        return { ...state, list: [...state.list, newData], errorMessage: '' }
    }),
    on(updateEmployeeSuccess, (state, action) => {
        const newData = state.list.map(o => { return o.id === action.data.id ? action.data : o })
        return { ...state, list: newData, errorMessage: '' }
    }),
    on(getEmployee, (state, action) => {
        let newData = state.list.find(o => { return o.id === action.empId })
        if (newData == null) {
            newData = state.empObj
        }
        return { ...state, empObj: newData }
    })
)

export function employeeReducer(state: any, action: any) {
    return _employeeReducer(state, action)
}
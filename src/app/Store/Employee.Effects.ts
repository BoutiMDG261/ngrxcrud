import { inject, Injectable } from "@angular/core";
import { EmployeeService } from "../service/employee.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addEmployee, addEmployeeSuccess, deleteEmployee, deleteEmployeeSuccess, emptyAction, loadEmployee, loadEmployeeFail, loadEmployeeSuccess, updateEmployee, updateEmployeeSuccess } from "./Employee.Actions";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable()

export class empEffect {
    // constructor(private actions$: Actions, private _empService: EmployeeService) { }
    private readonly _actions$ = inject(Actions)
    private readonly _empService = inject(EmployeeService)
    private readonly toastr = inject(ToastrService)

    _loadEmployee = createEffect(() => this._actions$.pipe(
        ofType(loadEmployee),
        exhaustMap((action) => {
            return this._empService.getAll().pipe(
                map((data) => {
                    return loadEmployeeSuccess({ list: data })
                }),
                catchError((error) => of(loadEmployeeFail({ errorMessage: error.message }))
                )
            )
        })
    ))

    _deleteEmployee = createEffect(() => this._actions$.pipe(
        ofType(deleteEmployee),
        switchMap((action) => {
            return this._empService.delete(action.empId).pipe(
                switchMap((data) => {
                    return of(deleteEmployeeSuccess({ empId: action.empId }),
                        this.showAlert('Voafafa soa aman-tsara', 'success')
                    )
                }),
                catchError((error) => of(this.showAlert(error.message, 'error'))
                )
            )
        })
    ))

    _addEmployee = createEffect(() => this._actions$.pipe(
        ofType(addEmployee),
        switchMap((action) => {
            return this._empService.create(action.data).pipe(
                switchMap((data) => {
                    return of(addEmployeeSuccess({ data: action.data }),
                        this.showAlert('Tafiditra soa aman-tsara', 'success'))
                })
            )
        })
    ))

    _updateEmployee = createEffect(() => this._actions$.pipe(
        ofType(updateEmployee),
        switchMap((action) => {
            return this._empService.update(action.data).pipe(
                switchMap((data) => {
                    return of(updateEmployeeSuccess({ data: action.data }),
                        this.showAlert('Voahova soa aman-tsara', 'success'))
                })
            )
        })
    ))

    private showAlert(message: string, response: string) {
        if (response === 'success') {
            this.toastr.success(message)
        } else {
            this.toastr.error(message)
        }
        return emptyAction()
    }
}
import { Component, inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { Employee } from '../../model/Employee';
// import { EmployeeService } from '../../service/employee.service';
import { Subscription } from 'rxjs';
import { SalaryPipe } from '../../pipe/salary.pipe';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeMg from '@angular/common/locales/mg';
import { Store } from '@ngrx/store';
import { deleteEmployee, loadEmployee } from '../../Store/Employee.Actions';
import { getEmpList } from '../../Store/Employee.Selector';

registerLocaleData(localeMg)

@Component({
  selector: 'app-employee',
  imports: [MatCardModule, MatButtonModule, MatTableModule, SalaryPipe, DatePipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'mg' } // Configurer la locale
  ]
})
export class EmployeeComponent implements OnInit, OnDestroy {
  private readonly _dialog = inject(MatDialog)
  // private readonly _serviceEmp = inject(EmployeeService)

  empList: Employee[] = []
  dataSource!: MatTableDataSource<Employee>
  displayedColumns: string[] = ['id', 'name', 'role', 'doj', 'salary', 'action']
  subscription = new Subscription()
  title = 'Manampy mpiasa'

  constructor(private _store: Store) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.getAllEmployee()
  }

  getAllEmployee() {
    // let sub = this._serviceEmp.getAll().subscribe(data => {
    //   this.empList = data
    //   this.dataSource = new MatTableDataSource(this.empList)
    //   // console.log('EmployeeComponent initialized', this.empList)
    // })
    // this.subscription.add(sub)

    this._store.dispatch(loadEmployee())
    this._store.select(getEmpList).subscribe(item => {
      this.empList = item
      this.dataSource = new MatTableDataSource(this.empList)
    })
  }

  addEmployee() {
    this.openPopup(0)
  }

  editEmployee(emp: Employee) {
    this.openPopup(emp.id)
  }

  deleteEmployee(emp: Employee) {
    if (confirm('Hanala io mpiasa io ve ianao? Roasina ve?')) {
      // let sub = this._serviceEmp.delete(emp.id).subscribe(item => {
      //   this.getAllEmployee()
      // })
      // this.subscription.add(sub)
      this._store.dispatch(deleteEmployee({ empId: emp.id }))
    }
  }

  private openPopup(empId: number) {
    this._dialog.open(AddEmployeeComponent, {
      width: '50%',
      exitAnimationDuration: '500ms',
      enterAnimationDuration: '500ms',
      data: {
        'code': empId
      }
    }).afterClosed().subscribe(res => {
      this.getAllEmployee()
    })
  }
}

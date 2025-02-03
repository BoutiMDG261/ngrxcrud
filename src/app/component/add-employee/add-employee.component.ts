import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../service/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { addEmployee, getEmployee, updateEmployee } from '../../Store/Employee.Actions';
import { selectEmployee } from '../../Store/Employee.Selector';

@Component({
  selector: 'app-add-employee',
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatIconModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent implements OnInit {

  title = "Manampy mpiasa"
  dialogData: any
  isEdit = false

  // private readonly _serviceEmp = inject(EmployeeService)
  private readonly _ref = inject(MatDialogRef<AddEmployeeComponent>)
  // private readonly _toastr = inject(ToastrService)

  empForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    doj: new FormControl(new Date(), Validators.required),
    role: new FormControl('', Validators.required),
    salary: new FormControl(0, Validators.required)
  })

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private _store: Store) { }

  ngOnInit(): void {

    this.dialogData = this.data

    if (this.dialogData.code > 0) {
      this.title = 'Hanova mombana mpiasa'
      this.isEdit = true
      // this._serviceEmp.get(this.dialogData.code).subscribe(res => {
      //   let data = res

      //   if (data != null) {
      //     this.empForm.setValue({
      //       id: data.id,
      //       name: data.name,
      //       doj: data.doj,
      //       role: data.role,
      //       salary: data.salary
      //     })
      //   }
      // })

      this._store.dispatch(getEmployee({ empId: this.dialogData.code }))
      this._store.select(selectEmployee).subscribe(res => {
        let data = res

        if (data != null) {
          this.empForm.setValue({
            id: data.id,
            name: data.name,
            doj: data.doj,
            role: data.role,
            salary: data.salary
          })
        }
      })
    }
  }

  saveEmployee() {
    if (this.empForm.valid) {
      let data: Employee = {
        id: this.empForm.value.id as number,
        name: this.empForm.value.name as string,
        doj: new Date(this.empForm.value.doj as Date),
        role: this.empForm.value.role as string,
        salary: this.empForm.value.salary as number
      }

      if (this.isEdit) {
        // this._serviceEmp.update(data).subscribe(item => {
        //   this._toastr.success('Tafiditra soamantsara', 'Vita ny fanovana'),
        //     this.closePopup()
        // })
        this._store.dispatch(updateEmployee({ data: data }))
      } else {
        // this._serviceEmp.create(data).subscribe(item => {
        //   this._toastr.success('Tafiditra soamantsara', 'Mpiasa vaovao'),
        //     this.closePopup()
        // })
        this._store.dispatch(addEmployee({ data: data }))
      }
      this.closePopup()
    }
  }

  closePopup() { this._ref.close() }
}

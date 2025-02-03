import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../model/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  apiUrl = 'http://localhost:3000/employee'

  private readonly _http = inject(HttpClient)

  getAll() {
    return this._http.get<Employee[]>(this.apiUrl)
  }

  get(empId: number) {
    return this._http.get<Employee>(this.apiUrl + '/' + empId)
  }

  create(data: Employee) {
    return this._http.post(this.apiUrl, data)
  }

  update(data: Employee) {
    return this._http.put(this.apiUrl + '/' + data.id, data)
  }

  delete(empId: number) {
    return this._http.delete(this.apiUrl + '/' + empId)
  }
}

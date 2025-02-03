import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./component/employee/employee.component').then(m => m.EmployeeComponent)
    }
];

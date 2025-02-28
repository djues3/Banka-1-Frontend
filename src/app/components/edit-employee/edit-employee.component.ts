import {Component, OnInit} from '@angular/core';
import {Employee, UserService} from "../../services/user.service";
import {ModalService} from "../../services/modal.service";


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent{
  isOpen = false;
  employee: Employee | null = null;
  selectedPermissions: string[] = [];
  availablePermissions: string[] = ['user.employee.create', 'user.customer.create', 'user.employee.edit', 'user.customer.edit', 'user.employee.delete', 'user.ustomer.delete','user.employee.list', 'user.customer.list', 'user.employee.set_permissions', 'user.customer.set_permissions', 'user.employee.view', 'user.customer.view'];
  newPermission: string = '';
  originalPermissions:string[] = [];
  updatedEmployee: Employee | null = null;
  updatedEmployeeFields: Partial<typeof this.employee> = {};

  positionOptions: string[] = ['Nijedna', 'Direktor', 'Radnik', 'HR', 'Menadžer'];
  departmentOptions: string[] = ['Računovodstvo', 'Finansije', 'Kredit', 'Pravo', 'IT', 'HR'];
  chosenPosition: string = ""
  chosenDepartment: string = ""


  constructor(private userService: UserService,private modalService: ModalService) {

    this.modalService.modalState$.subscribe((state) => {
      this.isOpen = state.isOpen && state.type === 'employee';
      this.employee = state.data as Employee;
      if (this.employee) { // Check if employee exists before accessing properties
        this.updatedEmployee = structuredClone(this.employee);
        this.selectedPermissions = structuredClone(this.employee.permissions ?? []); // Use optional chaining and default empty array
        this.updatedEmployeeFields = {};
        this.originalPermissions = structuredClone(this.selectedPermissions);
        this.updatedEmployee!.position = this.mapPosition(this.updatedEmployee!.position)
        this.updatedEmployee!.department = this.mapDepartment(this.updatedEmployee!.department)
      } else {
        this.selectedPermissions = []; // Ensure it's initialized to prevent errors
        this.originalPermissions = [];
      }

      console.log(this.chosenPosition)
    });

  }

  mapPosition(role: string): string{

    const roleMapper: Record<string, string> = {
      "NONE": "Nijedna",
      "DIRECTOR": "Direktor",
      "MANAGER": "Menadžer",
      "WORKER": "Radnik",
      "HR": "HR"
    };

    return roleMapper[role] || role;
  }
  mapDepartment(role: string): string{

    const roleMapper: Record<string, string> = {
      "ACCOUNTING": "Računovodstvo",
      "FINANCIAL": "Finansije",
      "CREDIT": "Kredit",
      "LEGAL": "Pravo",
      "HR": "HR",
      "IT": "IT"
    };

    return roleMapper[role] || role;
  }

  trackEmployeeChanges() {
    this.updatedEmployeeFields = {};

    if (!this.employee || !this.updatedEmployee) {
      console.warn('Customer or updatedClient is null'); // Debugging
      return; // Stop execution if either is null
    }


    Object.keys(this.employee).forEach((key) => {
      const originalValue = (this.employee as Record<string, any>)[key];
      const updatedValue = (this.updatedEmployee as Record<string, any>)[key];

      if (originalValue !== updatedValue) {
        (this.updatedEmployeeFields as Record<string, any>)[key] = updatedValue;
      }
    });
  }

  updateEmployee(){
    let permissions;

    const arraysAreEqual = (arr1: any[], arr2: any[]): boolean => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((value, index) => value === arr2[index]);
    };

    if (!this.updatedEmployeeFields) {
      console.warn('updatedEmployeeFieldsis null');
      return;
    }

    if (Object.keys(this.updatedEmployeeFields).length === 0 && arraysAreEqual(this.selectedPermissions, this.originalPermissions) ) {
      console.log("No changes detected");
      this.closeModal()
    }

    permissions = this.selectedPermissions;

    if(this.employee == null) return;
    console.log(this.updatedEmployeeFields)
    this.userService.updateEmployee(this.employee.id, this.updatedEmployeeFields).subscribe({
      next: () => {
        alert('Employee updated sucessfully');
        this.closeModal()
      },
      error: (error) => {
        console.error('Error updating employee', error);
    },
    });


    if(!arraysAreEqual(this.selectedPermissions, this.originalPermissions)) {
      this.userService.updateEmployeePermissions(this.employee.id, permissions).subscribe({
        next:()=>{
          alert('Employee permissions updated sucessfully');
        },
        error:(error) => {
          console.error('Error updating employee permissions', error);
        },
      });
    }

  }


  addPermission() {
    if (this.newPermission && !this.selectedPermissions.includes(this.newPermission)) {
      this.selectedPermissions.push(this.newPermission);
    }
    this.newPermission = '';
  }

  removePermission(permission: string) {
    this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
  }

  closeModal() {
    this.modalService.closeModal();
    window.location.reload()
  }
}

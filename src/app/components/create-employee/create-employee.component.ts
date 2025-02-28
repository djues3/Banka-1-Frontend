import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import { UserService } from '../../services/user.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent {
  employee = {
    firstName: '',
    lastName: '',
    birthDate: '',
    username: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
    active: true
  };
  @Output() employeeCreated: EventEmitter<void> = new EventEmitter<void>();
  @Input() isModalOpen: boolean = false;
  @Output() modalClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  positionOptions: string[] = ['Nijedna', 'Direktor', 'Radnik', 'HR', 'Menadžer'];
  departmentOptions: string[] = ['Računovodstvo', 'Finansije', 'Kredit', 'Pravo', 'IT', 'HR'];
  chosenPosition: string = ""
  chosenDepartment: string = ""
  constructor(private userService: UserService) {

  }


  onSubmit(employeeForm: any): void {
    if (employeeForm.valid) {
      const formattedBirthDate = this.employee.birthDate
        ? formatDate(this.employee.birthDate, 'yyyy-MM-dd', 'en-US')
        : null;

      const requestBody = {
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        birthDate: this.convertToLong(this.employee.birthDate),
        gender: this.employee.gender === 'F' ? 'FEMALE' : 'MALE',
        email: this.employee.email,
        phoneNumber: this.employee.phone,
        address: this.employee.address,
        username: this.employee.username,
        password: null,
        position: this.chosenPosition,
        department: this.chosenDepartment,
        active: this.employee.active
      };

      this.userService.createEmployee(requestBody).subscribe({
        next: (response) => {
          console.log('Zaposleni uspešno kreiran:', response);
          alert('Zaposleni uspešno kreiran!');
          this.employeeCreated.emit();

          this.onCancel();

        },
        error: (error) => {
          console.error('Greška prilikom kreiranja zaposlenog:', error);
          alert('Došlo je do greške pri kreiranju zaposlenog.');
        }
      });
    } else {
      alert('Molimo vas da popunite sva obavezna polja!');
    }
  }

  //kovertuje string datum u long
  convertToLong(dateString: string): number {
    return parseInt(dateString.replace(/-/g, ""), 10);
  }
  onCancel(): void {
    this.modalClosed.emit(false);
  }

}

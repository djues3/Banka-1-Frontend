import { Component, OnInit } from '@angular/core';
import {Customer, Employee, UserService} from "../services/user.service";
import {ModalService} from "../services/modal.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit {
  employees: Employee[] = [];
  customers: Customer[] = [];
  displayedData: (Employee | Customer)[] = [];
  searchQuery: string = '';
  activeCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private userService: UserService, private authService: AuthService, private modalService: ModalService, private ruter:Router) {

    this.activeCategory = '';
    this.displayedData = this.employees;
    // this.calculatePagination();

  }

  ngOnInit() {

  }



  changeCategory(category: string) {
    this.activeCategory = category;
    this.calculatePagination();
  }

  calculatePagination() {
    const data = this.activeCategory === 'employees' ? this.employees : this.customers;
    this.totalItems = data.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedData = this.activeCategory === 'employees'
      ? this.employees.slice(start, end)
      : this.customers.slice(start, end);
  }

// Metoda za menjanje aktivne kategorije
  setActiveCategory(category: string): void {
    this.activeCategory = category;
    this.currentPage = 1;
  }

  openModal(person: Employee | Customer) {
    if (this.isEmployee(person)) {
      this.modalService.openModal('employee', person);
    } else if (this.isCustomer(person)) {
      this.modalService.openModal('customer', person);
    } else {
      console.error('Unknown type:', person);
    }
  }

  private isEmployee(person: Employee | Customer): person is Employee {
    return (person as Employee).username !== undefined;
  }

  private isCustomer(person: Employee | Customer): person is Customer {
    return (person as Customer).povezaniRacuni !== undefined;
  }

}

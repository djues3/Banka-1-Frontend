import {Component, OnInit} from '@angular/core';
import { Customer, UserService } from "../../services/user.service";
import { ModalService } from "../../services/modal.service";

@Component({
  selector: 'app-table-customers',
  templateUrl: './table-customers.component.html',
  styleUrls: ['./table-customers.component.css']
})
export class TableCustomersComponent implements OnInit {

  hasCreateCustomerPermission: boolean = true; // Postaviti na false kada se doda autentifikacija
  isCustomerModalOpen: boolean = false;
  customers: Customer[] = [];
  searchQuery: string = '';
  displayedData: Customer[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private userService: UserService, private modalService: ModalService) {
    this.displayedData = this.customers;
    this.calculatePagination();
  }

  ngOnInit() {
    this.loadCustomers();
  }


  loadCustomers() {
    this.userService.fetchCustomers().subscribe({
      next: (data) => {
        this.customers = data.customers;
        this.totalItems = data.total;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.displayedData = this.customers;
      },
      error: (error) => {
        console.error('Error fetching customers:', error);
      },
    });
  }

  // Računa i refreshuje paginaciju
  calculatePagination() {
    this.totalItems = this.customers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData();
  }

  // Refreshuje prikazane podatke na osnovu paginacije
  updateDisplayedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedData = this.customers.slice(start, start + this.itemsPerPage);
  }

  // Filtrira mušterije prema pretrazi
  filterData(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.displayedData = this.customers.filter(customer =>
      customer.firstName.toLowerCase().includes(searchTerm) ||
      customer.lastName.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.phoneNumber.toLowerCase().includes(searchTerm)
    );
  }

  // Otvara modal za uređivanje mušterije
  editPerson(customer: Customer) {
    this.modalService.openModal('customer', customer);
  }

  // Briše mušteriju
  deletePerson(customer: Customer) {
    if (confirm(`Da li ste sigurni da želite da obrišete mušteriju ${customer.firstName} ${customer.lastName}?`)) {
      this.userService.deleteCustumer(customer.id).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== customer.id);
          this.updateDisplayedData();
        },
        error: (error) => console.error('Greška pri brisanju mušterije:', error),
      });
    }
  }

  // Kretanje  između stranica
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  // Otvaranje/Zatvaranje modala za kreiranje mušterije
  openCustomerModal() { this.isCustomerModalOpen = true; }
  closeCustomerModal() { this.isCustomerModalOpen = false; }
}

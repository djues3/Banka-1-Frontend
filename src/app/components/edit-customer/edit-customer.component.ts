import {Component, OnInit} from '@angular/core';
import {Customer, UserService} from "../../services/user.service";
import {ModalService} from "../../services/modal.service";


@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent{
  isOpen = false;
  customer: Customer | null = null;
  isAccountModalOpen: boolean = false
  selectedAccount: string = '';
  newAccount: string = '';
  updatedClient: Customer | null = null;
  updatedCostumerFields: Partial<typeof this.customer> = {};

  constructor(private modalService: ModalService, private userService: UserService) {
    this.modalService.modalState$.subscribe((state) => {
      this.isOpen = state.isOpen && state.type === 'customer';
      this.customer = state.data as Customer;
      this.updatedClient = structuredClone(this.customer);
      if (this.updatedClient && this.updatedClient.birthDate) {
        this.updatedClient.birthDate = this.convertYYYYMMDDtoDDMMYYYY(this.updatedClient.birthDate.toString());
      }
      this.updatedCostumerFields = {};
    });
  }

  convertYYYYMMDDtoDDMMYYYY(dateString: string): string {
    if (dateString.length !== 8) {
      return dateString; // Ako nije u očekivanom formatu, vrati originalnu vrednost
    }

    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    return `${day}/${month}/${year}`;
  }

  convertDDMMYYYYtoYYYYMMDD(dateString: string): string {
    const parts = dateString.split('/');

    if (parts.length !== 3) {
      return dateString; // Ako format nije ispravan, vrati originalni string
    }

    const day = parts[0].padStart(2, '0'); // Osiguraj da dan ima 2 cifre
    const month = parts[1].padStart(2, '0'); // Osiguraj da mesec ima 2 cifre
    const year = parts[2];

    return `${year}${month}${day}`;
  }
  trackCustomerChanges() {
    this.updatedCostumerFields = {};

    if (!this.customer || !this.updatedClient) {
      console.warn('Customer or updatedClient is null'); // Debugging
      return; // Stop execution if either is null
    }

    Object.keys(this.customer).forEach((key) => {
      const originalValue = (this.customer as Record<string, any>)[key];
      const updatedValue = (this.updatedClient as Record<string, any>)[key];

      if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
        if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
          (this.updatedCostumerFields as Record<string, any>)[key] = [...updatedValue];
        }
      } else if (originalValue !== updatedValue) {
        (this.updatedCostumerFields as Record<string, any>)[key] = updatedValue;
      }
    });
  }

  updateCustomer(){

    if(this.customer == null || this.updatedCostumerFields == null) return;

    if(Object.keys(this.updatedCostumerFields).length != 0) {

      if(this.updatedCostumerFields.birthDate)
      this.updatedCostumerFields.birthDate = this.convertDDMMYYYYtoYYYYMMDD(this.updatedCostumerFields.birthDate)

      const translationMap: Record<string, string> = {
        "firstName": "ime",
        "lastName": "prezime",
        "birthDate": "datum_rodjenja",
        "gender": "pol",
        "email": "email",
        "phoneNumber": "broj_telefona",
        "address": "adresa",
      };

      const translatedFields: Record<string, any> = {};

      Object.keys(this.updatedCostumerFields).forEach((key) => {
        const typedKey = key as keyof Customer; // Konvertujemo ključ u keyof Customer
        const translatedKey = translationMap[typedKey] || key; // Ako ključ nije u mapi, ostavi ga nepromenjenog
        // @ts-ignore
        translatedFields[translatedKey] = this.updatedCostumerFields[typedKey];
      });


      console.log(translatedFields);
    this.userService.updateCustomer(this.customer.id, translatedFields).subscribe({
      next: () => {
        alert('Client updated sucessfully');
        this.closeModal()
      },
      error: (error) => {
        console.error('Error updating client', error);
    },
    });
    }
  }

  // addAccount(){
  //   if(this.newAccount && !this.updatedClient.povezaniRacuni.includes(this.newAccount)){
  //     this.updatedClient.povezaniRacuni.push(this.newAccount);
  //     this.newAccount = ''
  //     this.closeAccountModal()
  //     this.trackCustomerChanges();
  //   }else{
  //     alert("Taj nalog vec postji.")
  //   }
  // }
  //
  // removeAccount() {
  //   if (confirm("Da li ste sigurni da zelite da obrisete racun " + this.selectedAccount +"?")) {
  //     this.updatedClient.povezaniRacuni = this.updatedClient.povezaniRacuni.filter((account: string) => account !== this.selectedAccount);
  //     this.trackCustomerChanges();
  //   } else {
  //     console.log("Action canceled.");
  //   }
  // }
  openAccountModal() {
    this.isAccountModalOpen = true;
  }

  closeAccountModal() {
    this.isAccountModalOpen = false;
  }

  closeModal() {
    this.modalService.closeModal();
    window.location.reload()
  }
}

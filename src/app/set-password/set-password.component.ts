import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  private apiUrl = `${environment.api}`;
  passwordForm: FormGroup;
  submitted = false;
  token: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d).*$/)
      ]],
      confirmPassword: ['']
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      alert('❌ Token nije pronađen! Povratak na početnu stranicu.');
      this.router.navigate(['/']);
    }
  }

  passwordsMatch(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {

    this.submitted = true;
    this.errorMessage = null;

    if (this.passwordForm.valid && this.token) {

      this.isLoading = true;

      const payload = {
        code: this.token,
        password: this.passwordForm.value.password
      };


      this.http.post(`${this.apiUrl}/api/set-password`, payload).subscribe({
        next: () => {
          console.log("✅ API uspešno odgovorio!");
          alert('✔️ Lozinka uspešno postavljena!');
          this.router.navigate(['/login']).then(r => {});
        },
        error: (error) => {
          console.error(" Greška sa API-ja:", error);
          this.errorMessage = error.error?.message || 'Došlo je do greške prilikom postavljanja lozinke.';
        },
        complete: () => {
          console.log("✅ Završeno slanje zahteva.");
          this.isLoading = false;
        }
      });
    } else {
    }
  }
}

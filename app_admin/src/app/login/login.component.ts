import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Variables
  public formError: string = '';
  submitted = false;
  credentials = {
    name: '',
    email: '',
    password: ''
  };

  // Constructor with Router and AuthenticationService
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    
  }

  // Called when user clicks the login button
  public onLoginSubmit(): void {
    this.formError = '';

    // Validate all fields
    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      this.router.navigateByUrl('#'); // Stay on login page
    } else {
      this.doLogin();
    }
  }

  // Handles login logic and redirect
  private doLogin(): void {
    const newUser: User = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    // Call AuthenticationService login method
    this.authenticationService.login(newUser, this.credentials.password);

    // Check if login was successful
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['trip-list']); // Redirect to trip-list
    } else {
      // Retry after a short delay to handle async issues
      setTimeout(() => {
        if (this.authenticationService.isLoggedIn()) {
          this.router.navigate(['trip-list']);
        }
      }, 3000);
    }
  }

}
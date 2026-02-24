import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})

export class EditTripComponent implements OnInit {

  // Reactive form object used to manage form controls
  public editForm!: FormGroup;

  // Holds the retrieved trip data from the backend
  trip!: Trip;

  // Tracks whether the form has been submitted
  submitted = false;

  // Stores status or error messages
  message: string = '';

  constructor(
    // Used to build the reactive form
    private formBuilder: FormBuilder,

    // Used to navigate between routes
    private router: Router,

    // Service used to communicate with backend API
    private tripDataService: TripDataService
  ) {}

  // Custom validator enforcing uppercase alphanumeric pattern
  uppercaseAlphanumeric(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[A-Z0-9]+$/;
    if (!control.value) return null;
    return pattern.test(control.value) ? null : { uppercaseAlphanumeric: true };
  }

  // ngOnInit runs automatically when the component loads
  ngOnInit(): void {

    // Retrieve previously stored tripCode from localStorage
    let tripCode = localStorage.getItem("tripCode");

    // If no tripCode is found, redirect to home
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripCode: ' + tripCode);

    // Build the reactive form and apply required validators
    this.editForm = this.formBuilder.group({
      _id: [], // MongoDB document ID
      code: [tripCode, [Validators.required, this.uppercaseAlphanumeric]],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Call service to retrieve existing trip record from backend
    this.tripDataService.getTrip(tripCode)
      .subscribe({
        next: (value: Trip | null) => {

          if (!value) {
            this.message = 'No Trip Retrieved!';
            return;
          }

          // Normalize date format for HTML date input
          const formattedTrip = {
            ...value,
            start: value.start
              ? new Date(value.start).toISOString().slice(0, 10)
              : ''
          };

          // Store returned trip data
          this.trip = value;

          // Populate form fields with retrieved data
          this.editForm.patchValue(formattedTrip);

          this.message = 'Trip: ' + tripCode + ' retrieved';
          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
          this.message = 'Error retrieving trip.';
        }
      });
  }

  // Executes when user submits the edit form
  public onSubmit(): void {

    // Mark form as submitted
    this.submitted = true;

    // Only proceed if form passes validation
    if (this.editForm.valid) {

      // Call service to update trip record in database
      this.tripDataService.updateTrip(this.editForm.value)
        .subscribe({
          next: (value: any) => {

            if (!value) {
              this.message = 'Update failed.';
              return;
            }

            console.log(value);

            // After successful update, navigate back to main admin page
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
            this.message = 'Error updating trip.';
          }
        });
    }
  }

  // Convenience getter to easily access form controls in template
  get f() {
    return this.editForm.controls;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from '../trip-card/trip-card.component';

import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrls: ['./trip-listing.component.css'],
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {

  trips: Trip[] = [];
  message: string = '';

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    console.log('TripListingComponent constructor');
  }

  // Check if user is logged in
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  // Navigate to Add Trip page if logged in
  public addTrip(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['add-trip']);
    } else {
      console.log('User must be logged in to add a trip.');
    }
  }

  // Fetch trips from the backend service
  private loadTrips(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (trips: Trip[]) => {
          this.trips = trips;
          this.message = trips.length > 0
            ? `There are ${trips.length} trips available.`
            : 'There were no trips retrieved from the database.';
          console.log(this.message);
        },
        error: (err: any) => {
          console.error('Error fetching trips:', err);
          this.message = 'Failed to retrieve trips from the database.';
        }
      });
  }

  ngOnInit(): void {
    console.log('TripListingComponent ngOnInit');
    this.loadTrips();
  }
}
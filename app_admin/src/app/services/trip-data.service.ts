import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  // Base API URL 
  private readonly tripsApi = 'http://localhost:3000/api/trips';
  private readonly apiBase = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // Get all trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsApi)
      .pipe(
        catchError(err => {
          console.error('Error loading trips', err);
          return of([]); // fallback empty array
        })
      );
  }

  // Add a new trip
  addTrip(formData: Trip): Observable<Trip | null> {
    return this.http.post<Trip>(this.tripsApi, formData)
      .pipe(
        catchError(err => {
          console.error('Error adding trip', err);
          return of(null); // fallback null
        })
      );
  }

  // Get a single trip
  getTrip(tripCode: string): Observable<Trip | null> {
    return this.http.get<Trip>(`${this.tripsApi}/${tripCode}`)
      .pipe(
        catchError(err => {
          console.error(`Error loading trip ${tripCode}`, err);
          return of(null);
        })
      );
  }

  // Update a trip
  updateTrip(formData: Trip): Observable<Trip | null> {
    return this.http.put<Trip>(`${this.tripsApi}/${formData.code}`, formData)
      .pipe(
        catchError(err => {
          console.error(`Error updating trip ${formData.code}`, err);
          return of(null);
        })
      );
  }

  // Call to /login endpoint, returns JWT
  login(user: User, passwd: string): Observable<AuthResponse | null> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to /register endpoint, creates user and returns JWT
  register(user: User, passwd: string): Observable<AuthResponse | null> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Helper method for login/register
  private handleAuthAPICall(
    endpoint: string,
    user: User,
    passwd: string
  ): Observable<AuthResponse | null> {

    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(
      `${this.apiBase}/${endpoint}`,
      formData
    ).pipe(
      catchError(err => {
        console.error(`Error on ${endpoint}`, err);
        return of(null); // fallback null
      })
    );
  }
}

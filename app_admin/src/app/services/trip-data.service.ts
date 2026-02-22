import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  // Base API URL 
  baseUrl = 'http://localhost:3000/api';

  // Existing trips endpoint
  url = this.baseUrl + '/trips';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  getTrips(): Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip): Observable<Trip> {
    // console.log('Inside TripDataService::addTrip');
    return this.http.post<Trip>(this.url, formData);
  }

  getTrip(tripCode: string): Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrip');
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }

  updateTrip(formData: Trip): Observable<Trip> {
    // console.log('Inside TripDataService::updateTrip');
    return this.http.put<Trip>(this.url + '/' + formData.code, formData);
  }

  // Call to /login endpoint, returns JWT
  login(user: User, passwd: string): Observable<AuthResponse> {
    // console.log('Inside TripDataService::login');
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to /register endpoint, creates user and returns JWT
  register(user: User, passwd: string): Observable<AuthResponse> {
    // console.log('Inside TripDataService::register');
    return this.handleAuthAPICall('register', user, passwd);
  }

  // helper method to process both login and register methods
  handleAuthAPICall(
    endpoint: string,
    user: User,
    passwd: string
  ): Observable<AuthResponse> {

    // console.log('Inside TripDataService::handleAuthAPICall');

    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(
      this.baseUrl + '/' + endpoint,
      formData
    );
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userEmail: string | null = null;

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    console.log(this.userEmail)
  }

  logout() {
    this.authService.logout();
    this.userEmail = null;
  }
}


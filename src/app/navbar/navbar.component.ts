import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userData: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userData = this.authService.getUserData().subscribe( (res) => {
      console.log(this.userData = res);
    }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-adminsidebar',
  templateUrl: './adminsidebar.component.html',
  styleUrls: ['./adminsidebar.component.css']
})
export class AdminsidebarComponent {
  
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

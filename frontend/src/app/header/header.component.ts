import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { authDao } from 'src/shared/services/auth-dao.service';
import { UserService } from 'src/shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private loggedInSub: Subscription;

  constructor(private userService: UserService, private authDao: authDao, private router: Router) { }

  ngOnInit(): void {
    this.handleSubscriptions();

    // Perform login check
    this.userService.updateLoginStatus();
  }

  ngOnDestroy(): void {
    this.loggedInSub.unsubscribe();
  }

  handleSubscriptions(): void {
    this.loggedInSub = this.userService.isLoggedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.isAdmin = this.userService.isAdmin();
    });
  }

  onLogout(): void {
    this.authDao.logout()
    .subscribe({
      next: () => {
        this.userService.updateLoginStatus();
        
        this.router.navigate(['/']);
      },
      error: err => this.userService.updateLoginStatus()
    });
  }

  openMenu(): void {
    const links = document.getElementById('burger-links');

    if (links.className === "visible") {
      links.className = "invisible";

      return;
    }
    
    links.className = "visible";
  }

}

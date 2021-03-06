import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { authDao } from "src/shared/services/auth-dao.service";
import { UserService } from "src/shared/services/user.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    isLoginMode: boolean = true;
    notificationMessage: string = null;

    constructor(private authDao: authDao, private userService: UserService, private router: Router) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (this.isLoginMode) {
            this.performLogin(form);
            return;
        }

        this.performSignUp(form);
    }

    performSignUp(form: NgForm) {
        const userInfo = form.value;

        this.authDao.signup(userInfo.email, userInfo.password)
        .subscribe({
            next: response => this.notificationMessage = response.message,
            error: err => this.notificationMessage = err.error.message,
            complete: () => form.reset()
        })
    }

    performLogin(form: NgForm) {
        const userInfo = form.value;

        this.authDao.login(userInfo.email, userInfo.password)
        .subscribe({
            next: response => {
                this.userService.updateLoginStatus();

                this.router.navigate(['/store']);
            },
            error: err => this.notificationMessage = err.error.message,
            complete: () => form.reset()
        });
    }
}
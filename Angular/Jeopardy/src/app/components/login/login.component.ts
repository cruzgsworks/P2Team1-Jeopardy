import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // player data to be submitted
  loginPlayerData: any = {};

  // for manipulating elements in page
  loginData = {
    hideSubmitText: false,
    hideSubmitLoading: true,
    disableSubmit: false,
    hideSuccessStatus: true,
    hideFailStatus: true,
    successStatusMessage: '',
    failStatusMessage: '',
  };

  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit(): void {}

  loginPlayer() {
    const formElem = document.querySelectorAll('form');
    formElem.forEach((element) => {
      if (element.checkValidity()) {
        this.loginData.hideSubmitText = true;
        this.loginData.hideSubmitLoading = false;
        this.loginData.disableSubmit = true;
        this.loginData.hideSuccessStatus = true;
        this.loginData.hideFailStatus = true;
        this._auth.loginPlayer(this.loginPlayerData).subscribe({
          next: (data) => {
            this.loginData.hideSubmitText = false;
            this.loginData.hideSubmitLoading = true;
            this.loginData.disableSubmit = false;
            this.loginData.hideSuccessStatus = false;
            const curPlayer = data.statusObject;
            this.loginData.successStatusMessage = 'Welcome ' + curPlayer.playerFirstname + ' ' + curPlayer.playerLastname + '!';
            // redirect to login route upon successful registration
            setTimeout(() => {
              this._router.navigate(['/']);
            }, 1000);
          },
          error: (err) => {
            const data = err.error;
            this.loginData.hideSubmitText = false;
            this.loginData.hideSubmitLoading = true;
            this.loginData.disableSubmit = false;
            this.loginData.hideFailStatus = false;
            if (data.statusMessage != undefined) {
              this.loginData.failStatusMessage = data.statusMessage;
            } else {
              this.loginData.failStatusMessage =
                "Couldn't login. Make sure server is running.";
            }
          },
        });
      }
      element.classList.add('was-validated');
    });
  }
}

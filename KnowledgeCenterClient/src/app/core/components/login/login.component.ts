import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TooltipService } from 'src/app/shared/services/tooltip.service';
import { Tokens } from 'src/app/shared/models/Tokens';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    @ViewChild('justSignedIn', { static: true })
    public justSignedInTemplate: TemplateRef<any>;

    @ViewChild('accountActivated', { static: true })
    public accountActivatedTemplate: TemplateRef<any>;

    public loginForm: FormGroup;

    public returnUrl: string;

    constructor(
      private authService: AuthService,
      private tokenService: TokenService,
      private router: Router,
      private route: ActivatedRoute,
      private tooltipService: TooltipService,
      private formBuilder: FormBuilder,
      private userService: UserService) {
        this.returnUrl = '/';
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            login: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });

        this.route.queryParams.subscribe(params => {
            if (!!params.justSignedIn) {
                this.tooltipService.info(this.justSignedInTemplate);
            } else if (!!params.token) {
                this.userService.activate(params.token).subscribe(login => {
                    this.loginForm.patchValue({ login });
                    this.tooltipService.info(this.accountActivatedTemplate);
                });
            }
            // get return url from route parameters
            if (params.returnUrl !== undefined) {
                this.returnUrl = params.returnUrl;
            }
        });
    }

    public login(): void {
        this.authService.login(this.loginForm.getRawValue())
            .subscribe((tokens: Tokens) => {
                this.tokenService.setTokens(tokens);
                // login successful so redirect to return url
                this.router.navigateByUrl(this.returnUrl);
            }, () => {
                this.loginForm.patchValue({
                    password: ''
                });
            });
    }

}

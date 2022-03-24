import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RecaptchaFormsModule, RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { HttpListenerService } from './services/http-listener.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TryReconnectDialogComponent } from './components/reconnect/try-reconnect-dialog.component';
import { AuthService } from './services/auth.service';
import { MomentUtcDateAdapter } from './helpers/MomentUtcDateAdapter';
import { SnackbarTemplateComponent } from './components/snackbar-template/snackbar-template.component';
import { environment } from 'src/environments/environment';
import { AccountComponent } from './components/account/account.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { OrderByStringPipe } from './pipes/order-by.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TruncateComponent } from './components/truncate/truncate.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { RecaptchaComponent } from './components/recaptcha/recaptcha.component';
import { ShareButtonComponent } from './components/share-button/share-button.component';
import { KcWysiwygComponent } from './components/kc-wysiwyg/kc-wysiwyg.component';
import { HasOneRolesOfDirective } from './directives/HasOneOfRolesDirective';
import { SocketStatusComponent } from './components/socket-status/socket-status.component';
import { GravatarDirective } from './directives/GravatarDirective';

export const DATE_FORMAT = {
    parse: {
        dateInput: 'll',
    },
    display: {
        dateInput: 'll',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'll',
        monthYearA11yLabel: 'MMM YYYY',
    },
};

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        MatDividerModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        MatTooltipModule,
        RecaptchaModule,
        RecaptchaFormsModule
    ],
    declarations: [
        TryReconnectDialogComponent,
        SnackbarTemplateComponent,
        DeleteDialogComponent,
        AccountComponent,
        OrderByStringPipe,
        TruncatePipe,
        TruncateComponent,
        StarRatingComponent,
        RecaptchaComponent,
        ShareButtonComponent,
        KcWysiwygComponent,
        HasOneRolesOfDirective,
        SocketStatusComponent,
        GravatarDirective
    ],
    entryComponents: [
        TryReconnectDialogComponent,
        SnackbarTemplateComponent,
        AccountComponent
    ],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatTableModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatNativeDateModule,
        MatTabsModule,
        MatIconModule,
        MatSliderModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        MatDividerModule,
        MatListModule,
        MatSortModule,
        MatExpansionModule,
        MatRadioModule,
        MatStepperModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatChipsModule,
        MatButtonToggleModule,
        MatBottomSheetModule,
        MatSidenavModule,
        MatRippleModule,
        MatSlideToggleModule,

        DragDropModule,
        InfiniteScrollModule,

        ReactiveFormsModule,
        HttpClientModule,
        OrderByStringPipe,
        TruncateComponent,
        StarRatingComponent,
        RecaptchaComponent,
        ShareButtonComponent,
        KcWysiwygComponent,
        HasOneRolesOfDirective,
        SocketStatusComponent,
        GravatarDirective
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpListenerService,
            multi: true
        },
        { provide: DateAdapter, useClass: MomentUtcDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
        { provide: 'STARTPOINT_API_URL', useValue: environment.startPointApiUrl },
        { provide: 'DEVELOPER_CONFIG_ENABLED', useValue: environment.developerConfigurationEnabled },
        { provide: 'ENVIRONMENT', useValue: environment.environment },
        { provide: 'RECAPTCHA', useValue: environment.recaptchaToken },
        { provide: 'ANIMATION', useValue: environment.enableAnimations },
        { provide: 'SNACK_DEFAULT_DURATION', useValue: environment.snackBarDefaultDuration },
        { provide: 'WEB_SOCKETS_ENABLED', useValue: environment.enableWebSockets },
        { provide: RECAPTCHA_LANGUAGE, useValue: 'en' },
        AuthService
    ]
})
export class SharedModule { }

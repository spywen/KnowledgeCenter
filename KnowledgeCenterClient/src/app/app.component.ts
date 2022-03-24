import { Component, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { TooltipService } from './shared/services/tooltip.service';
import { SwUpdate } from '@angular/service-worker';
import { SnackBarParameters, SnackBarType } from './shared/models/SnackBar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  @ViewChild('installPwaMessage', { static: true })
  public installPwaMessageTemplate: TemplateRef<any>;

  @ViewChild('updatePwaMessage', { static: true })
  public updatePwaMessageTemplate: TemplateRef<any>;

  constructor(
    private swUpdate: SwUpdate,
    private tooltipService: TooltipService
  ) {
    this.swUpdate.available.subscribe(event => {
      this.tooltipService.customInfoWithCallback({
        template: this.updatePwaMessageTemplate,
        type: SnackBarType.UPDATE,
        dismissButtonText: 'UPDATE NOW!'
      } as SnackBarParameters)
        .subscribe(() => {
          swUpdate.activateUpdate().then(() => document.location.reload());
        });
    });
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: any) {
    if (e) {
      e.preventDefault();
      this.showInstallPwaPrompt(e);
    }
  }

  private showInstallPwaPrompt(e: any) {
    this.tooltipService.customInfoWithCallback({
      template: this.installPwaMessageTemplate,
      type: SnackBarType.INSTALL,
      dismissButtonText: 'CANCEL',
      actionButtonText: 'INSTALL'
    } as SnackBarParameters)
      .subscribe((result) => {
        if (result.dismissedByAction) {
          e.prompt();
        }
      });
  }

}

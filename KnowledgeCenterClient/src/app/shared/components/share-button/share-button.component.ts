import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.less']
})
export class ShareButtonComponent implements OnInit {

  @ViewChild('linkCopied', { static: true })
  public linkCopiedTemplate: TemplateRef<any>;

  @Input()
  public relativePath: string;

  constructor(private tooltipService: TooltipService) { }

  ngOnInit() {
  }


  public copyToClipboard(relativePath: string) {

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = location.origin + relativePath;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.tooltipService.info(this.linkCopiedTemplate);
  }
}

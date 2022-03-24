import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-truncate',
  templateUrl: './truncate.component.html',
  styleUrls: ['./truncate.component.less']
})
export class TruncateComponent implements OnInit {

  @Input() text: string;
  @Input() maxSize = 20;
  @Input() displayTooltip = true;

  public mustDisplayToolTip = false;

  constructor() { }

  ngOnInit() {
    if (this.displayTooltip && this.text != null && this.text.length > this.maxSize) {
      this.mustDisplayToolTip = true;
    }
  }

  public getStringFromHtml(text) {
    const html = text;
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}

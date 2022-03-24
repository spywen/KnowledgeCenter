import { Component, forwardRef, Renderer2, ViewChild, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const EPANDED_TEXTAREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => KcWysiwygComponent),
  multi: true,
};

@Component({
  selector: 'app-kc-wysiwyg',
  providers: [EPANDED_TEXTAREA_VALUE_ACCESSOR],
  templateUrl: './kc-wysiwyg.component.html',
  styleUrls: ['./kc-wysiwyg.component.less']
})
export class KcWysiwygComponent implements ControlValueAccessor {
  @ViewChild('textarea', {static: true}) textarea;

  @Input() public maxSize: number;

  @Input() public breakLine: boolean;

  public onChange;
  public onTouched;

  public currentSize = 0;

  private lineBreakCode = 13;

  constructor(private renderer: Renderer2) {
  }

  writeValue(value: any): void {
    value = (value ? value : '');
    this.currentSize = value.length;
    const div = this.textarea.nativeElement;
    this.renderer.setProperty(div, 'innerHTML', value);
    div.focus();
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(div);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const div = this.textarea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.renderer[action](div, 'disabled');
  }

  keyPress($event) {
    if (this.currentSize >= this.maxSize || $event.which === this.lineBreakCode) {
      if (this.breakLine === false) {
        $event.preventDefault();
        return false;
      }
    }
  }

  change($event) {
    this.currentSize = $event.target.textContent.length;
    this.onChange($event.target.innerHTML);
    this.onTouched($event.target.innerHTML);
  }

  public onPaste($event) {
    if (!$event.clipboardData.getData('Text')) {
      $event.preventDefault();
      return false;
    } else {
      $event.preventDefault();
      let text = ($event.originalEvent || $event).clipboardData.getData('text/plain');
      if ((this.currentSize + text.length) >= this.maxSize) {
        return false;
      }

      if (text.startsWith('https://') || text.startsWith('http://')) {
        const link = text.split(' ')[0];
        text = `<a target="blank" href="${link}">${link}</a> ${text.substring(link.length, text.length)}`;
        document.execCommand('insertHTML', false, text);
      } else {
        document.execCommand('insertHTML', false, text);
      }
    }
  }

}

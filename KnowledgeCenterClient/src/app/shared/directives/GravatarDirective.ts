import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';

@Directive({
  selector: '[appGravatar]'
})
export class GravatarDirective implements OnInit {

  @Input('appGravatar') email: string;
  @Input('appGravatarSize') size = 30;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private tokenService: TokenService) { }

  ngOnInit(): void {
    if (this.email && this.email.length > 0) {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.tokenService.getGravatarPerEmail(this.email, this.size));
    }
  }
}

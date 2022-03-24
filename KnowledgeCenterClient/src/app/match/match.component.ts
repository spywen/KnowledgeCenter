import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.less']
})
export class MatchComponent implements OnInit {

  public currentRoute: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.currentRoute = this.router.url;
  }

  naviguateTo(route: string) {
    this.router.navigate([route]);
    this.currentRoute = route;
  }
}

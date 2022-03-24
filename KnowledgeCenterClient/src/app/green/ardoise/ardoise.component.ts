import { Component, OnInit } from '@angular/core';
import { Publication } from '../models/Publication';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ardoise',
  templateUrl: './ardoise.component.html',
  styleUrls: ['./ardoise.component.less']
})
export class ArdoiseComponent implements OnInit {

  public publication: Publication;

  constructor(
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.publication = data.publication;
    });
  }
}

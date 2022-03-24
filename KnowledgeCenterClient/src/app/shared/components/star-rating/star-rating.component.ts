import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class Star {
  id: number;
  ownRate: number;
  isHover: boolean;

  readonly SelectedMinOwnRate = 0.4;
  readonly HalfStarMaxOwnRate = 0.7;

  constructor(
    id: number,
    ownRate: number
  ) {
    this.id = id;
    this.ownRate = ownRate;
  }

  public starKind() {
    if (this.isSelected() && this.SelectedMinOwnRate <= this.ownRate && this.ownRate <= this.HalfStarMaxOwnRate) {
      return 'star_half';
    }
    return 'star';
  }

  public isSelected() {
    return this.ownRate >= this.SelectedMinOwnRate;
  }
}

export enum StarSize {
  S = 'S',
  M = 'M',
  L = 'L'
}

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.less']
})
export class StarRatingComponent implements OnInit {

  public rate = 0;
  @Input('rate')
  set rateSetter(value: number) {
    this.rate = value;
    this.resetRate();
    this.stars.forEach(x => {
      x.ownRate = this.getStarOwnRate(value, x.id);
    });
  }
  @Output() rateChange = new EventEmitter<number>();
  @Input() starCount = 5;
  @Input() isEditable = false;
  @Input() size = StarSize.S;

  public stars: Array<Star> = [];

  constructor() { }

  ngOnInit(): void {
    this.stars = [];
    for (let i = 1; i <= this.starCount; i++) {
      this.stars.push(new Star(i, this.getStarOwnRate(this.rate, i)));
    }
  }

  public enter(star) {
    if (this.isEditable) {
      this.stars.filter(x => x.id <= star.id).forEach(x => x.isHover = true);
    }
  }

  public leave() {
    if (this.isEditable) {
      this.stars.forEach(x => x.isHover = false);
    }
  }

  public click(star: Star) {
    if (this.isEditable) {
      if (star.isSelected() && this.stars.filter(x => x.id > star.id && x.isSelected()).length === 0) {
        this.resetRate();
        this.rate = 0;
      } else {
        this.resetRate();
        this.stars.forEach(x => {
          x.ownRate = this.getStarOwnRate(star.id, x.id);
        });
        this.rate = star.id;
      }
      this.rateChange.emit(this.rate);
    }
  }

  private resetRate() {
    this.stars.forEach(x => {
      x.ownRate = 0;
      x.isHover = false;
    });
  }

  private getStarOwnRate(rate: number, starId: number) {
    const diff = Math.round((rate - starId) * 100) / 100;
    if (diff >= 0) {
      return 1;
    } else if (diff <= -1) {
      return 0;
    } else {
      if (diff > 0) {
        return diff;
      } else {
        return diff + 1;
      }
    }
  }
}

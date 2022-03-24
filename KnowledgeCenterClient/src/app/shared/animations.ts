import { trigger, sequence, animate, transition, style } from '@angular/animations';

// https://angular.io/guide/transition-and-triggers
export const rowsAnimation = trigger('rowsAnimation', [
  transition('void => *', [
    style({ height: '*', opacity: 0, transform: 'translateX(-50px)', 'box-shadow': 'none' }),
    sequence([
      animate('.25s ease', style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
    ])
  ]),
  transition('* => void', [
    style({ height: '*', opacity: 1, transform: 'translateX(0)' }),
    sequence([
      animate('.25s ease', style({ height: '*', opacity: 0, transform: 'translateX(-50px)', 'box-shadow': 'none' }))
    ])
  ])
]);

export const checkIconAnimation = trigger(
  'checkIconAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('300ms ease-in',
          style({ opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('300ms ease-out',
          style({ opacity: 0 }))
      ]
    )
  ]
);

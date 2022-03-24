import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/shared/services/token.service';

export interface Modules {
  title: string;
  participants: Array<Participant>;
}

export interface Participant {
  firstname: string;
  lastname: string;
  email: string;
  as: Array<As>;
}

export enum As {
  Developer = 'Developer',
  ProductOwner = 'Product Owner',
  Manager = 'Manager',
  IdeaOwner = 'Idea owner',
  TechnicalLeader = 'Technical leader',
  Reviewer = 'Reviewer',
  Participant = 'Participant'
}

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.less']
})
export class CreditsComponent implements OnInit {

  public As = As;

  public portalParticipants: Array<Participant> = [
    { firstname: 'Laurent', lastname: 'Babin', email: 'laurent.babin@capgemini.com', as: [As.IdeaOwner, As.TechnicalLeader] },
    { firstname: 'Fabien', lastname: 'Coloignier', email: 'fabien.coloignier@capgemini.com', as: [As.TechnicalLeader] }
  ];

  public matchParticipants: Array<Participant> = [
    { firstname: 'Kemi', lastname: 'Agbessi', email: 'kemi.agbessi@capgemini.com', as: [As.IdeaOwner] },
    { firstname: 'Imène', lastname: 'Boutahar', email: 'imene.boutahar@capgemini.com', as: [As.Manager]},
    { firstname: 'Sorël', lastname: 'Nadaud', email: 'sorel.nadaud@capgemini.com', as: [As.Developer]},
    { firstname: 'Jeanne', lastname: 'Marcade', email: 'jeanne.marcade@capgemini.com',  as: [As.Developer]},
    { firstname: 'Eric', lastname: 'Candel', email: 'eric.candel@capgemini.com', as: [As.ProductOwner]},
    { firstname: 'Didier', lastname: 'Cognet', email: 'didier.cognet@capgemini.com', as: [As.ProductOwner]},
    { firstname: 'Lamia', lastname: 'Lalilis', email: 'lamia.lalilis@capgemini.com', as: [As.Developer]},
    { firstname: 'Filipe', lastname: 'Doutel Silva', email: 'filipe.doutelsilva@capgemini.com', as: [As.Developer]},
    { firstname: 'Laurent', lastname: 'Babin', email: 'laurent.babin@capgemini.com', as: [As.TechnicalLeader, As.Reviewer]},
  ];

  public caplabParticipants: Array<Participant> = [
    { firstname: 'Jean-Laurent', lastname: 'Ferralis', email: 'jeanlaurent.ferralis@capgemini.com', as: [As.IdeaOwner] },
    { firstname: 'Laurent', lastname: 'Babin', email: 'laurent.babin@capgemini.com', as: [As.IdeaOwner, As.Developer]},
    { firstname: 'Antonin', lastname: 'Malfatti', email: 'antonin.malfatti@capgemini.com', as: [As.Developer]},
    { firstname: 'Youcef', lastname: 'Benzaoui', email: 'youcef.benzaoui@capgemini.com', as: [As.Participant]},
  ];

  public fluxParticipants: Array<Participant> = [
    { firstname: 'Laurent', lastname: 'Babin', email: 'laurent.babin@capgemini.com', as: [As.IdeaOwner, As.Developer]},
    { firstname: 'Antonin', lastname: 'Malfatti', email: 'antonin.malfatti@capgemini.com', as: [As.Reviewer]},
    { firstname: 'Youcef', lastname: 'Benzaoui', email: 'youcef.benzaoui@capgemini.com', as: [As.Participant]}
  ];

  public greenParticipants: Array<Participant> = [
    { firstname: 'Thomas', lastname: 'Bousnane', email: 'thomas.bousnane@capgemini.com', as: [As.IdeaOwner]},
    { firstname: 'Antonin', lastname: 'Malfatti', email: 'antonin.malfatti@capgemini.com', as: [As.Developer]},
    { firstname: 'Laurent', lastname: 'Babin', email: 'laurent.babin@capgemini.com', as: [As.Reviewer]}
  ];

  public modules: Array<Modules> = [
    { title: 'Match', participants: this.matchParticipants },
    { title: 'Caplab - Nice', participants: this.caplabParticipants },
    { title: 'Flux', participants: this.fluxParticipants },
    { title: 'Green', participants: this.greenParticipants },
    { title: 'Portal', participants: this.portalParticipants }
  ];

  constructor(public tokenService: TokenService) { }

  ngOnInit() {
  }

}

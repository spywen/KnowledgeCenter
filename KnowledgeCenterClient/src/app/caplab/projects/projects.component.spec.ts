import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectsService } from '../services/projects.service';
import { of } from 'rxjs';
import { ScrollEventsService } from 'src/app/shared/events/scroll-events.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BasePaginationResponse } from 'src/app/shared/models/BasePagination';
import { Project } from '../models/Project';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ProjectLikeDialogCloseResponse } from './dialogs/project-like/project-like-dialog.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';
import { LoadProjectsObjectResolver } from '../models/LoadProjects';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let element: HTMLElement;

  let project: Project;
  let projectsResponse: BasePaginationResponse<Project[]>;
  let tags: SimpleEnum[];
  let projectStatuses: SimpleEnum[];

  beforeEach(async(() => {
    initData();

    TestBed.configureTestingModule({
      declarations: [ ProjectsComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({ data: {
            tags,
            projectStatuses,
            projectsResponse
          } as LoadProjectsObjectResolver}), paramMap: of(convertToParamMap({}))}},
        { provide: ScrollEventsService, useValue: { listenScrollDown: () => of() } },
        { provide: ProjectsService, useValue: {
            getProjects: () => of(),
            get: () => of(project) } },
        { provide: MatBottomSheet, useValue: { open: () => {} } },
        { provide: MatDialog, useValue: { open: () => {} } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recalculate correctly project\'s average rate when it is my first like for this project and some other likes exist', () => {
    testLike({
      likeAverageRate: 1.5,
      likeCount: 2,
      wasFirstLike: true,
      rate: 4,
      oldRate: 0,
      expectedNewLikeAverageRate: 2.75,
      expectedNewLikeCount: 3
    });
  });

  it('should recalculate correctly project\'s average rate when it is not my first like for this project and some other likes exist', () => {
    testLike({
      likeAverageRate: 1.5,
      likeCount: 2,
      wasFirstLike: false,
      rate: 3,
      oldRate: 2,
      expectedNewLikeAverageRate: 2,
      expectedNewLikeCount: 2
    });
  });

  it('should recalculate correctly project\'s average rate when it is my first like for this project and no other likes exist', () => {
    testLike({
      likeAverageRate: 0,
      likeCount: 0,
      wasFirstLike: true,
      rate: 4,
      oldRate: 0,
      expectedNewLikeAverageRate: 4,
      expectedNewLikeCount: 1
    });
  });

  it('should recalculate correctly project\'s average rate when it is not my first like for this project and no other likes exist', () => {
    testLike({
      likeAverageRate: 2,
      likeCount: 1,
      wasFirstLike: false,
      rate: 1,
      oldRate: 2,
      expectedNewLikeAverageRate: 1,
      expectedNewLikeCount: 1
    });
  });

  function testLike(dataSet) {
    project.likeAverageRate = dataSet.likeAverageRate;
    project.likeCount = dataSet.likeCount;
    const openBottomSheetSpy = spyOn(TestBed.get(MatBottomSheet), 'open');
    const bottomSheetResponse = {
      wasFirstLike: dataSet.wasFirstLike,
      rate: dataSet.rate,
      oldRate: dataSet.oldRate
    } as ProjectLikeDialogCloseResponse;
    const bottomSheetRefMock = { afterDismissed: () => of(bottomSheetResponse)};
    openBottomSheetSpy.and.returnValue(bottomSheetRefMock);

    component.rate(project);

    expect(project.likeAverageRate).toBe(dataSet.expectedNewLikeAverageRate);
    expect(project.likeCount).toBe(dataSet.expectedNewLikeCount);
  }

  function initData(): void {
    project = {
      id: 1,
      title: 'Project 1',
      status: { code: 'VALIDATED' },
      user: { fullname: 'John Doe' },
      likeCount: 2,
      likeAverageRate: 1.5
     } as Project;

    projectsResponse = {
      data: [project],
      page: 1,
      size: 1,
      totalItems: 2,
      totalPages: 2
    } as BasePaginationResponse<Project[]>;

    tags = [{
      id: 1,
      code: 'green',
      description: '#green'
    }] as SimpleEnum[];

    projectStatuses = [{
      id: 1,
      code: 'WAITING',
      description: 'Waiting approval'
    }] as SimpleEnum[];
  }
});

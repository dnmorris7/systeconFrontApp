import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSVRecord } from './csvrecord.component';

describe('CSVRecordComponent', () => {
  let component: CSVRecord;
  let fixture: ComponentFixture<CSVRecord>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSVRecord ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSVRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

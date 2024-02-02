import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPautasComponent } from './listar-pautas.component';

describe('ListarPautasComponent', () => {
  let component: ListarPautasComponent;
  let fixture: ComponentFixture<ListarPautasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPautasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarPautasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibirPautaComponent } from './exibir-pauta.component';

describe('ExibirPautaComponent', () => {
  let component: ExibirPautaComponent;
  let fixture: ComponentFixture<ExibirPautaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExibirPautaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExibirPautaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

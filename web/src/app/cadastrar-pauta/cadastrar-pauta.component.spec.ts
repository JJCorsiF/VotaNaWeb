import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPautaComponent } from './cadastrar-pauta.component';

describe('CadastrarPautaComponent', () => {
  let component: CadastrarPautaComponent;
  let fixture: ComponentFixture<CadastrarPautaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarPautaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrarPautaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

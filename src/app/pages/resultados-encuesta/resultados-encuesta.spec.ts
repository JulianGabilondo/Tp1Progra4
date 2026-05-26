import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosEncuesta } from './resultados-encuesta';

describe('ResultadosEncuesta', () => {
  let component: ResultadosEncuesta;
  let fixture: ComponentFixture<ResultadosEncuesta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosEncuesta],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadosEncuesta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

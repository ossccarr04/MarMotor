import { TestBed } from '@angular/core/testing';

import { ConexionBBDD } from './conexion-bbdd';

describe('ConexionBBDD', () => {
  let service: ConexionBBDD;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexionBBDD);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

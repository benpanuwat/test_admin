import { TestBed } from '@angular/core/testing';

import { AppService } from './app.setting';

describe('AppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppService = TestBed.get(AppService);
    expect(service).toBeTruthy();
  });
});

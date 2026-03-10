import { TestBed } from '@angular/core/testing';

import { QuizStateService } from './quiz-state';

describe('QuizState', () => {
  let service: QuizStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

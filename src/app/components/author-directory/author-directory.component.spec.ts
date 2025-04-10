import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDirectoryComponent } from './author-directory.component';

describe('AuthorDirectoryComponent', () => {
  let component: AuthorDirectoryComponent;
  let fixture: ComponentFixture<AuthorDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorDirectoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

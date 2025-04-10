import { Component, inject } from '@angular/core';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterModule } from '@angular/router';
import { AuthorSeeder } from './services/dev/seed-data.service';
@Component({
  selector: 'app-root',
  imports: [ RouterModule, NavbarComponent, FooterComponent ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'article-hub';
  private seedService = inject(AuthorSeeder);

  constructor() {
    // 🔥 Call once
    // Uncomment to seed
     //this.seedService.seedAllArticles();
    // this.seedService.seedAuthors();
    
  }
}

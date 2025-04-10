
import { Routes , CanActivate} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import  { authGuard } from './guards/auth.guard';
export const routes: Routes = [
   { path: '', component: HomeComponent },
   { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-post/create-post.component').then(m => m.CreatePostComponent)
    ,canActivate: [authGuard]
  },  
  {
    path: 'article/:id',
    loadComponent: () => import('./pages/article-detail/article-detail.component').then(m => m.ArticleDetailComponent)
  },
  {
    path: 'authors',
    loadComponent: () =>
      import('./components/author-directory/author-directory.component').then(m => m.AuthorDirectoryComponent),
  },
  {
    path: 'author/:id',
    loadComponent: () =>
      import('./components/author-profile/author-profile.component').then(
        (m) => m.AuthorProfileComponent
      ),
  }
//  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

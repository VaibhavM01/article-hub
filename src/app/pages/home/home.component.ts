import { Component, effect, signal,computed } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../interfaces/article';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  articles = signal<Article[]>([]);
  featuredArticles = signal<Article[]>([]);
  searchQuery = signal('');
  sortOption = signal<'latest' | 'popular'>('latest');

  //  Computed to sort & filter articles
  filteredAndSortedArticles = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allArticles = this.articles();

    const filtered = allArticles.filter(article =>
      article.title.toLowerCase().includes(query)
    );

    return this.sortOption() === 'popular'
      ? [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0))
      : [...filtered].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  });

  constructor(private articleService: ArticleService) {
    
    this.loadArticles();
    
    // Effect reacts to filtered/sorted articles
    effect(() => {
      
      const sorted = this.filteredAndSortedArticles();
      this.featuredArticles.set(sorted.filter(a => a.featured));
      
    });
  }

  private loadArticles(): void {
    this.articleService.getAllArticles().subscribe((all: Article[]) => {
      console.log(all);
      this.articles.set(all);
      // `featuredArticles` will be updated automatically by effect
    });
  }

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  changeSort(option: 'latest' | 'popular') {
    this.sortOption.set(option);
  }
}

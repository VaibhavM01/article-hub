import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Author } from '../../interfaces/author.model';
import { Article } from '../../interfaces/article';
import { ArticleService } from '../../services/article.service';
@Component({
  selector: 'app-author-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './author-profile.component.html',
  styleUrl: './author-profile.component.scss'
})
export class AuthorProfileComponent implements OnInit {
  author: Author | null = null;
  articles: Article[] = [];
  defaultImage = '/assets/images/default-author-profile.png';

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private articleService: ArticleService
  ) {}

  async ngOnInit() {
    const authorId = this.route.snapshot.paramMap.get('id');
    if (!authorId) return;

    // Fetch author details
     this.firestoreService.getAuthorById(authorId).subscribe(
      (data) => {
        this.author = data;
      },
      (error) => {
        console.error('Error fetching author:', error);
      }
    );
    
    // Fetch their articles
    this.articleService.getArticlesByAuthor(authorId).subscribe((data) => {
      this.articles = data;
    });
  }
}

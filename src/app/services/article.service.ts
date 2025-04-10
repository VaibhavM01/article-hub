// src/app/services/article.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../interfaces/article';
import { FirestoreService } from './firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private firestoreService: FirestoreService) {}

  getAllArticles(): Observable<Article[]> {
    return this.firestoreService.getPublishedArticles();
  }

  getFeaturedArticles(): Observable<Article[]> {
    return this.firestoreService.getFeaturedArticles();
  }

  getArticleById(id: string): Promise<Article | null> {
    return this.firestoreService.getArticleById(id);
  }

  createArticle(article: Omit<Article, 'id' | 'createdAt' | 'authorId' | 'author'>): Promise<void> {
    return this.firestoreService.createArticle(article);
  }

  updateArticle(id: string, data: Partial<Article>): Promise<void> {
    return this.firestoreService.updateArticle(id, data);
  }

  deleteArticle(id: string): Promise<void> {
    return this.firestoreService.deleteArticle(id);
  }

  searchArticles(keyword: string): Observable<Article[]> {
    return new Observable<Article[]>((observer) => {
      this.getAllArticles().subscribe((articles) => {
        const filtered = articles.filter(
          (a) =>
            a.title.toLowerCase().includes(keyword.toLowerCase()) ||
            a.authorName?.toLowerCase().includes(keyword.toLowerCase())
        );
        observer.next(filtered);
      });
    });
  }

  getRelatedArticles(currentArticleId: string): Observable<Article[]> {
    return new Observable<Article[]>((observer) => {
      this.getAllArticles().subscribe((articles) => {
        const related = articles.filter((a) => a.id !== currentArticleId).slice(0, 3);
        observer.next(related);
      });
    });
  }

  getArticlesByTag(tag: string): Observable<Article[]> {
    return new Observable<Article[]>((observer) => {
      this.getAllArticles().subscribe((articles) => {
        const filtered = articles.filter((a) => a.tags?.includes(tag));
        observer.next(filtered);
      });
    });
  }

  getArticlesByAuthor(authorId: string): Observable<Article[]> {
    return new Observable<Article[]>((observer) => {
      this.firestoreService.getArticlesByAuthor(authorId).subscribe((articles) => {
        observer.next(articles);
      });
    });
  }
}

import { Injectable, inject } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { Observable } from 'rxjs';
import { defer, from } from 'rxjs';
import { Comment } from '../interfaces/comment';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private firestoreService = inject(FirestoreService);

  getCommentsForArticle(articleId: string, sortBy: 'newest' | 'oldest' | 'mostLiked' = 'newest'): Observable<any[]> {
    return defer(() => this.firestoreService.getCommentsForArticle(articleId, sortBy));
  }

  addComment(comment: Comment): Observable<void> {
    return from(this.firestoreService.postComment({
      commentId: comment.commentId,
      articleId: comment.articleId,
      text: comment.content,
      userId: comment.userId,
      userName: comment.userName,
      parentId: comment.parentId ?? null,
      likes: comment.likes ?? 0,
      timestamp: comment.timestamp ?? new Date().toISOString()
    }));
  }
}

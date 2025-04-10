import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { CommentService } from '../../services/comment.service';
import { Article } from '../../interfaces/article';
import { Comment } from '../../interfaces/comment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommentsComponent } from '../../components/comments/comments.component';
@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule ,CommentsComponent],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit {
  article: Article | undefined;
  related: Article[] = [];
  comments: Comment[] = [];

  newComment: string = '';
  selectedSort: string = 'newest';
  currentUser: any;
  showComments = false;
  commentCount: number = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private authservice: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id) {
      // Load article by ID
      this.articleService.getArticleById(id).then((article) => {
        if (article) {

          this.article = article;
          this.article.id = id; // Set the ID to the article object
         
          this.loadRelatedArticles(id!);
          this.loadComments(id!);
        } else {
          console.error('ArticleDetailComponent: Article not found');
        }
      });
    }
  }

  // Fetch related articles based on current article ID
  private loadRelatedArticles(articleId: string): void {
    this.articleService.getRelatedArticles(articleId).subscribe((related) => {
      this.related = related;
    });
  }

  // Fetch comments and apply sorting
  private loadComments(articleId: string): void {
   
    this.commentService.getCommentsForArticle(articleId).subscribe((data) => {
      this.comments = this.sortComments(data, this.selectedSort);
     
    });
  }

  // Sort comments based on selected method
  private sortComments(comments: Comment[], sortBy: string): Comment[] {
    switch (sortBy) {
      case 'oldest':
        return comments.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      case 'mostLiked':
        return comments.sort((a, b) => b.likes - a.likes);
      case 'newest':
      default:
        return comments.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }
  }

  // Post a new comment or reply
  submitComment(parentId: string | null): void {
    if (!this.article || !this.newComment.trim()) return;
    this.currentUser = this.authservice.getCurrentUser();
   
    const comment: Comment = {
      commentId: Math.random().toString(36).substring(2, 11),
      articleId: this.route.snapshot.paramMap.get('id')!,
      userId: this.currentUser?.uid!,
      userName: this.currentUser.displayName,
      content: this.newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      parentId: parentId || null, // If it's a reply, set parentId
    };
    
    this.commentService.addComment(comment).subscribe(() => {
      this.newComment = '';
      this.loadComments(this.article!.id!);
    });
  }

  // Handle sort change
  changeSort(sort: string): void {
    this.selectedSort = sort;
    if (this.article) {
      this.loadComments(this.article.id!);
    }
  }

  // Get replies for a specific parent comment
  getReplies(parentId: string): Comment[] {
    return this.comments.filter((c) => c.parentId === parentId);
  }

  // Get only top-level comments
  get topLevelComments(): Comment[] {
    return this.comments.filter((c) => !c.parentId);
  }

  navigateToArticle(id: string | undefined): void {
    this.router.navigate(['/article', id]);
    this.articleService.getArticleById(id!).then((article) => {
      if (article) {
      
        this.article = article;
        this.loadRelatedArticles(id!);
        this.loadComments(id!);
      } else {
       
      }
    });
  }

}

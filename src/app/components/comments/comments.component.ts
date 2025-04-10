import { Component, input, inject, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  //@Input() articleId!: string;
  readonly articleId = input<string>('');
  private commentService = inject(CommentService);
  private auth = inject(Auth);
  errorMessage = signal('');
  comments = signal<any[]>([]);
  sortBy = signal<'newest' | 'oldest' | 'mostLiked'>('newest');
  commentInput = signal('');
  replyInputs = signal<{ [key: string]: string }>({});
  replyTo = signal<string | null>(null);
  constructor() {
    //  Use effect here, inside constructor (valid injection context)
    effect(() => {
      if (this.articleId()) {
       
        this.loadComments();
      }
    });
  }
  ngOnInit() {
   
  }

  async loadComments() {
    this.commentService.getCommentsForArticle(this.articleId(), this.sortBy()).subscribe(fetched => {
    
      this.comments.set(fetched);
    });
  }

  async postComment(parentId: string | null = null) {
    const user = await this.auth.currentUser;
    const input = parentId ? this.replyInputs()[parentId] : this.commentInput();

    if (!user || !input?.trim()) { this.errorMessage.set('Please log in to post a comment.'); 
      return; };

    await this.commentService.addComment({
       commentId : "",
      articleId: this.articleId(),
      content: input.trim(),
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      parentId: parentId ?? null,
      likes: 0,
      timestamp: new Date().toISOString(),
    }).toPromise();

    if (parentId) {
      this.replyInputs.update((r) => ({ ...r, [parentId]: '' }));
      this.replyTo.set(null);
    } else {
      this.commentInput.set('');
    }

    this.loadComments();
  }

  topLevelComments = computed(() => this.comments().filter((c) => !c.parentId));
  repliesFor = (commentId: string) => this.comments().filter((c) => c.parentId === commentId);

  setReplyInput(commentId: string, value: string) {
    this.replyInputs.update((prev) => ({ ...prev, [commentId]: value }));
  }

  setSort(type: 'newest' | 'oldest' | 'mostLiked') {
    this.sortBy.set(type);
    this.loadComments();
  }
}

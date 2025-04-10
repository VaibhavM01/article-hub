import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar, NgxEditorModule } from 'ngx-editor';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FirestoreService } from '../../services/firestore/firestore.service'; 
import { Auth, User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
@Component({
  standalone: true,
  selector: 'app-create-post',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit {
  auth = inject(Auth);
  fb = inject(FormBuilder);
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {
   this.currentUser =  this.authService.getCurrentUser();
      if (!this.currentUser) {
        this.router.navigate(['/login']);
      }

    
  }
 // router = inject(Router);
  destroyRef = inject(DestroyRef);
  firestoreService = inject(FirestoreService);

  editor!: Editor;
  postForm!: FormGroup;

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    ['link', 'image'],
    ['code', 'blockquote'],
    ['undo', 'redo'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();

    this.postForm = this.fb.group({
      title: ['', Validators.required],
      tags: [''],
      content: ['', Validators.required],
      isDraft: [true],
      scheduledDate: [null],
      thumbnailUrl :['']
    });

    this.destroyRef.onDestroy(() => this.editor.destroy());
  }

  savePost() {
    const user = this.auth.currentUser;
    if (!user || this.postForm.invalid) {
      console.error('User not logged in or form invalid!');
      return;
    }

    const formData = this.postForm.value;
    formData.tags = formData.tags.split(',').map((tag: string) => tag.trim());
    this.firestoreService.createArticle(formData)
      .then(() => {
        this.postForm.reset();
        this.router.navigate(['/']);
      })
      .catch(error => console.error('Error saving post:', error));
  }

  suggestTags() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('../../workers/tag-suggester.worker', import.meta.url),
        { type: 'module' }
      );
       // Get raw HTML content from ngx-editor
       const content = this.postForm.get('content')?.value || '';
       console.log('editor  text:', content);
       // Strip out all HTML tags using a regular expression
       const text = content.replace(/<[^>]+>/g, ''); // This removes all HTML tags

       console.log('Cleaned text:', text); // Just for debugging
        //const text = this.postForm.get('content')?.value || '';

      worker.onmessage = ({ data }) => {
        const cleanedTags = data.filter(
          (tag: string) => tag.length > 2 && !['the', 'and', 'but', 'is', 'are', 'was', 'an', ',', '.', 'of'].includes(tag.toLowerCase())
        );
        this.postForm.get('tags')?.setValue(cleanedTags.join(', '));
      };

      worker.postMessage(text);
    } else {
      console.warn('Web Workers are not supported in this environment.');
    }
  }
}

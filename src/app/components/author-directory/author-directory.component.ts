import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Author } from '../../interfaces/author.model';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-author-directory',
  imports: [CommonModule, RouterModule],
  templateUrl: './author-directory.component.html',
  styleUrl: './author-directory.component.scss'
})
export class AuthorDirectoryComponent implements OnInit {
  authors = signal<Author[]>([]);
  searchTerm = signal<string>('');
  defaultImage = '/assets/images/default-author-profile.png';

  filteredAuthors = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.authors().filter(author =>
      author.name.toLowerCase().includes(term)
    );
  });

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService.getAllAuthors().subscribe((data) => {
      this.authors.set(data);
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}

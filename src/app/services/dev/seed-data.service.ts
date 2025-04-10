import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, setDoc, doc } from 'firebase/firestore';
@Injectable({ providedIn: 'root' })
export class AuthorSeeder {
  private firestore = inject(Firestore);

   async seedAuthors() {
     const mockAuthors = [
      {
        id: "author_jane",
        name: "Jane Doe",
        bio: "Frontend engineer and Angular expert. Jane writes about modern web development with a focus on performance and UX.",
        articleCount: 3,
        profileImageUrl: "https://randomuser.me/api/portraits/women/45.jpg"
      },
      {
        id: "author_john",
        name: "John Smith",
        bio: "Full-stack developer with a passion for clean code and web performance. John contributes insights on frontend tooling and architecture.",
        articleCount: 2,
        profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        id: "author_sara",
        name: "Sara Wells",
        bio: "Tech writer and JavaScript enthusiast. Sara loves simplifying complex topics for developers of all levels.",
        articleCount: 2,
        profileImageUrl: "https://randomuser.me/api/portraits/women/50.jpg"
      },
      {
        id: "author_raj",
        name: "Raj Mehta",
        bio: "Web engineer and speaker focused on emerging web technologies like WebAssembly, TypeScript, and Vite.",
        articleCount: 3,
        profileImageUrl: "https://randomuser.me/api/portraits/men/41.jpg"
      },
      
    ];
    
    for (const author of mockAuthors) {
      const authorRef = doc(this.firestore, 'authors', author.id);
      await setDoc(authorRef, author);
      console.log(`Added author: ${author.name}`);
    }
  }

  
  
  



  // async seedAllArticles() {
  //   for (const article of this.mockArticles) {
  //     const ref = doc(this.firestore, 'articles', article.id);
  //     await setDoc(ref, article);
  //     console.log(`Seeded: ${article.title}`);
  //   }
  // }

}

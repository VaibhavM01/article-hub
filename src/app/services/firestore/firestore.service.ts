import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  CollectionReference,
  Timestamp,
  DocumentData,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Article } from '../../interfaces/article';
import { Author } from '../../interfaces/author.model';
import { Observable, from, map } from 'rxjs';
import { UserProfile } from '../../interfaces/user-profile';
@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private articlesRef: CollectionReference<Article> = collection(this.firestore, 'articles') as CollectionReference<Article>;

//** User profile related method */


async saveUserProfile(user: UserProfile): Promise<void> {
  const userRef = doc(this.firestore, 'users', user.uid);
  await setDoc(userRef, user, { merge: true });
}


  /** Create new article with current user info */
  async createArticle(data: Omit<Article, 'authorId' | 'authorName' | 'createdAt'>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    console.log('data', data.tags),
    await setDoc(doc(this.articlesRef), {
      ...data,
      tags: data.tags || [],
      createdAt: Timestamp.now().toDate(),
      publishDate: data.publishDate || Date.now(),
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous'
    } as Article);
  }

 

  /** Get all published articles (non-drafts) */
  getPublishedArticles(): Observable<Article[]> {
    const q = query(
      this.articlesRef,
      where('isDraft', '==', false),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Article[]>;
  }

  /** Get featured articles */
  getFeaturedArticles(): Observable<Article[]> {
    const q = query(
      this.articlesRef,
      where('isDraft', '==', false),
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Article[]>;
  }

  /** Get single article by ID */
  async getArticleById(id: string): Promise<Article | null> {
    const ref = doc(this.firestore, `articles/${id}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Article) : null;
  }

  /** Update an article */
  async updateArticle(id: string, data: Partial<Article>): Promise<void> {
    const ref = doc(this.firestore, `articles/${id}`);
    await updateDoc(ref, { ...data });
  }

  /** Delete an article */
  async deleteArticle(id: string): Promise<void> {
    const ref = doc(this.firestore, `articles/${id}`);
    await deleteDoc(ref);
  }

  /** Get articles by author ID */
  getArticlesByAuthor(authorId: string): Observable<Article[]> {
    const q = query(
      this.articlesRef,
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Article[]>;
  }

  /** Search articles by title or authorName (filtered client-side) */
  async searchArticles(): Promise<Article[]> {
    const q = query(
      this.articlesRef,
      where('isDraft', '==', false)
    );
    const snapshot = await collectionData(q, { idField: 'id' }).toPromise();
    return snapshot as Article[];
  }

/** Author related service methods  */

// Get all authors
getAllAuthors() {
  const authorsRef = collection(this.firestore, 'authors');
  return from(getDocs(authorsRef)).pipe(
    map(snapshot =>
      snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Author))
    )
  );
}

// Get a single author by ID
getAuthorById(id: string) {
  const authorRef = doc(this.firestore, 'authors', id);
  return from(getDoc(authorRef)).pipe(
    map(snapshot => {
      if (snapshot.exists()) {
        return { ...snapshot.data(), id: snapshot.id } as Author;
      } else {
        return null;
      }
    })
  );
}

/**  Comment related methods */
//fetch all the comments for a specific article
async getCommentsForArticle(articleId: string, sort: 'newest' | 'oldest' | 'mostLiked') {
  const commentsRef = collection(this.firestore, 'comments');

  const sortField = sort === 'mostLiked' ? 'likes' : 'createdAt';
  const sortOrder = sort === 'oldest' ? 'asc' : 'desc';
  const q = query(commentsRef, where('articleId', '==', articleId), orderBy(sortField, sortOrder as any));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/// Fetch a single comment by ID
async postComment(comment: {
  commentId: string;
  articleId: string;
  text: string;
  userId: string;
  userName: string;
  parentId?: string | null;
  likes?: number;
  timestamp: string;
}) {
  const ref = collection(this.firestore, 'comments');
   comment.commentId = doc(ref).id;
  await addDoc(ref, {
    ...comment,
    createdAt: serverTimestamp(),
    likes: 0,
  });
}

}

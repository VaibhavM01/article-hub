export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL?: string | null;
    cretatedAt: string; // ISO format
}


import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  Firestore
} from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(config);

// Connect to provisioned Firestore database
export const db: Firestore = (config as any).firestoreDatabaseId
  ? getFirestore(app, (config as any).firestoreDatabaseId)
  : getFirestore(app);

import { Project, Testimonial } from '../types';

export type FirestoreProject = Project;
export type FirestoreReview = Testimonial;

export interface FirestoreInquiry {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  budget?: string;
  message?: string;
  services?: string[];
  notes?: string;
  createdAt: string;
  status?: string;
}

// System collections
const PROJECTS_COLLECTION = 'projects';
const REVIEWS_COLLECTION = 'reviews';
const INQUIRIES_COLLECTION = 'inquiries';
const SYSTEM_COLLECTION = 'system';

/**
 * Fetch all projects from Cloud Firestore
 */
export async function getProjectsFromFirestore(): Promise<FirestoreProject[]> {
  const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
  const list: FirestoreProject[] = [];
  querySnapshot.forEach((docSnap) => {
    list.push(docSnap.data() as FirestoreProject);
  });
  return list;
}

/**
 * Save or update project in Cloud Firestore
 */
export async function saveProjectToFirestore(project: FirestoreProject): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  await setDoc(docRef, project, { merge: true });
}

/**
 * Delete project from Cloud Firestore
 */
export async function deleteProjectFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Fetch all reviews from Cloud Firestore
 */
export async function getReviewsFromFirestore(): Promise<FirestoreReview[]> {
  const querySnapshot = await getDocs(collection(db, REVIEWS_COLLECTION));
  const list: FirestoreReview[] = [];
  querySnapshot.forEach((docSnap) => {
    list.push(docSnap.data() as FirestoreReview);
  });
  return list;
}

/**
 * Save or update review in Cloud Firestore
 */
export async function saveReviewToFirestore(review: FirestoreReview): Promise<void> {
  const docRef = doc(db, REVIEWS_COLLECTION, review.id);
  await setDoc(docRef, review, { merge: true });
}

/**
 * Delete review from Cloud Firestore
 */
export async function deleteReviewFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, REVIEWS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Fetch all inquiries from Cloud Firestore
 */
export async function getInquiriesFromFirestore(): Promise<FirestoreInquiry[]> {
  const querySnapshot = await getDocs(collection(db, INQUIRIES_COLLECTION));
  const list: FirestoreInquiry[] = [];
  querySnapshot.forEach((docSnap) => {
    list.push(docSnap.data() as FirestoreInquiry);
  });
  return list;
}

/**
 * Save incoming inquiry in Cloud Firestore
 */
export async function saveInquiryToFirestore(inquiry: FirestoreInquiry): Promise<void> {
  const docRef = doc(db, INQUIRIES_COLLECTION, inquiry.id);
  await setDoc(docRef, inquiry, { merge: true });
}

/**
 * Delete inquiry from Cloud Firestore
 */
export async function deleteInquiryFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Seed initial data only once if not already seeded
 * Protects against restoring deleted fake reviews upon redeployments
 */
export async function seedInitialFirestoreData(
  seedProjects: FirestoreProject[],
  seedReviews: FirestoreReview[]
): Promise<void> {
  try {
    const seedMarkerRef = doc(db, SYSTEM_COLLECTION, 'seed_status');
    const markerSnap = await getDoc(seedMarkerRef);

    if (markerSnap.exists() && markerSnap.data()?.seeded === true) {
      // Already seeded once in Cloud Firestore! Never overwrite or resurrect deleted items.
      return;
    }

    // Seed projects
    for (const proj of seedProjects) {
      await saveProjectToFirestore(proj);
    }

    // Seed reviews
    for (const rev of seedReviews) {
      await saveReviewToFirestore(rev);
    }

    // Mark as seeded in cloud
    await setDoc(seedMarkerRef, {
      seeded: true,
      timestamp: new Date().toISOString()
    });

    console.log('Successfully seeded initial data to Cloud Firestore');
  } catch (err) {
    console.error('Firestore seeding warning:', err);
  }
}

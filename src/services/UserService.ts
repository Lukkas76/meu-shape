import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile, OnboardingAnswers } from '../types';

class UserService {
  private collection = 'users';

  // ── Criar perfil do usuário ──────────────────────────────
  async createProfile(
    uid: string,
    email: string,
    answers: OnboardingAnswers,
    displayName?: string
  ): Promise<UserProfile> {
    const now = new Date().toISOString();

    const profile: UserProfile = {
      uid,
      email,
      displayName: displayName || '',
      gender: answers.gender,
      goal: answers.goal,
      activityLevel: answers.activityLevel,
      ageRange: answers.ageRange,
      height: answers.height,
      weight: answers.weight,
      notifications: true,
      privacyMode: false,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, this.collection, uid), {
      ...profile,
      _createdAt: serverTimestamp(),
      _updatedAt: serverTimestamp(),
    });

    return profile;
  }

  // ── Buscar perfil ────────────────────────────────────────
  async getProfile(uid: string): Promise<UserProfile | null> {
    const docSnap = await getDoc(doc(db, this.collection, uid));

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      gender: data.gender,
      goal: data.goal,
      activityLevel: data.activityLevel,
      ageRange: data.ageRange,
      height: data.height,
      weight: data.weight,
      notifications: data.notifications ?? true,
      privacyMode: data.privacyMode ?? false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as UserProfile;
  }

  // ── Atualizar perfil ─────────────────────────────────────
  async updateProfile(
    uid: string,
    data: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>
  ): Promise<void> {
    await updateDoc(doc(db, this.collection, uid), {
      ...data,
      updatedAt: new Date().toISOString(),
      _updatedAt: serverTimestamp(),
    });
  }

  // ── Atualizar configurações ──────────────────────────────
  async updateSettings(
    uid: string,
    settings: { notifications?: boolean; privacyMode?: boolean }
  ): Promise<void> {
    await this.updateProfile(uid, settings);
  }

  // ── Atualizar dados do questionário ──────────────────────
  async updateOnboardingData(uid: string, answers: Partial<OnboardingAnswers>): Promise<void> {
    await this.updateProfile(uid, answers);
  }

  // ── Deletar perfil ───────────────────────────────────────
  async deleteProfile(uid: string): Promise<void> {
    await deleteDoc(doc(db, this.collection, uid));
  }

  // ── Verificar se perfil existe ───────────────────────────
  async profileExists(uid: string): Promise<boolean> {
    const docSnap = await getDoc(doc(db, this.collection, uid));
    return docSnap.exists();
  }
}

export default new UserService();

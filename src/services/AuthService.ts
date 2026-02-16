import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  deleteUser,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../config/firebase';

class AuthService {
  // ── Registro ──────────────────────────────────────────────
  async register(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName) {
        await updateProfile(credential.user, { displayName });
      }

      return credential.user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ── Login ─────────────────────────────────────────────────
  async login(email: string, password: string): Promise<User> {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ── Logout ────────────────────────────────────────────────
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ── Reset de senha ────────────────────────────────────────
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ── Atualizar perfil ─────────────────────────────────────
  async updateUserProfile(data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    try {
      await updateProfile(user, data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ── Atualizar email ──────────────────────────────────────
  async updateUserEmail(newEmail: string, currentPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('Usuário não autenticado');

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ── Atualizar senha ──────────────────────────────────────
  async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('Usuário não autenticado');

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ── Deletar conta ────────────────────────────────────────
  async deleteAccount(password: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('Usuário não autenticado');

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ── Observer de estado ───────────────────────────────────
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // ── Usuário atual ────────────────────────────────────────
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // ── Tratamento de erros (PT-BR) ─────────────────────────
  private handleError(error: any): Error {
    const code = error.code || '';
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Este email já está cadastrado.',
      'auth/invalid-email': 'Email inválido.',
      'auth/operation-not-allowed': 'Operação não permitida.',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
      'auth/user-disabled': 'Esta conta foi desativada.',
      'auth/user-not-found': 'Nenhuma conta encontrada com este email.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-credential': 'Email ou senha incorretos.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      'auth/network-request-failed': 'Sem conexão com a internet.',
      'auth/requires-recent-login': 'Faça login novamente para esta operação.',
    };

    return new Error(messages[code] || `Erro inesperado: ${error.message}`);
  }
}

export default new AuthService();

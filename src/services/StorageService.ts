import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from '../config/firebase';

class StorageService {
  // ── Upload de foto de análise ────────────────────────────
  async uploadAnalysisPhoto(
    uid: string,
    photoUri: string,
    photoType: 'front' | 'side'
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const path = `users/${uid}/analysis/${timestamp}_${photoType}.jpg`;
      const storageRef = ref(storage, path);

      // Converte URI local para blob
      const response = await fetch(photoUri);
      const blob = await response.blob();

      // Upload
      await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
        customMetadata: {
          uid,
          photoType,
          uploadedAt: new Date().toISOString(),
        },
      });

      // Retorna URL de download
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      throw new Error('Falha ao enviar foto. Tente novamente.');
    }
  }

  // ── Upload de par de fotos (front + side) ────────────────
  async uploadAnalysisPhotos(
    uid: string,
    photos: { front: string; side: string }
  ): Promise<{ front: string; side: string }> {
    const [frontUrl, sideUrl] = await Promise.all([
      this.uploadAnalysisPhoto(uid, photos.front, 'front'),
      this.uploadAnalysisPhoto(uid, photos.side, 'side'),
    ]);

    return { front: frontUrl, side: sideUrl };
  }

  // ── Upload de foto de perfil ─────────────────────────────
  async uploadProfilePhoto(uid: string, photoUri: string): Promise<string> {
    try {
      const path = `users/${uid}/profile/avatar.jpg`;
      const storageRef = ref(storage, path);

      const response = await fetch(photoUri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
      });

      return await getDownloadURL(storageRef);
    } catch (error: any) {
      console.error('Erro no upload do avatar:', error);
      throw new Error('Falha ao enviar foto de perfil.');
    }
  }

  // ── Deletar foto ─────────────────────────────────────────
  async deletePhoto(photoUrl: string): Promise<void> {
    try {
      const storageRef = ref(storage, photoUrl);
      await deleteObject(storageRef);
    } catch (error: any) {
      // Ignora erros de arquivo não encontrado
      if (error.code !== 'storage/object-not-found') {
        console.error('Erro ao deletar foto:', error);
      }
    }
  }

  // ── Deletar todas as fotos do usuário ────────────────────
  async deleteAllUserPhotos(uid: string): Promise<void> {
    try {
      const userRef = ref(storage, `users/${uid}`);
      const result = await listAll(userRef);

      // Deleta arquivos no nível raiz
      await Promise.all(result.items.map((item) => deleteObject(item)));

      // Deleta arquivos em subdiretórios
      for (const prefix of result.prefixes) {
        const subResult = await listAll(prefix);
        await Promise.all(subResult.items.map((item) => deleteObject(item)));
      }
    } catch (error: any) {
      console.error('Erro ao limpar fotos do usuário:', error);
    }
  }
}

export default new StorageService();

import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { MeasurementEntry, BodyMeasurements } from '../types';

class MeasurementService {
  private collection = 'measurements';

  // ── Salvar nova medição ──────────────────────────────────
  async saveMeasurement(
    uid: string,
    measurements: BodyMeasurements,
    photoUrls: { front: string; side: string }
  ): Promise<MeasurementEntry> {
    const now = new Date().toISOString();

    const entry = {
      uid,
      ...measurements,
      photos: photoUrls,
      date: now,
      createdAt: now,
      _createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, this.collection), entry);

    return {
      id: docRef.id,
      uid,
      ...measurements,
      photos: photoUrls,
      date: now,
      createdAt: now,
    };
  }

  // ── Buscar histórico completo ────────────────────────────
  async getHistory(uid: string): Promise<MeasurementEntry[]> {
    const q = query(
      collection(db, this.collection),
      where('uid', '==', uid),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MeasurementEntry[];
  }

  // ── Buscar últimas N medições ────────────────────────────
  async getRecentMeasurements(uid: string, count: number = 10): Promise<MeasurementEntry[]> {
    const q = query(
      collection(db, this.collection),
      where('uid', '==', uid),
      orderBy('date', 'desc'),
      limit(count)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .reverse() as MeasurementEntry[];
  }

  // ── Buscar última medição ────────────────────────────────
  async getLatestMeasurement(uid: string): Promise<MeasurementEntry | null> {
    const q = query(
      collection(db, this.collection),
      where('uid', '==', uid),
      orderBy('date', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as MeasurementEntry;
  }

  // ── Buscar medição por ID ────────────────────────────────
  async getMeasurementById(id: string): Promise<MeasurementEntry | null> {
    const docSnap = await getDoc(doc(db, this.collection, id));

    if (!docSnap.exists()) return null;

    return { id: docSnap.id, ...docSnap.data() } as MeasurementEntry;
  }

  // ── Buscar por período ───────────────────────────────────
  async getMeasurementsByPeriod(
    uid: string,
    startDate: Date,
    endDate: Date
  ): Promise<MeasurementEntry[]> {
    const q = query(
      collection(db, this.collection),
      where('uid', '==', uid),
      where('date', '>=', startDate.toISOString()),
      where('date', '<=', endDate.toISOString()),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MeasurementEntry[];
  }

  // ── Contar medições ──────────────────────────────────────
  async getMeasurementCount(uid: string): Promise<number> {
    const q = query(
      collection(db, this.collection),
      where('uid', '==', uid)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  // ── Deletar medição ──────────────────────────────────────
  async deleteMeasurement(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collection, id));
  }

  // ── Deletar todas as medições do usuário ─────────────────
  async deleteAllMeasurements(uid: string): Promise<void> {
    const q = query(
      collection(db, this.collection),
      where('uid', '==', uid)
    );

    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map((d) =>
      deleteDoc(doc(db, this.collection, d.id))
    );

    await Promise.all(deletePromises);
  }

  // ── Exportar dados como CSV ──────────────────────────────
  async exportAsCSV(uid: string): Promise<string> {
    const history = await this.getHistory(uid);

    if (history.length === 0) return '';

    const headers = 'Data,Peito (cm),Cintura (cm),Quadril (cm),Braço (cm),Perna (cm),Gordura (%),Altura (cm)\n';

    const rows = history
      .map((entry) => {
        const date = new Date(entry.date).toLocaleDateString('pt-BR');
        return `${date},${entry.chest},${entry.waist},${entry.hip},${entry.arm},${entry.leg},${entry.bodyFat},${entry.height}`;
      })
      .join('\n');

    return headers + rows;
  }
}

export default new MeasurementService();

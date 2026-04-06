import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";

import {
  type FirestoreTaskFields,
  firestoreTaskToHomeActivity,
  mergeTitleAndSubtitleIntoFirestore,
} from "../../domain/tasks/taskFirestoreMapping";
import type { HomeActivity } from "../../presentation/types/homeActivity";
import { getFirebaseFirestore } from "./firebaseApp";

const TASKS = "tasks";

export function subscribeTasks(
  onNext: (tasks: HomeActivity[]) => void,
  onError?: (e: unknown) => void,
): Unsubscribe {
  const db = getFirebaseFirestore();
  const q = query(collection(db, TASKS), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list: HomeActivity[] = [];
      snap.forEach((d) => {
        const data = d.data() as FirestoreTaskFields;
        list.push(firestoreTaskToHomeActivity(d.id, data));
      });
      onNext(list);
    },
    (err) => {
      onError?.(err);
    },
  );
}

export async function addFirestoreTask(payload: {
  task: string;
  period: string;
  completed: boolean;
}): Promise<void> {
  const db = getFirebaseFirestore();
  await addDoc(collection(db, TASKS), {
    task: payload.task,
    period: payload.period,
    completed: payload.completed,
    createdAt: new Date(),
  });
}

export async function updateFirestoreTask(
  id: string,
  partial: Partial<FirestoreTaskFields>,
): Promise<void> {
  const db = getFirebaseFirestore();
  await updateDoc(doc(db, TASKS, id), partial as Record<string, unknown>);
}

export async function updateFirestoreTaskFromHomeActivity(
  previous: HomeActivity,
  title: string,
  subtitle: string,
): Promise<void> {
  const merged = mergeTitleAndSubtitleIntoFirestore(previous, title, subtitle);
  await updateFirestoreTask(previous.id, merged);
}

export async function setFirestoreTaskCompleted(
  id: string,
  completed: boolean,
): Promise<void> {
  await updateFirestoreTask(id, { completed });
}

export async function deleteFirestoreTask(id: string): Promise<void> {
  const db = getFirebaseFirestore();
  await deleteDoc(doc(db, TASKS, id));
}

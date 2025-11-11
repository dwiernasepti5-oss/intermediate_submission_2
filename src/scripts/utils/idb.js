import { openDB } from 'idb';

const DB_NAME = 'mstory-db';
const DB_VERSION = 1;
const STORE_STORY = 'stories';
const STORE_QUEUE = 'sync-queue';

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_STORY)) {
      db.createObjectStore(STORE_STORY, { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains(STORE_QUEUE)) {
      db.createObjectStore(STORE_QUEUE, { keyPath: 'qid', autoIncrement: true });
    }
  },
});

export async function saveStoryLocal(story) {
  const db = await dbPromise;
  await db.put(STORE_STORY, story);
}

export async function getAllStories() {
  const db = await dbPromise;
  return db.getAll(STORE_STORY);
}

export async function addToQueue(item) {
  const db = await dbPromise;
  await db.put(STORE_QUEUE, item);
}

export async function getQueue() {
  const db = await dbPromise;
  return db.getAll(STORE_QUEUE);
}

export async function deleteQueueItem(qid) {
  const db = await dbPromise;
  await db.delete(STORE_QUEUE, qid);
}

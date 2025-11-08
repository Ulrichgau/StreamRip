// Storage interface for the MP3 extractor app
// Currently no persistent storage is needed as this is a stateless tool

export interface IStorage {
  // No storage methods needed for this stateless application
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed
  }
}

export const storage = new MemStorage();

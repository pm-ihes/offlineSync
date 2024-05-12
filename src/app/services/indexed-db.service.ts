import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

@Injectable({
    providedIn: 'root'
})
export class IndexedDbService {
    private db!: IDBPDatabase<MyDB>;
    constructor() {
        this.connectToDb();
    }

    async connectToDb() {
        this.db = await openDB<MyDB>('my-db', 1, {
            upgrade(db) {
                db.createObjectStore('test-store');
            }
        });
    }

    async addUser(text: string) {
        const index = await this.db.getAll('test-store');
        const key = `text-${index.length}`;
        console.log(key)
        console.log(`${key}: ${text} wurde hinzugefügt!`)
        return this.db.put('test-store', text, key);
    }

    deleteUser(key: string) {
        return this.db.delete('test-store', key);
    }
}

interface MyDB extends DBSchema {
    'test-store': {
        key: string;
        value: string;
    };
}

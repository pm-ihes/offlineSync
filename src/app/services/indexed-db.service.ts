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
        this.db = await openDB<MyDB>('waterControll', 1, {
            upgrade(db) {
                db.createObjectStore('background-sync-store');
            }
        });
    }

    async addUser(text: string) {
        const items = await this.db.getAll('background-sync-store');
        let length = items.length;
        // Also the index value takes one place, so it is more easy to start at 1
        if (length === 0) {
            length += 1;
        }
        const keyName = length.toString();
        console.log(`${keyName}: ${text} wurde hinzugefügt!`);
        await this.db.put('background-sync-store', text, keyName);
        await this.db.put('background-sync-store', keyName, 'index');
        return Promise.resolve();
    }

    deleteUser(key: string) {
        return this.db.delete('background-sync-store', key);
    }
}

interface MyDB extends DBSchema {
    'background-sync-store': {
        key: string;
        value: string;
    };
}

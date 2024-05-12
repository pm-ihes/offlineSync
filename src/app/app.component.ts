import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IndexedDbService } from './services/indexed-db.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'offlineSync';
    text = '';

    constructor(private http: HttpClient, private indexedDBService: IndexedDbService) {}

    postData() {
        const obj = {
            text: this.text
        };
        this.http.post('http://localhost:3000/data', obj).subscribe({
            next: (res) => {
                console.log(res);
            },
            error: (err) => {
                this.indexedDBService
                    .addUser(obj.text)
                    .then(() => {
                        this.backgroundSync();
                    })
                    .catch(console.log);
            }
        });
    }

    backgroundSync() {
        navigator.serviceWorker.ready
            .then((swRegistration: any) => swRegistration.sync.register('post-data'))
            .catch(console.log);
    }
}

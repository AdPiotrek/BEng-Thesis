import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-authorized',
    templateUrl: './authorized.component.html',
    styleUrls: ['./authorized.component.scss']
})
export class AuthorizedComponent implements OnInit {


    pages: { title: string, link: string }[] =
        [
            {title: 'Lista kursów', link: '/course-list'},
            {title: 'Moje kursy', link: '/my-courses'},
            {title: 'Aktywuj obecność', link: '/user-presence'},
            {title: 'Aktywne obecności', link: '/active-presence'},
            {title: 'Kontroluj czas', link: '/time-control'}
        ];

    constructor() {
    }

    ngOnInit() {
    }


}

import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { CourseService } from '../user/services/course.service';
import { Course } from '../../core/models/course';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  choosedCourse: Observable<Course>;
  loggedUserId: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Web)
    .pipe(
      map(result => {
        return !result.matches;
      })
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private userService: UserService,
              private courseService: CourseService) {

  }

  ngOnInit() {
    this.loggedUserId = this.userService.loggedUser._id;
    this.choosedCourse = this.courseService.choosedCourse$;
  }

  hasInstructorAccess(): boolean {
    return this.userService.isInstructor();
  }

  hasUserAccess(): boolean {
    return this.userService.isCommonUser();
  }

}

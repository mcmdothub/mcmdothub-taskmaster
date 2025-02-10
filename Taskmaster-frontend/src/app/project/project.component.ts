import { Component } from '@angular/core';
import { TaskListComponent } from './task-list/task-list.component';
import { ProjectTitleComponent } from './project-title/project-title.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [TaskListComponent, ProgressBarComponent, ProjectTitleComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {}

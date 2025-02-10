import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../task.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
const emptyTask = {
  name: '',
  description: '',
  dueDate: new Date(),
  completed: false,
  project: 1,
  id: 0,
};

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,DatePipe, TaskFormComponent, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  tasks: Task[] = [];
  showModal: boolean = false;
  formType: 'CREATE' | 'UPDATE' = 'CREATE';
  selectedTask: Task = emptyTask;
  private cdRef = inject(ChangeDetectorRef); // Add this
  tasks$: Observable<Task[]> = new Observable<Task[]>();

  private taskService = inject(TaskService);

  constructor() {

      /*this.tasks$ = this.taskService.getTasks();
      this.tasks$.subscribe(tasks => this.tasks = tasks);*/
    // call updateTasks to get the tasks from the server
    this.updateTasks();

  }

  updateTasks() {
    this.tasks$ = this.taskService.getTasks();
    this.tasks$.subscribe(tasks => this.tasks = tasks);
  }


/*  handleCheckbox(id: number) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    const updatedTask = { ...this.tasks[taskIndex], completed: !this.tasks[taskIndex].completed };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.tasks[taskIndex] = updatedTask;
    });
  }*/

  handleCheckbox(id: number) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    const updatedTask = { ...this.tasks[taskIndex], completed: !this.tasks[taskIndex].completed };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.tasks = [
        ...this.tasks.slice(0, taskIndex),
        updatedTask,
        ...this.tasks.slice(taskIndex + 1)
      ];
      this.cdRef.detectChanges(); // Force Angular to detect changes
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.updateTasks();
    });
  }

  updateTask(task: Task) {
    this.selectedTask = task;
    this.formType = 'UPDATE';
    this.showModal = true;
  }

  addNewTask() {
    this.selectedTask = emptyTask;
    this.formType = 'CREATE';
    this.showModal = true;
  }

  handleModalClose(type: 'SUBMIT' | 'CANCEL') {
    if (type === 'SUBMIT') {
      this.updateTasks();
    }
    this.showModal = false;
  }
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}

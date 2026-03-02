import { Component } from '@angular/core';
import { TaskListComponent } from '../task-list/task-list';
import { TaskService } from '../../services/task';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TaskListComponent],
  templateUrl: './admin.html'
})
export class AdminComponent {

  tasks: string[] = [];

  constructor(private taskService: TaskService) {}

  show() {
    this.tasks = this.taskService.getTasks();
    console.log('Tasks fetched in admin:', this.tasks);
  }
}
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-list.html'
})
export class TaskListComponent implements OnInit {

  newTask = '';
  tasks: string[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.tasks = this.taskService.getTasks();
  }

  add() {
    if (this.newTask.trim()) {
      this.taskService.addTask(this.newTask);
      this.tasks = this.taskService.getTasks();
      this.newTask = '';
    }
  }
}
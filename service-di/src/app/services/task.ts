import { Injectable } from '@angular/core';
import { LoggerService } from './logger';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: string[] = [];

  constructor(private logger: LoggerService) {}

  addTask(task: string) {
    this.tasks.push(task);
    this.logger.log('Task added: ' + task);
  }

  getTasks() {
    return this.tasks;
  }
}
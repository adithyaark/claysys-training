import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminComponent } from './components/admin/admin';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdminComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('service-di');
}

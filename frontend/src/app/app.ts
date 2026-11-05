import { Component } from '@angular/core';
import { LibroCrudComponent } from './components/libro-crud/libro-crud';

@Component({
  selector: 'app-root',
  imports: [LibroCrudComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

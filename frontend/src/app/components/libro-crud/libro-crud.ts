import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { Libro } from '../../models/libro.model';
import { LibroService } from '../../services/libro.service';

@Component({
  selector: 'app-libro-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './libro-crud.html',
  styleUrls: ['./libro-crud.css']
})
export class LibroCrudComponent implements OnInit {
  libros = signal<Libro[]>([]);
  libroForm: FormGroup;
  editingId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      autor: ['', [Validators.required, Validators.maxLength(255)]],
      genero: ['', Validators.maxLength(255)],
      anio_publicacion: [null]
    });
  }

  ngOnInit(): void {
    this.loadLibros();
  }

  loadLibros(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros.set(data);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.errorMessage.set(err instanceof TimeoutError
          ? 'La solicitud tardó más de 10 segundos. Verifica la conexión con el servidor e inténtalo de nuevo.'
          : err instanceof Error
            ? err.message
            : 'No se pudieron cargar los libros.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.libroForm.invalid || this.saving()) {
      this.libroForm.markAllAsTouched();
      return;
    }

    const libroData: Libro = { ...this.libroForm.value, titulo: this.libroForm.value.titulo.trim(), autor: this.libroForm.value.autor.trim() };
    if (!libroData.titulo || !libroData.autor) {
      this.errorMessage.set('El título y el autor no pueden estar vacíos.');
      return;
    }
    const editingId = this.editingId();
    const isEditing = editingId !== null;
    const request = isEditing
      ? this.libroService.updateLibro(editingId, libroData)
      : this.libroService.createLibro(libroData);

    this.saving.set(true);
    this.errorMessage.set('');
    request.subscribe({
      next: (savedLibro) => {
        this.libros.update((libros) => isEditing
          ? libros.map((libro) => libro.id === savedLibro.id ? savedLibro : libro)
          : [...libros, savedLibro]);
        this.resetForm();
        this.saving.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message || err.message || 'No se pudo guardar el libro.');
        this.saving.set(false);
      }
    });
  }

  editLibro(libro: Libro): void {
    this.editingId.set(libro.id!);
    this.libroForm.patchValue({
      titulo: libro.titulo,
      autor: libro.autor,
      genero: libro.genero,
      anio_publicacion: libro.anio_publicacion
    });
  }

  deleteLibro(id: string): void {
    if (confirm('¿Eliminar este libro?')) {
      this.errorMessage.set('');
      this.libroService.deleteLibro(id).subscribe({
        next: () => {
          this.libros.update((libros) => libros.filter((libro) => libro.id !== id));
          if (this.editingId() === id) { this.resetForm(); }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(err.error?.message || err.message || 'No se pudo eliminar el libro.');
        }
      });
    }
  }

  resetForm(): void {
    this.libroForm.reset();
    this.editingId.set(null);
  }
}

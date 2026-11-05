import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { App } from './app';

describe('Catálogo de libros', () => {
  it('carga el catálogo y guarda un libro desde el formulario', async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('/api/libros').flush([]);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('No hay libros registrados.');
    const button = page.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    for (const [id, value] of [['titulo', 'Libro de prueba'], ['autor', 'Autora']]) {
      const input = page.querySelector('#' + id) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    fixture.detectChanges();
    page.querySelector('form')!.dispatchEvent(new Event('submit'));
    const request = http.expectOne('/api/libros');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.titulo).toBe('Libro de prueba');
    request.flush({ id: 'abc', titulo: 'Libro de prueba', autor: 'Autora' });
    await fixture.whenStable();
    expect(page.querySelector('tbody')!.textContent).toContain('Libro de prueba');
    http.verify();
  });
});

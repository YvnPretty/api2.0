export interface Libro {
  id?: string;
  titulo: string;
  autor: string;
  genero?: string | null;
  anio_publicacion?: number | null;
}

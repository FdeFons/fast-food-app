export interface productsI {
    id?: string;
    nombre: string;
    imagen?: string;
    precio: number;
    descripcion?: string;
    novedad?: boolean;
    id_categoria?: string;
    cantidad?: number;
    fileRef?: string;
    precioPedido?: number;
}
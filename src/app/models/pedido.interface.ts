export interface pedidoI {
    precioTotalPedido: number;
    fecha: Date;
    numPedido: number;
    productos?: any[];
    pagado: boolean;
    terminado: boolean;
    tipoPago: string;
}
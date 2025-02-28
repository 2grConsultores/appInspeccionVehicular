export interface validacionInt {
  usuario: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  visibles: {
    listaLecturas: [
      {
        posicion: string;
        vinOCR: string;
        vinEditado: string;
        editado: boolean;
        fecha: Date;
        imagen: {
          url: string;
        };
      }
    ];
    vin: string;
  };
  obd: {
    vin: string;
    fecha?: Date;
  };
  nfc: {
    vin: string;
    fecha?: Date;
  };
  fotos: [
    {
      imagen: {
        url: string;
      };
      posicion: string;
      fecha: Date;
    }
  ];
  resultado: {
    riesgo: string;
    color: string;
    descripcion: string;
    recomendacion: string[];
  };
  decodificacionVin: {
    marca: string;
    modelo: string;
    anioModelo: string;
    pais: string;
    completada: boolean;
    fecha: Date;
  };
}

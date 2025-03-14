export interface validacionInt {
  id: string;
  usuario: string;
  fechaInicio?: { seconds: number; nanoseconds: number };
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
    estacionDisponible:{
      parabrisas: boolean;
      puerta: boolean;
      factura: boolean;
      tarjetaCirculacion: boolean;
    };
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
  ubicaciones: [
    { 
      latitude: number;
      longitude: number;
      accuracy: number;
      heading: number;
      speed: number;
      timestamp: number;
    }
  ];

}

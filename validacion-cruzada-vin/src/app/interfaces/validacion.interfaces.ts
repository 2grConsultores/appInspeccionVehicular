export interface validacionInt{
    _id: number;
	usuario: string;
	fechaInicio?: Date;
	fechaFin?: Date;
	visibles:{
		listaLecturas:[{
				posicion:string,
				lectura:string,
				resultado:string,
				editado:boolean,
				fecha:Date,
				imagen:{
					base64:string,
				},
			}],
		vin: string,
	},
	obd:{
		vin: string,
		fecha?: Date,
	},
	nfc:{
		vin: string,
		fecha?: Date,
	},
	resultado:{
		riesgo: string,
		color: string,
		descripcion: string,
		recomendacion: string[],
    }

}
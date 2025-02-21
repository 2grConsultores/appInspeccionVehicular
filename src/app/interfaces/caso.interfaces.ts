export interface Caso {
    _id: number;
	visibles:{
		listaLecturas:[{
				lectura:string,
				resultado:string,
			}],
		vin: string,
	},
	obd:{
		vin: string,
	},
	nfc:{
		vin: string,
	},
	resultado:{
		riesgo: string,
		color: string,
		descripcion: string,
		recomendacion: string[],
    }
}
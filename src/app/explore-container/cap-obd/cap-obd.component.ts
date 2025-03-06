// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FirestoreService } from 'src/app/services/firestore.service';

// @Component({
//   selector: 'app-cap-obd',
//   templateUrl: './cap-obd.component.html',
//   styleUrls: ['./cap-obd.component.scss'],
// })
// export class CapObdComponent  implements OnInit {
//   mostrarResutlado:boolean = false;
//   caso:number = 0; 
//   instrucciones:boolean = true;
//   vincularDispositivo:boolean = false;
//   validacionId:string = '';

//   constructor(

//     private activatedRoute: ActivatedRoute,
//     private firestoreService: FirestoreService,
//   ) { }

//   ngOnInit() {
//     this.activatedRoute.params.subscribe( ({id}) => { // aqui obtengo el id del registro
//       this.validacionId = id;
//       this.obtenerDatosValidacion(id);
//       this.bluetoothEncendido();
//     })
//   }

//   validarCaptura(){
//     setTimeout(() => {
//       console.log('Validando captura');
//       this.mostrarResutlado = true;
  
//     }, 3500);
//   }

//   linkCapturaNFC(caso: number){
//     this.router.navigate(['nfc/'+caso]);
//   }

//   buscarDispositivo(){
//     setTimeout(() => {
//       this.vincularDispositivo = true;
//       this.instrucciones = false;
//       this.bluetoothService.listDevices().then((devices) => {
//         console.log('Dispositivos encontrados componente:', devices);
//         // this.connectDevice(devices[0]);
//       });
//     }, 1600);
//   }

//   obtenerVin(){
//     setTimeout(() => {
//       this.vincularDispositivo = false;
//       this.mostrarResutlado = true;
//     }, 3200);
//   }

//   bluetoothEncendido(){
//     this.bluetoothService.isEnabled().then((result) => {
//       console.log('result:', result);
//         if(result){
//           this.buscarDispositivo();
//         }else{
//           this.bluetoothService.enableBluetooth().then(() => {
//             this.buscarDispositivo();
//           });
//         }
//     });
//   }

//   obtenerDatosValidacion(validacionId: string) {
//     this.firestoreService.findOne('inspecciones', validacionId).subscribe((inspeccion) => {
//       console.log('inspeccion', inspeccion);
//     });

//   }

// }

import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';


@Component({
  selector: 'app-cap-obd',
  templateUrl: './cap-obd.component.html',
  styleUrls: ['./cap-obd.component.scss']
})
export class CapObdComponent implements OnInit {
  devices: any[] = [];
  connectedDevice: any = null;
  scanActive = false;
  error: string = '';
 instrucciones:boolean = true;
 inicioble:boolean = false;

  constructor(private bluetoothService: BluetoothService) { }

  async ngOnInit() {
    // Inicializa el plugin y solicita permisos necesarios
    try {
      const isenabled = await this.bluetoothService.isEnabled();
      console.log('Bluetooth habilitado:', isenabled);
      if (!isenabled) {
        await this.bluetoothService.enableBluetooth();
      }
      const inicio = await this.bluetoothService.initializeBluetooth();
      console .log('Bluetooth inicializado:', inicio);
      
      // await this.bluetoothService.requestPermissions();
    } catch (err) {
      console.error("Error al inicializar Bluetooth", err);
      this.error = 'Error al inicializar Bluetooth: ' + err;
    }
  }

  // Inicia el escaneo de dispositivos BLE
  async startScan() {
    this.scanActive = true;
    try {
      const result = await this.bluetoothService.startScan();
      console.log("Resultado del escaneo:", result);
      // Suponiendo que el resultado tenga una propiedad 'devices' con el listado
      this.devices = result && result.devices ? result.devices : [];
      this.instrucciones = false;
    } catch (err) {
      console.error("Error durante el escaneo", err);
      this.error = 'Error durante el escaneo: ' + err;
    } finally {
      this.scanActive = false;
    }
  }

  // Detiene el escaneo
  async stopScan() {
    try {
      await this.bluetoothService.stopScan();
      this.scanActive = false;
    } catch (err) {
      console.error("Error al detener el escaneo", err);
      this.error = 'Error al detener el escaneo: ' + err;
    }
  }

  // Conecta a un dispositivo utilizando su deviceId
  async connect(deviceId: string) {
    try {
      const connectResult = await this.bluetoothService.connect(deviceId);
      console.log("Conectado al dispositivo:", connectResult);
      this.connectedDevice = { deviceId, ...connectResult };
      // Si deseas suscribirte a notificaciones:
      this.bluetoothService.subscribe((data) => {
        console.log("Notificación recibida:", data);
        // Aquí podrías actualizar una variable o emitir el dato a otros componentes
      });
    } catch (err) {
      console.error("Error al conectar al dispositivo:", err);
      this.error = 'Error al conectar: ' + err;
    }
  }

  // Desconecta el dispositivo conectado
  async disconnect() {
    if (!this.connectedDevice || !this.connectedDevice.deviceId) {
      this.error = 'No hay dispositivo conectado';
      return;
    }
    try {
      await this.bluetoothService.disconnect(this.connectedDevice.deviceId);
      console.log("Desconectado del dispositivo:", this.connectedDevice.deviceId);
      this.connectedDevice = null;
    } catch (err) {
      console.error("Error al desconectar", err);
      this.error = 'Error al desconectar: ' + err;
    }
  }

  // Envía datos al dispositivo conectado a través de una característica BLE
  async sendData() {
    if (!this.connectedDevice || !this.connectedDevice.deviceId) {
      this.error = 'No hay dispositivo conectado';
      return;
    }
    try {
      // Reemplaza estos UUID con los de tu dispositivo
      const serviceUUID = '00001234-0000-1000-8000-00805f9b34fb';
      const characteristicUUID = '00005678-0000-1000-8000-00805f9b34fb';
      const value = 'tu-dato-a-enviar';
      const writeResult = await this.bluetoothService.write(
        this.connectedDevice.deviceId,
        serviceUUID,
        characteristicUUID,
        value
      );
      console.log("Resultado de escribir datos:", writeResult);
    } catch (err) {
      console.error("Error al enviar datos", err);
      this.error = 'Error al enviar datos: ' + err;
    }
  }
}


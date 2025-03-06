import { Injectable } from '@angular/core';
import { BluetoothLe, numberToUUID } from '@capacitor-community/bluetooth-le';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor() { }

  async isEnabled(): Promise<boolean> {
    try {
      const result = await BluetoothLe.isEnabled();
      // Se espera que result tenga una propiedad 'enabled' de tipo boolean
      if (typeof result !== 'boolean') {
        console.warn('La respuesta de isEnabled es undefined; retornando false');
        return false;
      }
      return result;
    } catch (error) {
      console.error('Error al verificar si Bluetooth está habilitado', error);
      return false;
    }
  }

  async enableBluetooth(): Promise<void> {
    try {
      await BluetoothLe.enable();
      console.log('Bluetooth habilitado');
    } catch (error) {
      console.error('Error al habilitar Bluetooth', error);
    }
  }

  // Inicializa el plugin de Bluetooth LE
  async initializeBluetooth(): Promise<void> {
    try {
      const initResult = await BluetoothLe.initialize();
      console.log('Bluetooth inicializado:', initResult);
    } catch (error) {
      console.error('Error al inicializar Bluetooth', error);
    }
  }

  // Solicita permisos necesarios (en Android se requieren permisos de ubicación)
  // async requestPermissions(): Promise<void> {
  //   try {
  //     const permissionResult = await BluetoothLe.requestPermissions();
  //     console.log('Permisos otorgados:', permissionResult);
  //   } catch (error) {
  //     console.error('Error solicitando permisos de Bluetooth', error);
  //   }
  // }

  // Inicia el escaneo de dispositivos BLE
  async startScan(): Promise<any> {
    // Puedes pasar un UUID de servicio para filtrar dispositivos específicos
    // Por ejemplo, el UUID para el servicio de batería es 0x180f
    const scanner = numberToUUID(0x180d);
    console.log('Escaneando dispositivos con servicio:', scanner);

    try {
      // Opcional: puedes pasar opciones, por ejemplo, un array de serviceUUIDs para filtrar
      const scanResult = await BluetoothLe.requestLEScan({
        services: [scanner],
      });
      console.log('Escaneo iniciado:', scanResult);
      // El resultado puede incluir una lista de dispositivos detectados
      return scanResult;
    } catch (error) {
      console.error('Error al iniciar el escaneo', error);
      throw error;
    }
  }

  // Detiene el escaneo
  async stopScan(): Promise<void> {
    try {
      await BluetoothLe.stopLEScan();
      console.log('Escaneo detenido');
    } catch (error) {
      console.error('Error al detener el escaneo', error);
    }
  }

  // Conecta a un dispositivo usando su deviceId
  async connect(deviceId: string): Promise<any> {
    try {
      const connectResult = await BluetoothLe.connect({ deviceId });
      console.log('Conectado al dispositivo:', connectResult);
      return connectResult;
    } catch (error) {
      console.error('Error al conectar con el dispositivo:', deviceId, error);
      throw error;
    }
  }

  // Desconecta el dispositivo especificado
  async disconnect(deviceId: string): Promise<void> {
    try {
      await BluetoothLe.disconnect({ deviceId });
      console.log('Desconectado del dispositivo:', deviceId);
    } catch (error) {
      console.error('Error al desconectar del dispositivo:', deviceId, error);
    }
  }

  // Escribe datos a una característica específica (requiere: deviceId, service UUID, characteristic UUID y el valor a escribir)
  async write(
    deviceId: string,
    service: string,
    characteristic: string,
    value: string
  ): Promise<any> {
    try {
      const writeResult = await BluetoothLe.write({
        deviceId,
        service,
        characteristic,
        value
      });
      console.log('Datos escritos:', writeResult);
      return writeResult;
    } catch (error) {
      console.error('Error al escribir datos:', error);
      throw error;
    }
  }

  // Se suscribe a eventos de notificaciones del dispositivo.
  // La API utiliza addListener para recibir eventos cuando hay cambios en las características notificables.
  subscribe(callback: (data: any) => void): void {
    // El nombre del evento depende de la implementación; en este ejemplo se usa "bluetoothLeEvent".
    // Revisa la documentación oficial para conocer el nombre exacto del evento a escuchar.
    BluetoothLe.addListener('bluetoothLeEvent', (event) => {
      console.log('Evento de Bluetooth LE:', event);
      callback(event);
    });
  }
}

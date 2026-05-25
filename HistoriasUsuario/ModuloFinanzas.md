1. Como administrador quiero que el sistema registre automáticamente los movimientos financieros (ingresos y egresos) generados a partir de pedidos, pagos a proveedores y otros registros del sistema para mantener un control financiero actualizado, cuenta con opciones para consultar y filtrar los movimientos financieros por fecha, tipo o categoría.

Escenario 1: Registrar ingresos por pedidos

En caso de pedido pagado cuando se confirma el pago el sistema registra ingreso

Escenario 2: Registrar egresos

En caso de pago a proveedor cuando se registra el pago el sistema registra egreso

Escenario 3: Consultar movimientos

En caso de múltiples registros cuando se aplican filtros el sistema muestra movimientos

2. Como administrador necesito ver los ingresos, egresos y balance general para evaluar el estado financiero del negocio.

Escenario 1: Visualizar ingresos

En caso de datos financieros cuando se accede al módulo el sistema muestra ingresos

Escenario 2: Visualizar egresos

En caso de registros existentes cuando se consulta el sistema muestra egresos

Escenario 3: Calcular balance

En caso de datos disponibles cuando se visualiza resumen el sistema muestra balance

3. Como administrador necesito registrar y gestionar pedidos por cobrar asociados a clientes, permitiendo actualizar su estado (pendiente, pagado o vencido) para dar seguimiento a los pagos pendientes.

Escenario 1: Registrar cuenta por cobrar

En caso de pedido pendiente cuando se genera el registro el sistema crea cuenta por cobrar

Escenario 2: Actualizar estado

En caso de pago recibido cuando se registra pago el sistema cambia a pagado

Escenario 3: Detectar vencimiento

En caso de fecha vencida cuando no hay pago el sistema cambia a vencido

4. Como administrador necesito registrar y gestionar las cuentas por pagar a proveedores y servicios, permitiendo actualizar su estado (pendiente, pagado o vencido) para controlar las salidas de dinero.

Escenario 1: Registrar cuenta por pagar

En caso de obligación con proveedor cuando se crea registro el sistema guarda cuenta

Escenario 2: Actualizar estado

En caso de pago realizado cuando se registra pago el sistema marca como pagado

Escenario 3: Marcar vencido

En caso de fecha superada cuando no se paga el sistema actualiza estado

5. Como administrador necesito recibir alertas de pagos o cobros próximos a vencerse para evitar atrasos.

Escenario 1: Detectar próximos vencimientos

En caso de fechas cercanas cuando se aproxima vencimiento el sistema genera alerta

Escenario 2: Notificar usuario

En caso de alerta activa cuando accede al sistema el sistema muestra notificación

Escenario 3: Evitar duplicación

En caso de alerta ya emitida cuando persiste condición el sistema no repite alerta





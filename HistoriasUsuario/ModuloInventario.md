1. Como personal de proveeduría quiero un formulario para ingresar y poder visualizar y editar productos del sistema con sus características como nombre, categoría, estado (Activo/Inactivo), precio de compra, precio de venta, tipo de impuesto y stock.

Escenario 1: Registrar producto

En caso de producto nuevo cuando se ingresan los datos requeridos el sistema registra el producto

Escenario 2: Editar producto

En caso de cambios en información cuando se actualizan datos el sistema guarda los cambios

Escenario 3: Cambiar estado producto
En caso de producto inactivo/activo cuando se modifica el estado el sistema actualiza su disponibilidad

2. Como personal de ventas quiero consultar y filtrar el inventario por producto o categoría para verificar disponibilidad antes de registrar un pedido.

Escenario 1: Consultar inventario
En caso de productos registrados cuando el usuario accede al módulo el sistema muestra el listado

Escenario 2: Filtrar por categoría

En caso de múltiples productos cuando aplica filtro el sistema muestra productos filtrados

Escenario 3: Ver disponibilidad
En caso de consulta específica cuando selecciona un producto el sistema muestra el stock actual

3. Como personal de proveeduría quiero que el sistema registre automáticamente las salidas de productos asociadas a la confirmación de pedidos para evitar errores manuales.

Escenario 1: Descontar stock por pedido

En caso de pedido confirmado cuando se confirma el pedido el sistema descuenta las cantidades

Escenario 2: Validar stock disponible

En caso de stock insuficiente cuando se intenta confirmar pedido el sistema bloquea la acción

Escenario 3: Registrar movimiento

En caso de salida de inventario cuando se descuenta stock el sistema guarda el movimiento

4. Como personal de proveeduría quiero recibir alertas cuando el stock de un producto sea bajo para evitar desabastecimiento.

Escenario 1: Detectar stock bajo

En caso de stock mínimo definido cuando el stock baja del límite el sistema genera alerta

Escenario 2: Notificar usuario

En caso de alerta generada cuando el usuario accede al sistema el sistema muestra notificación

Escenario 3: Evitar alertas duplicadas

En caso de alerta activa cuando el stock sigue bajo el sistema no repite la alerta

5. Como personal de proveeduría quiero consultar y filtrar el historial de movimientos de inventario para mantener trazabilidad.

Escenario 1: Consultar historial

En caso de movimientos registrados cuando el usuario accede el sistema muestra los movimientos

Escenario 2: Filtrar movimientos

En caso de múltiples registros cuando aplica filtros el sistema muestra resultados

Escenario 3: Ver detalle de movimiento

En caso de consulta específica cuando selecciona un registro el sistema muestra información detallada


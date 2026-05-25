1. Como personal de ventas quiero un formulario para registrar, editar y confirmar órdenes de pedido con datos del cliente, productos solicitados, cantidades, fechas y estado (Confirmado/Cancelado/Entregado) para registrar las solicitudes de compra.

Escenario 1: Registrar pedido

En caso de cliente y productos válidos cuando se completa el formulario el sistema crea el pedido en estado pendiente

Escenario 2: Editar pedido

En caso de pedido no confirmado cuando se modifican productos o cantidades el sistema actualiza el pedido

Escenario 3: Confirmar pedido

En caso de datos correctos cuando se confirma el sistema cambia el estado a confirmado

2. Como personal de ventas quiero cancelar pedidos cuando el cliente lo solicite para mantener actualizado el registro de órdenes.

Escenario 1: Cancelar pedido

En caso de solicitud del cliente cuando el usuario cancela el sistema cambia el estado a cancelado

Escenario 2: Restringir cancelación

En caso de pedido entregado cuando intenta cancelar el sistema bloquea la acción

Escenario 3: Registrar motivo

En caso de cancelación cuando se cancela el sistema guarda el motivo

3. Como administrador quiero visualizar los clientes más frecuentes y los productos más solicitados para apoyar la toma de decisiones comerciales.

Escenario 1: Identificar clientes frecuentes

En caso de historial de pedidos cuando se consulta el sistema muestra ranking de clientes

Escenario 2: Identificar productos más vendidos

En caso de datos históricos cuando se analiza el sistema muestra productos destacados

Escenario 3: Filtrar análisis

En caso de diferentes periodos cuando se aplica filtro el sistema muestra resultados filtrados

4. Como personal de logística, quiero visualizar y filtrar los pedidos confirmados por fecha o estado para coordinar el despacho de los productos.

Escenario 1: Ver pedidos confirmados

En caso de pedidos registrados cuando accede logística el sistema muestra pedidos confirmados

Escenario 2: Filtrar pedidos

En caso de múltiples pedidos cuando aplica filtros el sistema muestra resultados

Escenario 3: Ver detalle pedido

En caso de selección cuando abre pedido el sistema muestra información complet

5. Como personal de ventas quiero que el sistema calcule automáticamente el subtotal, impuestos y total de cada pedido según los productos seleccionados.

Escenario 1: Calcular subtotal

En caso de productos agregados cuando se agregan productos el sistema calcula subtotal

Escenario 2: Calcular impuestos

En caso de productos con impuesto cuando se procesa el pedido el sistema calcula impuestos

Escenario 3: Calcular total

En caso de pedido completo cuando se visualiza resumen el sistema muestra total final

6. Como personal de logística quiero visualizar la información del cliente, asociada a un pedido para coordinar entregas correctamente.

Escenario 1: Ver cliente del pedido

En caso de pedido con cliente cuando se abre el detalle el sistema muestra datos del cliente

Escenario 2: Mostrar datos de entrega

En caso de logística cuando consulta pedido el sistema muestra dirección y teléfono

Escenario 3: Restringir edición

En caso de usuario logística cuando intenta modificar datos el sistema no permite cambios


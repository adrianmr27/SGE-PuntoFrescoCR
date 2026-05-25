1. Como personal de proveeduría quiero un formulario para registrar órdenes de compra a proveedores indicando proveedor, productos, cantidades, precios y fecha para registrar las adquisiciones de inventario tambien filtrar por compras realizadas, proveedores o fecha para consultar historial.

Escenario 1: Registrar orden de compra

En caso de proveedores y productos existentes cuando el usuario completa el formulario y guarda el sistema registra la orden con estado pendiente

Escenario 2: Validar datos de la orden

En caso de datos incompletos o inválidos cuando intenta guardar la orden el sistema muestra mensajes indicando los campos requeridos

Escenario 3: Filtrar órdenes de compra

En caso de múltiples órdenes registradas cuando el usuario aplica filtros por proveedor o fecha el sistema muestra las órdenes que coinciden

2. Como personal de proveeduría quiero editar o cancelar órdenes de compra antes de ser confirmadas para corregir errores en la solicitud.

Escenario 1: Editar orden pendiente

En caso de orden no confirmada cuando el usuario modifica productos o cantidades el sistema actualiza la orden

Escenario 2: Cancelar orden
En caso de error en la solicitud cuando el usuario cancela la orden el sistema cambia el estado a cancelado

Escenario 3: Restringir edición

En caso de orden confirmada cuando intenta editar o cancelar el sistema bloquea la acción

3. Como personal de proveeduría quiero confirmar una orden de compra para que el sistema registre automáticamente la entrada de los productos al inventario.

Escenario 1: Confirmar orden

En caso de orden válida y pendiente cuando el usuario confirma la orden el sistema cambia el estado a confirmada

Escenario 2: Actualizar inventario
En caso de orden confirmada cuando se confirma el sistema incrementa el stock de los productos

Escenario 3: Evitar doble confirmación

En caso de orden ya confirmada cuando intenta confirmar nuevamente el sistema bloquea la acción
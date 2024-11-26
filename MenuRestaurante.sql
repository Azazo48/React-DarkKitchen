DROP TABLE IF EXISTS `ordenes`;
CREATE TABLE `ordenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productos` json DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `verificado` boolean DEFAULT False,
  `cancelada` boolean DEFAULT False,
  `pagada` boolean DEFAULT False,
  `tipoPago` varchar(15) DEFAULT NULL,
  `completada` boolean DEFAULT False,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` int NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

LOCK TABLES `productos` WRITE;
INSERT INTO `productos` VALUES (1,'Pizza',5.00),(2,'Hamburguesa',7.00),(3,'Tacos',3.00),(4,'Pasta',4.00),(5,'Papas',15.00),(6,'Pulpo',200.00);
UNLOCK TABLES;

DROP PROCEDURE IF EXISTS `aceptarOrden`;
DELIMITER ;;
CREATE PROCEDURE `aceptarOrden`(idorden int)
BEGIN
  UPDATE ordenes SET verificado = TRUE WHERE id = idorden;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS `cumpletarOrden`;
DELIMITER ;;
CREATE PROCEDURE `cumpletarOrden`(idorden int)
BEGIN
  UPDATE ordenes SET completada = TRUE WHERE id = idorden;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS `guardarOrden`;
DELIMITER ;;
CREATE PROCEDURE `guardarOrden`(insertProductos JSON, insertTotal DECIMAL(10, 2))
BEGIN
  INSERT INTO ordenes (productos, total) VALUES (insertProductos, insertTotal);
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS `pagarOrden`;
DELIMITER ;;
CREATE PROCEDURE `pagarOrden`(idorden int, tipoDePago varchar(15))
BEGIN
  UPDATE ordenes SET pagada = TRUE, tipoPago = tipoDePago WHERE id = idorden;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS `rechazarOrden`;
DELIMITER ;;
CREATE PROCEDURE `rechazarOrden`(idorden int)
BEGIN
  UPDATE ordenes SET cancelada = TRUE WHERE id = idorden;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS `verOrdenesCocina`;
DELIMITER ;;
CREATE PROCEDURE `verOrdenesCocina`()
BEGIN
    SELECT 
        ol.id AS orden_id,
        ol.verificado,
        ol.completada,
        JSON_ARRAYAGG(p.nombre) AS productos_nombres,
        JSON_ARRAYAGG(III.cantidad) AS productos_cantidad
    FROM ordenes ol
    JOIN JSON_TABLE(ol.productos, '$[*]' COLUMNS (
        id INT PATH '$.id',
        cantidad INT PATH '$.cantidad'
    )) AS III 
    JOIN productos p ON III.id = p.id
    WHERE ol.cancelada = FALSE
    GROUP BY ol.id;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS `verOrdenesPago`;
DELIMITER ;;
CREATE PROCEDURE `verOrdenesPago`()
BEGIN
    SELECT 
        o.id AS orden_id,
        JSON_ARRAYAGG(p.nombre) AS productos_nombres,
        JSON_ARRAYAGG(III.cantidad) AS productos_cantidad,
        o.total
    FROM ordenes o
    JOIN JSON_TABLE(o.productos, '$[*]' COLUMNS (
        id INT PATH '$.id',
        cantidad INT PATH '$.cantidad'
    )) AS III 
    JOIN productos p ON III.id = p.id
    WHERE o.cancelada = FALSE
      AND o.pagada = FALSE
      AND o.verificado = TRUE
    GROUP BY o.id;
END ;;
DELIMITER ;

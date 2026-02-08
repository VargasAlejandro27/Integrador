# 📊 Documentación Técnica de Base de Datos

## 1) Justificación técnica (PostgreSQL + MongoDB)
**PostgreSQL (transaccional)** se usa para entidades críticas y altamente consistentes (usuarios, roles, autenticación). Provee:
- **ACID**, transacciones y control de integridad referencial.
- **Restricciones** (CHECK, UNIQUE, NOT NULL) y **triggers**.
- **Vistas** y consultas agregadas para reportes.

**MongoDB (NoSQL)** se usa para los **cálculos de huella** porque:
- Los cálculos son **documentos flexibles** con datos variables.
- Escala horizontal y facilita almacenar resultados y metadata sin rigidez de esquema.
- Permite consultas rápidas por usuario con índices.

Esta separación cumple requerimientos funcionales (cálculos y usuarios) y no funcionales (consistencia, escalabilidad y rapidez en lecturas).

---

## 2) Modelo de datos (PostgreSQL)

```mermaid
erDiagram
  USERS {
    INT id PK
    VARCHAR email UNIQUE
    VARCHAR name
    VARCHAR password_hash
    VARCHAR role
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  AUDIT_LOG {
    BIGINT id PK
    TEXT table_name
    TEXT operation
    INT record_id
    TIMESTAMP changed_at
    TEXT changed_by
    JSONB old_data
    JSONB new_data
  }

  USERS ||--o{ AUDIT_LOG : audited_changes
```

### Claves y restricciones
- `users.email` **UNIQUE** y con **CHECK** de formato.
- `users.role` con **CHECK** de valores permitidos (`user`, `admin`).
- `users.name` con **CHECK** de longitud mínima.
- `users.created_at` y `users.updated_at` con **DEFAULT**.

---

## 3) Validaciones en DB (replicadas del front-end)
En PostgreSQL se implementaron:
- **CHECK** para formato de email.
- **CHECK** para longitud de `name`.
- **CHECK** para roles válidos.
- **UNIQUE** para `email`.

En MongoDB se aplicaron **validaciones de esquema** con Mongoose:
- Valores numéricos **>= 0** en emisiones.
- `level` como **enum**.
- `name` con longitud máxima.

---

## 4) Stored procedures y transacciones
Se implementaron procedimientos para reglas de negocio:
- `register_user(...)`: registra usuario y normaliza email.
- `update_user_profile(...)`: actualiza nombre y email.

Las operaciones críticas (registro y actualización) usan transacciones:
- `BEGIN TRANSACTION`
- `COMMIT`
- `ROLLBACK` en caso de error

---

## 5) Auditoría
Se implementó tabla **audit_log** con trigger para `users`:
- Guarda `INSERT`, `UPDATE`, `DELETE`.
- Registra usuario de base de datos (`current_user`), fecha y cambios antes/después.

---

## 6) Reportes con vistas (views)
Se añadieron vistas agregadas:
- `v_user_role_counts`: conteo de usuarios por rol.
- `v_user_activity_summary`: resumen de cambios por usuario (audit_log + users).

---

## 7) Seguridad y cifrado
- **Contraseñas** almacenadas con **bcrypt** (hash irreversible).
- **Sesiones** firmadas con `SESSION_SECRET`.
- Recomendación de **TLS/SSL** para conexiones externas.
- **Principio de mínimo privilegio** en usuarios de BD.
- **Backups** periódicos y monitoreo de logs.

---

## 8) Plan de políticas de seguridad (resumen)
- **Sistema operativo**: Windows 10/11 (desarrollo), Linux (producción recomendado).
- **Infraestructura**: on-premise (laboratorio) o cloud (VPS/VM).
- **Motor de BD**: PostgreSQL 14+ y MongoDB 6+.
- **Controles de acceso**: usuarios con permisos mínimos; rotación de credenciales.
- **Encriptación**: bcrypt para contraseñas; TLS para conexiones externas.
- **Respaldos**: backups automáticos diarios + pruebas de restauración.
- **Monitoreo**: logs de autenticación, métricas de BD y alertas.
- **Gestión de vulnerabilidades**: actualización periódica de dependencias y SO.

---

## 9) Ubicación de la implementación
- PostgreSQL: [db.js](db.js)
- MongoDB schema: [mongo-db.js](mongo-db.js)
- Lógica de autenticación: [auth.js](auth.js)

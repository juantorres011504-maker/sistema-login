create database iniciar_sesion;
use iniciar_sesion;

create table usuarios (
	id_usuario	int auto_increment primary key,
    nombre		varchar(100) not null,
    email		varchar(100) not null unique,
    contraseña	varchar(40) not null,
    rol			enum('usuario', 'admin') default 'usuario',
    creado		timestamp default current_timestamp
);

create table actividades(
	id_actividad	int auto_increment primary key,
    usuario_id		int not null,
    accion			varchar(100) not null,
    descripcion		text,
    creado			timestamp default current_timestamp,
    foreign key (usuario_id) references usuarios(id_usuario) on delete cascade
);

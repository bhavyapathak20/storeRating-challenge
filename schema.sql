create table store(
	id SERIAL primary key,
	store_name varchar(100),
	store_owner varchar(50),
	store_email varchar(90) unique,
	store_address varchar(200)
)


create table admin(
	id serial primary key,
	admin_name varchar(100),
	admin_email varchar(100) unique,
	admin_address varchar(200),
	admin_password varchar(100)
)
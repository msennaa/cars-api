create table ride (
	ride_id uuid,
	passenger_id uuid,
	driver_id uuid,
	status text,
	fare numeric,
	distance numeric,
	from_lat numeric,
	from_long numeric,
	to_lat numeric,
	to_long numeric,
	date timestamp
);

create table position (
	position_id uuid,
	ride_id uuid,
	lat numeric,
	long numeric,
	date timestamp
);

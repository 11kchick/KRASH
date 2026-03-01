-- Add start and end dates to trips
ALTER TABLE public.trips
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;
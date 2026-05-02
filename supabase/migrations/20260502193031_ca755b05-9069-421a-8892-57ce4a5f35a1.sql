
CREATE TABLE public.download_stats (
  id INT PRIMARY KEY DEFAULT 1,
  count BIGINT NOT NULL DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.download_stats (id, count) VALUES (1, 0);

ALTER TABLE public.download_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read downloads"
  ON public.download_stats FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.increment_downloads()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE public.download_stats
  SET count = count + 1
  WHERE id = 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_downloads() TO anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.download_stats;
ALTER TABLE public.download_stats REPLICA IDENTITY FULL;

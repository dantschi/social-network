DROP TABLE  IF EXISTS friendships ;
CREATE TABLE friendships(
id SERIAL PRIMARY KEY,
sender_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
receiver_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
accepted BOOLEAN DEFAULT FALSE NOT NULL
);

--
--
-- SELECT random_between(1,100)
-- FROM generate_series(1,5);
--
create unique index idx_unique_sender
 on friendships (least(sender_id, receiver_id),greatest(sender_id, receiver_id));


CREATE OR REPLACE FUNCTION random_between(low INT ,high INT)
   RETURNS INT AS
$$
BEGIN
   RETURN floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;


CREATE OR REPLACE FUNCTION random_accept()
   RETURNS INT AS
$$
BEGIN
   floor(random()* 10);
END;
$$ language 'plpgsql' STRICT;


CREATE OR REPLACE FUNCTION random_accept()
   RETURNS BOOLEAN AS
$$
DECLARE
    f int:=ROUND(random());
BEGIN

    IF f > 0 THEN
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ language 'plpgsql' STRICT;




do $$
DECLARE user_count int:=200;
DECLARE frinedhsips_count int:=50;
begin
for r in 10..user_count loop
    for i in 1..frinedhsips_count loop
        insert into friendships (sender_id,receiver_id,accepted)
        values(r,(SELECT random_between(10,user_count)),(SELECT random_accept()))
        ON CONFLICT (least(sender_id, receiver_id),greatest(sender_id, receiver_id))
        DO NOTHING;
    end loop;
end loop;
    delete from friendships where sender_id=receiver_id;
end;
$$;

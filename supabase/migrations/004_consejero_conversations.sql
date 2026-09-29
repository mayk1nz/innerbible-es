-- Tu Consejero Bíblico: conversations. Each message belongs to one conversation; the member
-- starts a new one ("Nueva conversación") and can reopen any past one from the history.
-- The messages written before this migration become one conversation per member.

alter table public.consejero_messages add column if not exists conversation_id uuid;

update public.consejero_messages m
set conversation_id = s.cid
from (select email, gen_random_uuid() as cid from public.consejero_messages where conversation_id is null group by email) s
where m.email = s.email and m.conversation_id is null;

create index if not exists consejero_messages_conv_idx on public.consejero_messages (email, conversation_id, created_at);

-- The Polish site shares this database (tables with the pl_ prefix).
do $$
begin
  if to_regclass('public.pl_consejero_messages') is not null then
    alter table public.pl_consejero_messages add column if not exists conversation_id uuid;
    update public.pl_consejero_messages m
    set conversation_id = s.cid
    from (select email, gen_random_uuid() as cid from public.pl_consejero_messages where conversation_id is null group by email) s
    where m.email = s.email and m.conversation_id is null;
    create index if not exists pl_consejero_messages_conv_idx on public.pl_consejero_messages (email, conversation_id, created_at);
  end if;
end $$;

notify pgrst, 'reload schema';

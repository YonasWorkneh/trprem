-- RLS for support_tickets and support_messages
-- Run this if support ticket status updates are denied (e.g. by RLS).

-- Enable RLS on support tables (idempotent)
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- support_tickets: users can view and create their own; admins can do everything
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own tickets" ON public.support_tickets;
CREATE POLICY "Users can create own tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
CREATE POLICY "Admins can view all tickets" ON public.support_tickets
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all tickets" ON public.support_tickets;
CREATE POLICY "Admins can update all tickets" ON public.support_tickets
    FOR UPDATE USING (public.is_admin());

-- support_messages: users can view/send for their tickets; admins can view and insert
DROP POLICY IF EXISTS "Users can view messages for own tickets" ON public.support_messages;
CREATE POLICY "Users can view messages for own tickets" ON public.support_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.support_tickets t
            WHERE t.id = support_messages.ticket_id AND t.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert messages for own tickets" ON public.support_messages;
CREATE POLICY "Users can insert messages for own tickets" ON public.support_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND EXISTS (
            SELECT 1 FROM public.support_tickets t
            WHERE t.id = ticket_id AND t.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can view all messages" ON public.support_messages;
CREATE POLICY "Admins can view all messages" ON public.support_messages
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert messages" ON public.support_messages;
CREATE POLICY "Admins can insert messages" ON public.support_messages
    FOR INSERT WITH CHECK (public.is_admin());

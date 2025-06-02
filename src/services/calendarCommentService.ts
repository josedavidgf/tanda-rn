import { getDbWithAuth } from '@/lib/supabase';
import { endOfMonth, format } from 'date-fns';

export async function getCommentByDate(workerId: string, date: string, token: string) {
    const db = getDbWithAuth(token);
    const { data, error } = await db
        .from('calendar_comments')
        .select('comment_id, comment, date')
        .eq('worker_id', workerId)
        .eq('date', date)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
}

export async function getCommentsByMonth(token: string, workerId: string, year: number, month: number) {
      const from = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = endOfMonth(new Date(year, month - 1));
      const to = format(endDate, 'yyyy-MM-dd');
    const db = getDbWithAuth(token);

    const { data, error } = await db
        .from('calendar_comments')
        .select('comment_id, comment, date')
        .eq('worker_id', workerId)
        .gte('date', from)
        .lte('date', to)

    if (error) throw new Error(error.message);
    return data;
}

export async function upsertComment(
    { workerId, date, comment }: { workerId: string, date: string, comment: string },
    token: string
) {
    const db = getDbWithAuth(token);

    const { data, error } = await db
        .from('calendar_comments')
        .upsert(
            { worker_id: workerId, date, comment },
            { onConflict: 'worker_id,date' }
        )
        .select('comment_id, comment, date')
        .single();

    if (error) throw new Error(error.message);
    return data;
}



export async function deleteComment(commentId: string, token: string) {
    const db = getDbWithAuth(token);
    const { error } = await db
        .from('calendar_comments')
        .delete()
        .eq('comment_id', commentId);

    if (error) throw new Error(error.message);
    return true;
}

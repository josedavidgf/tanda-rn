import { getDbWithAuth } from '@/lib/supabase';

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

export async function getCommentsByMonth(workerId: string, year: number, month: number, token: string) {
    const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = `${year}-${String(month).padStart(2, '0')}-31`;
    const db = getDbWithAuth(token);

    const { data, error } = await db
        .from('calendar_comments')
        .select('comment_id, comment, date')
        .eq('worker_id', workerId)
        .gte('date', firstDay)
        .lte('date', lastDay)

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

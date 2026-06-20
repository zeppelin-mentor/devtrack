import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { AdminDashboardStats } from '@/types';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Get total counts
    const [usersCount, projectsCount, pagesCount, portfolioCount, announcementsCount] = await Promise.all([
      supabaseAdmin.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('projects').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('pages').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('portfolio_projects').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('announcements').select('id', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    // Get weekly analytics (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: weeklyData, error: analyticsError } = await supabaseAdmin
      .from('platform_analytics')
      .select('*')
      .gte('date', sevenDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (analyticsError) {
      console.error('Analytics error:', analyticsError);
    }

    const stats: AdminDashboardStats = {
      totalUsers: usersCount.count || 0,
      totalProjects: projectsCount.count || 0,
      totalPages: pagesCount.count || 0,
      totalPortfolioProjects: portfolioCount.count || 0,
      activeAnnouncements: announcementsCount.count || 0,
      weeklyAnalytics: weeklyData || [],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

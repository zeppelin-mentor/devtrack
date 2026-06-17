import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trackmydevelopement.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Fetch dynamic content for sitemap entries
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch public portfolios
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('username, updated_at')
        .eq('is_public', true);

      if (profiles && profiles.length > 0) {
        const portfolioRoutes: MetadataRoute.Sitemap = profiles.map((profile) => ({
          url: `${baseUrl}/portfolio/${profile.username}`,
          lastModified: new Date(profile.updated_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
        staticRoutes.push(...portfolioRoutes);
      }
      
      // Fetch public pages
      const { data: pages } = await supabase
        .from('pages')
        .select('id, updated_at')
        .eq('is_public', true)
        .eq('status', 'published');

      if (pages && pages.length > 0) {
        const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
          url: `${baseUrl}/pages/${page.id}`,
          lastModified: new Date(page.updated_at),
          changeFrequency: 'weekly',
          priority: 0.6,
        }));
        staticRoutes.push(...pageRoutes);
      }
    }
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }

  return staticRoutes;
}

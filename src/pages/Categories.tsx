import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { DEFAULT_SITE_URL, absoluteUrl } from '../lib/seo';
import { GeoAnswerCapsule } from '../components/seo/GeoAnswerCapsule';

const categorySeoHints: Record<string, string> = {
  'glp peptides': 'GLP and incretin-mimetic research peptides for UK metabolic pathway models.',
  'ghrp peptides': 'GHRP secretagogue peptides for UK GH axis laboratory research.',
  'kpv peptides': 'KPV tripeptide listings for UK inflammatory pathway studies.',
  'igf peptides': 'IGF axis peptides for UK anabolic signalling research workflows.',
};

function categoryHint(name: string, description?: string | null) {
  if (description?.trim()) return description;
  const key = name.toLowerCase();
  for (const [pattern, hint] of Object.entries(categorySeoHints)) {
    if (key.includes(pattern.replace(' peptides', '')) || key.includes(pattern)) return hint;
  }
  return `Browse ${name} research peptides for UK laboratory use — compare catalog listings, documentation signals, and research-only compliance before ordering.`;
}

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Seo
        path="/categories"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': absoluteUrl('/categories', DEFAULT_SITE_URL) + '#collection',
          name: 'UK Research Peptide Categories',
          url: absoluteUrl('/categories', DEFAULT_SITE_URL),
          about: ['uk research peptides', 'GLP peptides', 'GHRP peptides', 'KPV peptide', 'IGF peptide'],
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: categories.map((category, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: category.name,
              url: absoluteUrl(`/search?category=${category.slug}`, DEFAULT_SITE_URL),
            })),
          },
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1>UK Research Peptide Categories</h1>
          <p className="text-gray-500 mt-4 font-medium italic max-w-3xl mx-auto">
            Browse UK research peptides by compound class — from GLP and GHRP pathways to KPV, IGF, and specialist groups.
          </p>
        </div>

        <GeoAnswerCapsule className="mb-10 text-left max-w-3xl mx-auto" />

        <section id="uk-research-peptides" className="max-w-3xl mx-auto mb-12 text-sm text-gray-600 leading-relaxed space-y-4">
          <p>
            <strong>UK research peptides</strong> are easier to compare when grouped by pathway and handling context.
            Use this hub to narrow GLP incretin lines, GHRP secretagogues, KPV tripeptides, IGF axis compounds, and
            related catalog classes before you{' '}
            <Link to="/shop" className="text-blue-600 font-semibold hover:underline">
              buy research peptides UK
            </Link>
            .
          </p>
          <p>
            Each category links to filtered catalog results. Verify batch documentation in the{' '}
            <Link to="/coas" className="text-blue-600 font-semibold hover:underline">
              COA library
            </Link>{' '}
            and read pathway context in our{' '}
            <Link to="/peptide-research" className="text-blue-600 font-semibold hover:underline">
              peptide research briefs
            </Link>{' '}
            (including{' '}
            <Link to="/peptide-research#glp-3" className="text-blue-600 font-semibold hover:underline">
              GLP-3 research notes
            </Link>
            ). All products are for laboratory research only.
          </p>
        </section>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600 mb-4">No categories found.</p>
            <Link to="/shop" className="text-blue-600 font-semibold hover:underline">
              Browse the full research peptide catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/search?category=${category.slug}`}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2">{category.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{categoryHint(category.name, category.description)}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

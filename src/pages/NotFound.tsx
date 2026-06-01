import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found | Research Peptides UK"
        description="The requested Research Peptides UK page could not be found."
        robots="noindex, nofollow"
      />
      <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-xl text-center bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-xl shadow-blue-900/5">
          <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Search className="h-8 w-8 text-blue-600" aria-hidden />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Page not found</h1>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            This URL is not part of the current research peptide catalog or support library.
            Use the catalog or search page to continue browsing research-use resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-blue-700"
            >
              Open Catalog
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-black uppercase tracking-widest text-gray-700 hover:border-blue-200 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

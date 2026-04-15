import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import Markdown from 'react-markdown';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single();
        if (data) setPost(data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading article...</div>;
  if (!post) return <div className="p-8 text-center">Article not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
      </Link>
      
      <article>
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            <time dateTime={post.created_at}>
              {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
            </time>
          </div>
        </header>

        {post.image_url && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-md">
            <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover max-h-96" />
          </div>
        )}

        <div className="prose prose-blue prose-lg max-w-none text-gray-700">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
    </div>
  );
}

"use client"

import { useEffect, useState } from "react"
import { api } from "../api"
import PostCard from "../components/PostCard"
import { useSearchParams } from "react-router-dom"

import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"


export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [trending, setTrending] = useState([]);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, p, all] = await Promise.all([
        api("/posts/trending"),
        api(`/posts?q=${encodeURIComponent(q)}&sort=latest`),
        api("/posts?sort=latest"),
      ]);
      setTrending(t.posts || []);
      setPosts(p.posts || []);
      setAllPosts(all.posts || []);
    } catch (err) {
      setError(err.message || "Failed to load posts");
      setTrending([]);
      setPosts([]);
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [q]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 animate-fade">
      <section className="mb-8">
        <form
          onSubmit={e => {
            e.preventDefault();
            setSearchParams(q ? { q } : {});
            fetchData();
          }}
          className="flex gap-2 items-center"
        >
          <Input
            value={q}
            onChange={e => setSearchParams({ q: e.target.value })}
            placeholder="Search posts..."
            className="flex-1 border border-border rounded-xl px-4 py-2 shadow-pretty focus:ring-2 focus:ring-primary/40 transition-all"
          />
          <Button type="submit" className="bg-primary text-white rounded-xl px-6 py-2 shadow-pretty hover:bg-indigo-700 transition-all text-center justify-center">Search</Button>
        </form>
      </section>
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Latest Posts</h1>
        {loading ? (
          <div className="text-lg text-muted animate-pulse">Loading...</div>
        ) : error ? (
          <div className="text-red-500 font-semibold">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-muted">No posts found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Trending</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {trending.map(post => (
            <div className="min-w-[320px]" key={post._id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-primary">All Blogs</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {allPosts.map((p) => (
              <PostCard key={p._id || p.slug} post={p} />
            ))}
            {allPosts.length === 0 && !error && <p className="muted">No posts found.</p>}
          </div>
        )}
      </section>
    </main>
  );
}

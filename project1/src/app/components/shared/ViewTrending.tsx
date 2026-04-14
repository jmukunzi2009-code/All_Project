import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { TrendingUp, AlertCircle, Info, Image as ImageIcon, Video } from 'lucide-react';
import { getTrendingPosts } from '../../lib/storage';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { TrendingPost } from '../../types';

export const ViewTrending = () => {
  const [posts, setPosts] = useState<TrendingPost[]>([]);

  useEffect(() => {
    loadPosts();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPosts = () => {
    const allPosts = getTrendingPosts();
    setPosts(allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      urgent: { color: 'bg-red-100 text-red-800 border-red-300', icon: AlertCircle },
      high: { color: 'bg-[#e7ac3e] text-[#043c04] border-[#e7ac3e]', icon: Info },
      normal: { color: 'bg-[#e2dede] text-[#5d3010] border-[#e2dede]', icon: Info },
    };
    const config = configs[priority as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Badge className={config.color + ' border'}>
        <Icon className="w-3 h-3 mr-1" />
        {priority}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#043c04]">Trending Updates</h2>
        <p className="text-[#5d3010] mt-1">Important announcements and updates from social workers</p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="border-2 border-[#e2dede] hover:shadow-lg transition-all overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#043c04] to-[#5d3010] text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <CardTitle className="text-white">{post.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getPriorityBadge(post.priority)}
                    {post.tags.map((tag) => (
                      <Badge key={tag} className="bg-white/20 text-white border-white/30">{tag}</Badge>
                    ))}
                    {post.mediaType && (
                      <Badge className="bg-white/20 text-white border-white/30 flex items-center gap-1">
                        {post.mediaType === 'image' ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        {post.mediaType}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/90">{formatDate(post.createdAt)}</p>
                  <p className="text-xs text-white/90">by {post.authorName}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {post.mediaUrl && post.mediaType === 'image' && (
                <div className="mb-4 rounded-lg overflow-hidden border-2 border-[#e2dede]">
                  <ImageWithFallback 
                    src={post.mediaUrl} 
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              {post.mediaUrl && post.mediaType === 'video' && (
                <div className="mb-4 rounded-lg overflow-hidden border-2 border-[#e2dede]">
                  <video 
                    src={post.mediaUrl} 
                    controls 
                    className="w-full h-64 object-cover bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              <p className="text-[#5d3010] whitespace-pre-wrap leading-relaxed">{post.content}</p>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <p className="text-xs text-[#5d3010]/70 mt-3 italic border-t border-[#e2dede] pt-3">
                  Last updated: {formatDate(post.updatedAt)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <Card className="border-2 border-[#e2dede]">
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-12 h-12 text-[#e2dede] mx-auto mb-4" />
              <p className="text-[#5d3010]">No trending posts yet</p>
              <p className="text-sm text-[#5d3010]/70 mt-1">Check back later for updates</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
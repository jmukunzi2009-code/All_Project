import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, TrendingUp, Trash2, Edit, Image, Video } from 'lucide-react';
import { toast } from 'sonner';
import { getTrendingPosts, saveTrendingPosts, generateId, addActivityLog } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { TrendingPost } from '../../types';

export const ManageAnnouncements = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<TrendingPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'normal' | 'high' | 'urgent',
    tags: '',
    mediaUrl: '',
    mediaType: '' as '' | 'image' | 'video',
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const allPosts = getTrendingPosts();
    setPosts(allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleSavePost = () => {
    if (!user || !newPost.title || !newPost.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const allPosts = getTrendingPosts();
    const tags = newPost.tags.split(',').map(t => t.trim()).filter(t => t);

    if (editingPost) {
      // Update existing post
      const updatedPosts = allPosts.map(p =>
        p.id === editingPost.id
          ? {
              ...p,
              title: newPost.title,
              content: newPost.content,
              priority: newPost.priority,
              tags,
              mediaUrl: newPost.mediaUrl || undefined,
              mediaType: newPost.mediaType || undefined,
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      saveTrendingPosts(updatedPosts);
      toast.success('Post updated successfully');
    } else {
      // Create new post
      const post: TrendingPost = {
        id: generateId('post'),
        title: newPost.title,
        content: newPost.content,
        authorId: user.id,
        authorName: `${user.firstName} ${user.lastName}`,
        priority: newPost.priority,
        tags,
        mediaUrl: newPost.mediaUrl || undefined,
        mediaType: newPost.mediaType || undefined,
        createdAt: new Date().toISOString(),
      };
      allPosts.push(post);
      saveTrendingPosts(allPosts);
      toast.success('Post created successfully');
    }

    addActivityLog({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: editingPost ? 'Update School Announcement' : 'Create School Announcement',
      details: `${editingPost ? 'Updated' : 'Created'} post: ${newPost.title}`,
    });

    setNewPost({ title: '', content: '', priority: 'normal', tags: '', mediaUrl: '', mediaType: '' });
    setEditingPost(null);
    setIsDialogOpen(false);
    loadPosts();
  };

  const handleEdit = (post: TrendingPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      priority: post.priority,
      tags: post.tags.join(', '),
      mediaUrl: post.mediaUrl || '',
      mediaType: post.mediaType || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const allPosts = getTrendingPosts();
    const updatedPosts = allPosts.filter(p => p.id !== postId);
    saveTrendingPosts(updatedPosts);

    if (user) {
      addActivityLog({
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role,
        action: 'Delete School Announcement',
        details: `Deleted school announcement`,
      });
    }

    toast.success('Post deleted successfully');
    loadPosts();
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-[#e7ac3e] text-[#043c04] border-[#e7ac3e]',
      normal: 'bg-[#e2dede] text-[#5d3010] border-[#e2dede]',
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-[#043c04]">Manage School Announcements</h2>
          <p className="text-[#5d3010] mt-1">Create and manage announcements with images and videos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingPost(null);
            setNewPost({ title: '', content: '', priority: 'normal', tags: '', mediaUrl: '', mediaType: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#043c04] hover:bg-[#032d03] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#043c04]">{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter post content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mediaType">Media Type (Optional)</Label>
                <Select value={newPost.mediaType} onValueChange={(value: any) => setNewPost({ ...newPost, mediaType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newPost.mediaType && (
                <div className="space-y-2">
                  <Label htmlFor="mediaUrl">Media URL</Label>
                  <Input
                    id="mediaUrl"
                    placeholder={`Enter ${newPost.mediaType} URL`}
                    value={newPost.mediaUrl}
                    onChange={(e) => setNewPost({ ...newPost, mediaUrl: e.target.value })}
                  />
                  <p className="text-xs text-[#5d3010]">
                    Paste a valid URL for the {newPost.mediaType}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newPost.priority} onValueChange={(value: any) => setNewPost({ ...newPost, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., Academic, Important"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSavePost} 
                className="w-full bg-[#e7ac3e] hover:bg-[#d49a2e] text-[#043c04] font-semibold"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="border-2 border-[#e2dede] hover:shadow-lg transition-all overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#043c04] to-[#5d3010] text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <CardTitle className="text-white">{post.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getPriorityColor(post.priority) + ' border'}>{post.priority}</Badge>
                    {post.tags.map((tag) => (
                      <Badge key={tag} className="bg-white/20 text-white border-white/30">{tag}</Badge>
                    ))}
                    {post.mediaType && (
                      <Badge className="bg-white/20 text-white border-white/30 flex items-center gap-1">
                        {post.mediaType === 'image' ? <Image className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        {post.mediaType}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(post)} className="hover:bg-white/20 text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="hover:bg-white/20 text-white">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {post.mediaUrl && post.mediaType === 'image' && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <ImageWithFallback 
                    src={post.mediaUrl} 
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              {post.mediaUrl && post.mediaType === 'video' && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <video 
                    src={post.mediaUrl} 
                    controls 
                    className="w-full h-64 object-cover bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              <p className="text-[#5d3010] whitespace-pre-wrap">{post.content}</p>
              <div className="mt-3 pt-3 border-t border-[#e2dede] flex items-center justify-between">
                <p className="text-xs text-[#5d3010]">
                  Posted by {post.authorName} on {new Date(post.createdAt).toLocaleString()}
                </p>
                {post.updatedAt && (
                  <p className="text-xs text-[#5d3010]">
                    Updated {new Date(post.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <Card className="border-2 border-[#e2dede]">
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-12 h-12 text-[#e2dede] mx-auto mb-4" />
              <p className="text-[#5d3010]">No trending posts yet</p>
              <p className="text-sm text-[#5d3010]/70 mt-1">Click "Create Post" to add your first announcement</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
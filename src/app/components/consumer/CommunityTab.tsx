import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, MessageCircle, Star, Send, Plus, ThumbsUp } from 'lucide-react';
import { sampleReviews, sampleUsers, sampleBatches, sampleHerbs } from '../../data/sampleData';
import { useAuth } from '../auth/AuthContext';

export function CommunityTab() {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  // Sample community posts
  const communityPosts = [
    {
      id: 1,
      type: 'question',
      author: 'Priya Reddy',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      time: '2 hours ago',
      content: 'Has anyone tried the Ashwagandha from Rajasthan farms? Looking for feedback on quality and effectiveness.',
      likes: 12,
      comments: 5,
      tags: ['Ashwagandha', 'Quality Question']
    },
    {
      id: 2,
      type: 'review',
      author: 'Rajesh Agarwal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      time: '5 hours ago',
      content: 'Amazing turmeric quality! The color and aroma are excellent. Been using it for my joint pain and seeing great results. Highly recommend to everyone.',
      batchId: 'AYU-TUR-2024-001234',
      rating: 5,
      likes: 24,
      comments: 8,
      tags: ['Turmeric', 'Review', 'Joint Health']
    },
    {
      id: 3,
      type: 'tip',
      author: 'Dr. Meera Sharma',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      time: '1 day ago',
      content: 'Pro tip: For maximum benefits from Ashwagandha, take it with warm milk before bedtime. The fat in milk helps with absorption.',
      likes: 45,
      comments: 12,
      tags: ['Ashwagandha', 'Usage Tip', 'Ayurveda']
    }
  ];

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      // In real app, would submit to backend
      console.log('New post:', newPost);
      setNewPost('');
      setShowNewPost(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm sm:text-base">Community</h3>
        <Button 
          size="sm" 
          onClick={() => setShowNewPost(!showNewPost)}
          className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">New </span>Post
        </Button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Share with Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Ask a question, share a tip, or write a review..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-20 text-sm sm:text-base"
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleSubmitPost} size="sm" className="text-xs sm:text-sm">
                <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Post
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)} className="text-xs sm:text-sm">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Posts */}
      <div className="space-y-4">
        {communityPosts.map(post => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-3">
                {/* Author Info */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback className="text-xs sm:text-sm">{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{post.author}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{post.time}</p>
                  </div>
                  <Badge variant="outline" className="capitalize text-xs">
                    {post.type}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <p className="text-gray-700">{post.content}</p>
                  
                  {/* Rating for reviews */}
                  {post.type === 'review' && post.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(post.rating)}
                      </div>
                      <span className="text-sm text-gray-600">({post.rating}/5)</span>
                      {post.batchId && (
                        <Badge variant="outline" className="text-xs">
                          Batch: {post.batchId}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag.replace(' ', '')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Popular Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['#Turmeric', '#Ashwagandha', '#QualityTips', '#AyurvedaBasics', '#JointHealth', '#StressRelief'].map(topic => (
              <Badge key={topic} variant="outline" className="cursor-pointer hover:bg-green-50 hover:border-green-300">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Be respectful and helpful to other community members</p>
            <p>• Share authentic experiences and honest reviews</p>
            <p>• Ask questions - our community loves to help!</p>
            <p>• Report any suspicious or inappropriate content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
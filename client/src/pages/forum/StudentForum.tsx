import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ChatBubbleLeftIcon, FireIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
  isLiked: boolean;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

const StudentForum: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setPosts([
          {
            _id: 'p1',
            title: 'Best practices for React hooks',
            content: 'I\'m learning about React hooks and would like to know some best practices...',
            author: {
              name: 'John Smith',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Web Development',
            createdAt: '2023-10-15T14:30:00Z',
            likes: 42,
            comments: 15,
            views: 215,
            tags: ['React', 'JavaScript', 'Hooks'],
            isLiked: false
          },
          {
            _id: 'p2',
            title: 'Career advice needed',
            content: 'I\'m a junior developer looking to transition into full-stack development...',
            author: {
              name: 'Sarah Johnson',
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            category: 'Career Advice',
            createdAt: '2023-10-16T09:15:00Z',
            likes: 28,
            comments: 8,
            views: 156,
            tags: ['Career', 'Full Stack', 'Advice'],
            isLiked: true
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      // Simulate fetching comments
      setComments([
        {
          _id: 'c1',
          content: 'Great question! Here are some tips I\'ve learned...',
          author: {
            name: 'Mike Wilson',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
          },
          createdAt: '2023-10-15T15:00:00Z',
          likes: 12,
          isLiked: false
        },
        {
          _id: 'c2',
          content: 'I recommend checking out the official React documentation...',
          author: {
            name: 'Emily Chen',
            avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
          },
          createdAt: '2023-10-15T16:30:00Z',
          likes: 8,
          isLiked: true
        }
      ]);
    }
  }, [selectedPost]);

  const filteredPosts = posts.filter(post => {
    if (filter !== 'all' && post.category !== filter) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !post.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment._id === commentId
          ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      )
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const comment: Comment = {
      _id: `new-${Date.now()}`,
      content: newComment,
      author: {
        name: 'Current User',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => [...prev, comment]);
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === selectedPost._id
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
    setNewComment('');
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading forum..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Forum</h1>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {!selectedPost ? (
        <>
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'all' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('Web Development')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'Web Development' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Web Development
                </button>
                <button
                  onClick={() => setFilter('Career Advice')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'Career Advice' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Career Advice
                </button>
                <button
                  onClick={() => setFilter('Interview Prep')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'Interview Prep' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Interview Prep
                </button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No posts found matching your criteria.</p>
                <button
                  onClick={() => {
                    setFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View All Posts
                </button>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-10 w-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FireIcon className="h-4 w-4 mr-1" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLikePost(post._id)}
                            className={`px-3 py-1 rounded-md ${
                              post.isLiked
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {post.isLiked ? 'Liked' : 'Like'}
                          </button>
                          <button
                            onClick={() => setSelectedPost(post)}
                            className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200"
                          >
                            View Discussion
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Post Detail View */}
          <div className="mb-8">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Posts
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-start">
              <img
                src={selectedPost.author.avatar}
                alt={selectedPost.author.name}
                className="h-12 w-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPost.title}</h2>
                <p className="text-gray-600 mb-4">{selectedPost.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPost.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FireIcon className="h-4 w-4 mr-1" />
                      <span>{selectedPost.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                      <span>{selectedPost.comments}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLikePost(selectedPost._id)}
                    className={`px-4 py-2 rounded-md ${
                      selectedPost.isLiked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPost.isLiked ? 'Liked' : 'Like'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
            
            {/* Add Comment */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            {comments.map(comment => (
              <div key={comment._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="h-8 w-8 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{comment.author.name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center text-sm ${
                          comment.isLiked ? 'text-red-600' : 'text-gray-500'
                        }`}
                      >
                        <FireIcon className="h-4 w-4 mr-1" />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentForum; 
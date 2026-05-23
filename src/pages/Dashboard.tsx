import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Eye, Edit, Download, BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Story {
  id: string;
  title: string | null;
  status: string | null;
  created_at: string;
  child_id: string | null;
  pdf_url: string | null;
  children?: {
    name: string;
  } | null;
}

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/sign-in');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    fetchStories();

    // Supabase Realtime: stories tablosundaki status değişikliklerini dinle
    const channel = supabase
      .channel(`dashboard-stories-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stories',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as Story;

          // State'i güncelle (yeniden fetch atmadan)
          setStories((prev) =>
            prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
          );

          // Kitap tamamlandıysa kullanıcıya bildir
          if (updated.status === 'completed') {
            toast({
              title: '📚 Kitabın hazır!',
              description: `"${updated.title || 'Hikayen'}" oluşturuldu. İndirebilirsin!`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          status,
          created_at,
          child_id,
          pdf_url,
          children (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories:', error);
        toast({
          title: "Error",
          description: "Failed to load your stories",
          variant: "destructive",
        });
        return;
      }

      setStories(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'generating':
        return 'bg-accent text-accent-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'Ready';
      case 'generating':
        return 'Creating...';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-hsl(var(--dashboard-bg)) flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-hsl(var(--dashboard-bg)) font-poppins">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Welcome back, {profile?.full_name || 'Storyteller'}! 
                <Sparkles className="inline-block ml-2 h-6 w-6 text-accent animate-sparkle" />
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to create magical adventures for your little ones?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-button font-medium group"
                onClick={() => navigate('/create-story')}
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                New Story
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-card">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full rounded-lg mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stories.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="bg-gradient-accent w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-magical">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              No stories yet. Let's create one together!
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start your magical journey by creating your first personalized story. 
              Upload your child's photo and watch the magic happen!
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-button"
              onClick={() => navigate('/create-story')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Story
            </Button>
          </div>
        ) : (
          // Stories Grid
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Your Stories</h2>
              <p className="text-muted-foreground">{stories.length} stories created</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card key={story.id} className="shadow-card hover:shadow-magical transition-all duration-200 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                          {story.title || 'Untitled Story'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {story.children?.name && `For ${story.children.name} • `}
                          {formatDate(story.created_at)}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(story.status)} text-xs`}>
                        {getStatusText(story.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for story thumbnail */}
                    <div className="bg-gradient-card h-32 rounded-lg mb-4 flex items-center justify-center border border-border">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={story.status !== 'completed' || !story.pdf_url}
                        onClick={() => {
                          if (story.pdf_url) {
                            window.open(story.pdf_url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        title={story.pdf_url ? 'PDF indir' : 'Henüz hazır değil'}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Search, Users, PlusCircle, CalendarDays, MessageCircle } from "lucide-react";

// Mock data for communities
const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: "Photography Enthusiasts",
    description: "Share your best shots and photography tips",
    members: 1248,
    category: "Art & Creativity",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Fitness Motivation",
    description: "Support and motivation for your fitness journey",
    members: 3502,
    category: "Health & Wellness",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Book Lovers Club",
    description: "Discussions about books, authors, and reading recommendations",
    members: 876,
    category: "Literature",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Cooking & Recipes",
    description: "Share recipes and cooking tips from around the world",
    members: 2105,
    category: "Food & Drink",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Travel Adventures",
    description: "Share travel stories, tips, and destinations",
    members: 1563,
    category: "Travel",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Tech Discussions",
    description: "Talk about the latest in technology, gadgets, and innovation",
    members: 4217,
    category: "Technology",
    image: "/placeholder.svg"
  }
];

// Mock data for community events
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Photography Workshop",
    date: "2023-08-15T14:00:00",
    community: "Photography Enthusiasts",
    attendees: 45
  },
  {
    id: 2,
    title: "Virtual Book Club Meeting",
    date: "2023-08-10T19:00:00",
    community: "Book Lovers Club",
    attendees: 32
  },
  {
    id: 3,
    title: "Group Fitness Challenge",
    date: "2023-08-20T09:00:00",
    community: "Fitness Motivation",
    attendees: 67
  }
];

const Communities = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter communities based on search and category
  const filteredCommunities = MOCK_COMMUNITIES.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? community.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(MOCK_COMMUNITIES.map(c => c.category)));
  
  const handleCreateCommunity = (name: string, description: string) => {
    toast({
      title: "Community Created",
      description: `Your community "${name}" has been created successfully.`
    });
  };
  
  const handleJoinCommunity = (communityId: number) => {
    const community = MOCK_COMMUNITIES.find(c => c.id === communityId);
    if (community) {
      toast({
        title: "Community Joined",
        description: `You have joined "${community.name}". Welcome!`
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto p-4">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Communities</h1>
            <p className="text-muted-foreground">
              Find and join communities based on your interests and connect with like-minded people
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Community
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Community</DialogTitle>
                    <DialogDescription>
                      Create a new community to connect with people who share your interests.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="communityName">Community Name</label>
                      <Input id="communityName" placeholder="Enter community name" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="communityDescription">Description</label>
                      <Textarea id="communityDescription" placeholder="Describe what this community is about" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="communityCategory">Category</label>
                      <Input id="communityCategory" placeholder="E.g., Art, Technology, Fitness" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => handleCreateCommunity("New Community", "Description")}>
                      Create Community
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <Card key={community.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={community.image} alt={community.name} />
                      <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{community.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {community.category} • {community.members.toLocaleString()} members
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {community.description}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      {community.members.toLocaleString()}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Active
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    Join Community
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Upcoming Events Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Upcoming Community Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_EVENTS.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.community}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center text-sm mt-2">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attendees} attending
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Join Event</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;

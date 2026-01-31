export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'student' | 'management';
  hostel: string;
  block: string;
  room: string;
  avatar?: string;
  
}


export interface Issue {
  _id: string; // ✅ MongoDB ID
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'cleanliness' | 'internet' | 'furniture' | 'other';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'reported' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  visibility: 'public' | 'private';
  location?: string;

  media?: string[]; // <--- Add this

  reportedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };

  createdAt: string;
  updatedAt: string;
}



export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Reaction {
  id: string;
  issueId: string;
  userId: string;
  type: 'like' | 'dislike' | 'urgent' | 'helpful';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'maintenance' | 'cleaning' | 'pest_control' | 'water' | 'electricity';
  targetHostel?: string;
  targetBlock?: string;
  targetRole?: 'student' | 'management' | 'all';
  createdBy: string;
  createdByUser: User;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  comments: Comment[];
  reactions: Reaction[];
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  reportedBy: string;
  reportedByUser: User;
  status: 'pending' | 'claimed' | 'closed';
  media: string[];
  claimedBy?: string;
  claimedByUser?: User;
  claimedAt?: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Analytics {
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  averageResolutionTime: number;
  categoryBreakdown: { category: string; count: number }[];
  hostelBreakdown: { hostel: string; count: number }[];
  priorityBreakdown: { priority: string; count: number }[];
  monthlyTrends: { month: string; reported: number; resolved: number }[];
}
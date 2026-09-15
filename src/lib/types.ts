// Firestore collection types for BEM FT UNIMMA

export interface User {
  uid: string;
  role: "admin" | "member";
  name: string;
  email: string;
  npm: string;
  division: string;
  isActive: boolean;
}

export interface Division {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface Structure {
  id: string;
  name: string;
  position: string;
  divisionId: string;
  photoUrl: string;
  order: number;
  period: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  divisionId: string;
  order: number;
  isPublished: boolean;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  isPublished: boolean;
  authorId: string;
}

export interface Settings {
  tagline: string;
  visionText: string;
  missionList: string[];
  stats: {
    activeMembers: number;
    programs: number;
    divisions: number;
    yearsActive: number;
  };
  contact: {
    email: string;
    instagram: string;
    address: string;
  };
}

export interface Event {
  id: string;
  title: string;
  location: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };
  startTime: string;
  endTime: string;
  divisionId: string;
  isActive: boolean;
}

export interface Attendance {
  eventId: string;
  uid: string;
  checkedInAt: string;
  location: {
    lat: number;
    lng: number;
  };
  distanceFromEvent: number;
  status: "present" | "late" | "absent";
  isFlagged: boolean;
}

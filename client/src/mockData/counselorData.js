// Mock data for counselor interface development
export const mockCases = [
  {
    id: 'A123',
    type: 'chat',
    lastActivity: new Date('2025-01-20T10:30:00'),
    status: 'active',
    lastMessage: "I've been feeling overwhelmed lately with my academic workload. Not sure how to handle it.",
    unreadCount: 2,
    chatHistory: [
      {
        id: 1,
        sender: 'student',
        message: "Hi, I'm struggling with managing my study schedule.",
        timestamp: new Date('2025-01-20T10:15:00')
      },
      {
        id: 2,
        sender: 'counselor',
        message: "I understand how overwhelming that can feel. Let's break down your schedule and see how we can make it more manageable.",
        timestamp: new Date('2025-01-20T10:20:00')
      },
      {
        id: 3,
        sender: 'student',
        message: "I've been feeling overwhelmed lately with my academic workload. Not sure how to handle it.",
        timestamp: new Date('2025-01-20T10:30:00')
      }
    ]
  },
  {
    id: 'A124',
    type: 'mood',
    lastActivity: new Date('2025-01-20T09:15:00'),
    status: 'active',
    moodReport: {
      mood: 'anxious',
      intensity: 4,
      timestamp: new Date('2025-01-20T09:15:00'),
      notes: "Feeling anxious about upcoming exams",
      triggers: ['academic pressure', 'lack of sleep'],
      symptoms: ['racing thoughts', 'difficulty concentrating']
    },
    moodHistory: [
      {
        mood: 'calm',
        intensity: 2,
        timestamp: new Date('2025-01-19T10:00:00'),
        notes: "Feeling better after meditation"
      },
      {
        mood: 'stressed',
        intensity: 4,
        timestamp: new Date('2025-01-19T15:30:00'),
        notes: "Project deadline approaching"
      },
      {
        mood: 'anxious',
        intensity: 4,
        timestamp: new Date('2025-01-20T09:15:00'),
        notes: "Feeling anxious about upcoming exams"
      }
    ]
  },
  {
    id: 'A125',
    type: 'both',
    lastActivity: new Date('2025-01-20T11:45:00'),
    status: 'active',
    lastMessage: "Thank you for your support. The breathing exercises really helped!",
    unreadCount: 0,
    moodReport: {
      mood: 'calm',
      intensity: 2,
      timestamp: new Date('2025-01-20T11:45:00'),
      notes: "Feeling more relaxed after practicing breathing exercises",
      triggers: ['positive coping strategies'],
      symptoms: ['reduced anxiety']
    },
    chatHistory: [
      {
        id: 1,
        sender: 'counselor',
        message: "How are the breathing exercises working for you?",
        timestamp: new Date('2025-01-20T11:30:00')
      },
      {
        id: 2,
        sender: 'student',
        message: "Thank you for your support. The breathing exercises really helped!",
        timestamp: new Date('2025-01-20T11:45:00')
      }
    ],
    moodHistory: [
      {
        mood: 'anxious',
        intensity: 4,
        timestamp: new Date('2025-01-19T14:00:00'),
        notes: "Feeling overwhelmed"
      },
      {
        mood: 'calm',
        intensity: 2,
        timestamp: new Date('2025-01-20T11:45:00'),
        notes: "Feeling more relaxed after practicing breathing exercises"
      }
    ]
  },
  {
    id: 'A126',
    type: 'chat',
    lastActivity: new Date('2025-01-19T16:20:00'),
    status: 'inactive',
    lastMessage: "I'll try the techniques you suggested and let you know how it goes.",
    unreadCount: 0,
    chatHistory: [
      {
        id: 1,
        sender: 'student',
        message: "I'm having trouble sleeping lately.",
        timestamp: new Date('2025-01-19T16:00:00')
      },
      {
        id: 2,
        sender: 'counselor',
        message: "I'm sorry to hear that. Let's discuss some sleep hygiene techniques that might help.",
        timestamp: new Date('2025-01-19T16:10:00')
      },
      {
        id: 3,
        sender: 'student',
        message: "I'll try the techniques you suggested and let you know how it goes.",
        timestamp: new Date('2025-01-19T16:20:00')
      }
    ]
  },
  {
    id: 'A127',
    type: 'both',
    lastActivity: new Date('2025-01-20T08:30:00'),
    status: 'active',
    lastMessage: "I'm feeling much better today after getting enough sleep.",
    unreadCount: 1,
    moodReport: {
      mood: 'energetic',
      intensity: 4,
      timestamp: new Date('2025-01-20T08:30:00'),
      notes: "Got 8 hours of sleep, feeling refreshed",
      triggers: ['good sleep', 'morning exercise'],
      symptoms: ['positive mood', 'high energy']
    },
    chatHistory: [
      {
        id: 1,
        sender: 'student',
        message: "I'm feeling much better today after getting enough sleep.",
        timestamp: new Date('2025-01-20T08:30:00')
      }
    ],
    moodHistory: [
      {
        mood: 'tired',
        intensity: 3,
        timestamp: new Date('2025-01-19T20:00:00'),
        notes: "Ready to try the new sleep schedule"
      },
      {
        mood: 'energetic',
        intensity: 4,
        timestamp: new Date('2025-01-20T08:30:00'),
        notes: "Got 8 hours of sleep, feeling refreshed"
      }
    ]
  }
];

export const moodTypes = {
  happy: {
    emoji: '😊',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20'
  },
  sad: {
    emoji: '😢',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20'
  },
  anxious: {
    emoji: '😰',
    color: 'text-red-400',
    bgColor: 'bg-red-400/20'
  },
  calm: {
    emoji: '😌',
    color: 'text-green-400',
    bgColor: 'bg-green-400/20'
  },
  stressed: {
    emoji: '😫',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20'
  },
  energetic: {
    emoji: '⚡',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20'
  },
  tired: {
    emoji: '😴',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20'
  },
  neutral: {
    emoji: '😐',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20'
  }
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

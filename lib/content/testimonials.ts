export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  prediction: 'boy' | 'girl';
  verified: boolean;
  image?: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    location: 'London, UK',
    rating: 5,
    text: "I was skeptical at first, but NubHub said BOY and our 20-week scan confirmed it! The anticipation was killing me and this gave me so much peace of mind. Worth every penny!",
    prediction: 'boy',
    verified: true,
    date: '2025-12-15',
  },
  {
    id: '2',
    name: 'Jessica Thompson',
    location: 'Manchester, UK',
    rating: 5,
    text: "Cannot recommend enough! They predicted girl at 12 weeks and our 20-week scan confirmed it. The detailed explanation they provided was fascinating. Thank you!",
    prediction: 'girl',
    verified: true,
    date: '2025-11-28',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    location: 'Birmingham, UK',
    rating: 5,
    text: "This service is incredible! I couldn't wait 8 more weeks to find out. The prediction was accurate and the refund guarantee made me feel totally safe trying it.",
    prediction: 'girl',
    verified: true,
    date: '2026-01-05',
  },
  {
    id: '4',
    name: 'Rachel Chen',
    location: 'Leeds, UK',
    rating: 5,
    text: "As a first-time mum, I was desperate to know! NubHub gave us our answer in under 2 hours. Our little boy is now 3 months old and we knew from week 12!",
    prediction: 'boy',
    verified: true,
    date: '2025-10-20',
  },
  {
    id: '5',
    name: 'Olivia Parker',
    location: 'Glasgow, UK',
    rating: 5,
    text: "Amazing service! The prediction was spot on and the customer service was fantastic. They answered all my questions about how nub theory works. Highly recommend!",
    prediction: 'girl',
    verified: true,
    date: '2026-01-12',
  },
  {
    id: '6',
    name: 'Sophie Anderson',
    location: 'Bristol, UK',
    rating: 5,
    text: "We did this for both our pregnancies and it was accurate both times! First a boy, then a girl. It's become our little tradition now. Thanks NubHub!",
    prediction: 'boy',
    verified: true,
    date: '2025-09-15',
  },
  {
    id: '7',
    name: 'Charlotte Brown',
    location: 'Liverpool, UK',
    rating: 5,
    text: "Fast, accurate, and professional. The prediction gave us so much joy and we could start planning earlier. Our baby girl arrived last month!",
    prediction: 'girl',
    verified: true,
    date: '2025-12-01',
  },
  {
    id: '8',
    name: 'Amelia Davis',
    location: 'Sheffield, UK',
    rating: 5,
    text: "Best £10 I've spent! I was going crazy waiting for the 20-week scan. NubHub gave us peace of mind and they were right about our little boy!",
    prediction: 'boy',
    verified: true,
    date: '2026-01-20',
  },
];

export const stats = {
  totalPredictions: 15847,
  accuracyRate: 94,
  averageRating: 4.8,
  totalReviews: 1247,
  satisfactionRate: 97,
};

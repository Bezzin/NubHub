'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

const locations = [
  'London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool',
  'Leeds', 'Sheffield', 'Bristol', 'Cardiff', 'Belfast',
  'Nottingham', 'Newcastle', 'Southampton', 'Leicester', 'Coventry',
  'Brighton', 'Oxford', 'Cambridge', 'York', 'Edinburgh',
];

const names = [
  'Sarah', 'Emma', 'Olivia', 'Sophie', 'Charlotte',
  'Jessica', 'Rachel', 'Amelia', 'Isabella', 'Mia',
  'Grace', 'Lily', 'Chloe', 'Ava', 'Ella',
  'Lucy', 'Hannah', 'Zoe', 'Anna', 'Ruby',
];

const actions = [
  'just uploaded a scan',
  'received their prediction',
  'ordered a prediction',
  'got their results',
];

interface Activity {
  id: number;
  name: string;
  location: string;
  action: string;
  time: string;
}

// Generate random time between 15 seconds and 2 minutes (in milliseconds)
function getRandomInterval(): number {
  const min = 15000; // 15 seconds
  const max = 120000; // 2 minutes
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateActivity(): Activity {
  return {
    id: Date.now() + Math.random(),
    name: names[Math.floor(Math.random() * names.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    time: 'Just now',
  };
}

export default function SocialProof() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleNextActivity = useCallback(() => {
    const nextInterval = getRandomInterval();
    
    timeoutRef.current = setTimeout(() => {
      setActivities(prev => {
        const newActivity = generateActivity();
        return [newActivity, ...prev].slice(0, 4);
      });
      // Schedule the next one
      scheduleNextActivity();
    }, nextInterval);
  }, []);

  useEffect(() => {
    // Show first activity after a short delay (3-8 seconds)
    const initialDelay = Math.floor(Math.random() * 5000) + 3000;
    
    const initialTimeout = setTimeout(() => {
      setActivities([generateActivity()]);
      // Start random interval loop
      scheduleNextActivity();
    }, initialDelay);

    return () => {
      clearTimeout(initialTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scheduleNextActivity]);

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden md:block">
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white rounded-2xl shadow-soft-lg border border-stone-100 p-3 flex items-center gap-3 max-w-xs"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta/20 to-blush-200 rounded-full flex items-center justify-center text-sm font-serif font-medium text-terracotta">
                {activity.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">
                  {activity.name} from {activity.location}
                </p>
                <p className="text-xs text-stone-500">{activity.action}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-stone-400">
                <Clock className="w-3 h-3" />
                {activity.time}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

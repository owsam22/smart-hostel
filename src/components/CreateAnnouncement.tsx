// src/components/CreateAnnouncement.tsx
import React, { useState } from 'react';
import { useAnnouncements } from '@/contexts/AnnouncementContext';
import { useAuth } from '@/contexts/AuthContext';

type AnnouncementType =
  | 'general'
  | 'maintenance'
  | 'cleaning'
  | 'pest_control'
  | 'water'
  | 'electricity';

const CreateAnnouncement: React.FC = () => {
  const { addAnnouncement } = useAnnouncements();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<AnnouncementType>('general');
  const [targetHostel, setTargetHostel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HARD GUARD — frontend should not even try
  if (!user || user.role !== 'management') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        type,
        targetHostel: targetHostel.trim() || undefined
        // ❌ DO NOT send createdBy
      });

      // reset
      setTitle('');
      setContent('');
      setType('general');
      setTargetHostel('');
    } catch (err) {
      console.error('Failed to create announcement', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={type}
            onChange={e => setType(e.target.value as AnnouncementType)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
            <option value="pest_control">Pest Control</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
          </select>

          <input
            placeholder="Target Hostel (optional)"
            value={targetHostel}
            onChange={e => setTargetHostel(e.target.value)}
            className="rounded-lg border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Add Announcement'}
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '@/contexts/IssueContext';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/* ---------------- SCHEMA ---------------- */
const issueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum([
    'plumbing',
    'electrical',
    'cleanliness',
    'internet',
    'furniture',
    'other',
  ]),
  priority: z.enum(['low', 'medium', 'high', 'emergency']),
  visibility: z.enum(['public', 'private']),
  location: z.string().min(3, 'Location is required'),
  media: z.array(z.string()).optional(), // keep for later
});

type IssueFormData = z.infer<typeof issueSchema>;

const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });

  const onSubmit = async (data: IssueFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Submit without media
      await addIssue({
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        visibility: data.visibility,
        location: data.location,
        media: [], // empty for now
      });

      navigate('/issues');
    } catch (err) {
      console.error('Failed to submit issue', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report Issue</h1>
        <p className="text-gray-600">Report an issue</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Issue Title
            </label>
            <input
              {...register('title')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.title && <p className="text-red-600">{errors.title.message}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.description && (
              <p className="text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              {...register('location')}
              placeholder="e.g. Near staircase, ground floor washroom"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.location && (
              <p className="text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* CATEGORY + PRIORITY */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <select {...register('category')} className="rounded-lg border px-3 py-2">
              <option value="">Select category</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="internet">Internet</option>
              <option value="furniture">Furniture</option>
              <option value="other">Other</option>
            </select>

            <select {...register('priority')} className="rounded-lg border px-3 py-2">
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          {/* VISIBILITY */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Visibility
            </label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input {...register('visibility')} type="radio" value="public" className="mr-2" />
                Public
              </label>
              <label className="flex items-center">
                <input {...register('visibility')} type="radio" value="private" className="mr-2" />
                Private
              </label>
            </div>
          </div>

          {/* MEDIA UPLOAD - TEMPORARILY DISABLED */}
          {/*
          <div>
            <input
              type="file"
              id="mediaUpload"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="mediaUpload"
              className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white cursor-pointer inline-flex items-center"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload Media
            </label>
          </div>
          */}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/issues')}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Report Issue'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportIssue;

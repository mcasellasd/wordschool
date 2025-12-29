'use client';

import React from 'react';
import { Activity } from '@/types';
import { FileText, CheckCircle, Upload, Sparkles, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_created':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'exam_graded':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'submission_uploaded':
        return <Upload className="w-5 h-5 text-purple-500" />;
      case 'ocr_completed':
        return <Sparkles className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exam_created':
        return 'bg-blue-50 border-blue-200';
      case 'exam_graded':
        return 'bg-green-50 border-green-200';
      case 'submission_uploaded':
        return 'bg-purple-50 border-purple-200';
      case 'ocr_completed':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Activitat Recent
      </h3>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No hi ha activitat recent
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border ${getActivityColor(
                activity.type
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {activity.userName}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                        locale: ca,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;


import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function Profile() {
  const { user, profile } = useAuthStore();

  if (!user || !profile) {
    return <div className="p-8 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center mb-8">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName || 'User'} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{profile.displayName || 'Valued Customer'}</h2>
              <p className="text-gray-500 capitalize">{profile.role}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Mail className="h-6 w-6 text-gray-400 mr-4" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                <p className="text-gray-900">{profile.email}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Shield className="h-6 w-6 text-gray-400 mr-4" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Account Role</p>
                <p className="text-gray-900 capitalize">{profile.role}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 text-gray-400 mr-4" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Member Since</p>
                <p className="text-gray-900">
                  {profile.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

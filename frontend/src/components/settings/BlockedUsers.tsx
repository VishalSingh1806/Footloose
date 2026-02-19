/**
 * Blocked Users Component
 * Manage list of blocked users with unblock functionality
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCheck } from 'lucide-react';
import { getBlockedUsers, unblockUser } from '../../services/settingsService';
import type { BlockedUser } from '../../types/settings';

export default function BlockedUsers() {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unblockingUserId, setUnblockingUserId] = useState<string | null>(null);
  const [confirmUnblock, setConfirmUnblock] = useState<BlockedUser | null>(null);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      setIsLoading(true);
      const users = await getBlockedUsers();
      setBlockedUsers(users);
    } catch (error) {
      console.error('Failed to load blocked users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblock = async (user: BlockedUser) => {
    try {
      setUnblockingUserId(user.userId);
      await unblockUser(user.userId);
      setBlockedUsers((prev) => prev.filter((u) => u.userId !== user.userId));
      setConfirmUnblock(null);
    } catch (error) {
      console.error('Failed to unblock user:', error);
    } finally {
      setUnblockingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E63946]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">
            Blocked Users
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {blockedUsers.length > 0 ? (
          <>
            {/* Info Text */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-1">
                You have blocked {blockedUsers.length} {blockedUsers.length === 1 ? 'user' : 'users'}
              </p>
              <p className="text-sm text-gray-600">
                Blocked users cannot see your profile or contact you.
              </p>
            </div>

            {/* Blocked Users List */}
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    {/* Profile Photo */}
                    <div className="relative">
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-14 h-14 rounded-full object-cover opacity-60 grayscale"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 opacity-60">
                        {user.name}, {user.age}
                      </div>
                      <div className="text-sm text-gray-500">
                        Blocked on {formatDate(user.blockedAt)}
                      </div>
                    </div>

                    {/* Unblock Button */}
                    <button
                      onClick={() => setConfirmUnblock(user)}
                      disabled={unblockingUserId === user.userId}
                      className="px-4 py-2 text-[#E63946] font-semibold hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {unblockingUserId === user.userId ? 'Unblocking...' : 'Unblock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* How Blocking Works */}
            <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
              <button
                onClick={() => {
                  const content = document.getElementById('blocking-info');
                  if (content) {
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                  }
                }}
                className="w-full text-left font-semibold text-gray-900 mb-2"
              >
                How Blocking Works
              </button>
              <div id="blocking-info" style={{ display: 'none' }}>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">When you block someone:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>They can't see your profile</li>
                      <li>They can't message you</li>
                      <li>They can't send speed date requests</li>
                      <li>Existing conversations are hidden</li>
                      <li>They won't know they're blocked</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">To block someone:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Go to their profile</li>
                      <li>Tap three dots menu</li>
                      <li>Select "Block User"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No blocked users
            </h3>
            <p className="text-gray-600 max-w-sm">
              Users you block will appear here. You can unblock them anytime.
            </p>
          </div>
        )}
      </div>

      {/* Unblock Confirmation Modal */}
      {confirmUnblock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Unblock {confirmUnblock.name}?
            </h3>
            <p className="text-gray-600 mb-6">
              They will be able to see your profile and contact you again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmUnblock(null)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnblock(confirmUnblock)}
                className="flex-1 py-3 px-4 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] transition-colors"
              >
                Unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

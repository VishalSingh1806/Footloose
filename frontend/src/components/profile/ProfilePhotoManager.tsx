import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Upload,
  X,
  GripVertical,
  Trash2,
  AlertCircle,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { ProfilePhoto } from '../../types/profile';
import { uploadPhoto, deletePhoto, reorderPhotos } from '../../services/profileService';

interface ProfilePhotoManagerProps {
  photos: ProfilePhoto[];
  onUpdate?: () => void;
}

export function ProfilePhotoManager({ photos: initialPhotos, onUpdate }: ProfilePhotoManagerProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<ProfilePhoto[]>(initialPhotos);
  const [reorderMode, setReorderMode] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const maxPhotos = 10;
  const canUploadMore = photos.length < maxPhotos;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = maxPhotos - photos.length;
    const filesToUpload = files.slice(0, availableSlots);

    setUploadingCount(filesToUpload.length);

    try {
      for (const file of filesToUpload) {
        const newPhoto = await uploadPhoto(file);
        setPhotos(prev => [...prev, newPhoto]);
      }
      onUpdate?.();
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setUploadingCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      setDeleteConfirm(null);
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(index, 0, draggedPhoto);

    setPhotos(newPhotos);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex !== null) {
      try {
        await reorderPhotos(photos.map(p => p.id));
        onUpdate?.();
      } catch (error) {
        console.error('Error reordering photos:', error);
      }
    }
    setDraggedIndex(null);
  };

  const handleSaveOrder = async () => {
    try {
      await reorderPhotos(photos.map(p => p.id));
      setReorderMode(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error saving photo order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#1D3557]" />
          </button>
          <h1 className="text-xl font-bold text-[#1D3557]">Manage Photos</h1>
          {reorderMode ? (
            <button
              onClick={handleSaveOrder}
              className="px-4 py-2 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#D62839] transition-colors"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setReorderMode(true)}
              disabled={photos.length < 2}
              className="px-4 py-2 text-[#E63946] rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reorder
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Guidelines */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-2">Photo Guidelines</p>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• Upload up to {maxPhotos} photos</li>
                <li>• First photo is your profile picture</li>
                <li>• Clear face photos get 3x more matches</li>
                <li>• No group photos or filters</li>
                <li>• Photos are verified within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Photo Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {photos.length} of {maxPhotos} photos
          </p>
          {reorderMode && (
            <p className="text-xs sm:text-sm text-[#E63946] font-semibold">
              Drag to reorder
            </p>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Existing Photos */}
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              draggable={reorderMode}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-square rounded-xl overflow-hidden bg-gray-200 ${
                reorderMode ? 'cursor-move' : ''
              } ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              {photo.status !== 'approved' && (
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                      photo.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {photo.status === 'pending' ? 'Pending' : 'Rejected'}
                  </span>
                </div>
              )}

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 right-2">
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check size={12} />
                    <span>Primary</span>
                  </div>
                </div>
              )}

              {/* Reorder Handle */}
              {reorderMode && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  <GripVertical size={32} className="text-white" />
                </div>
              )}

              {/* Delete Button */}
              {!reorderMode && (
                <button
                  onClick={() => setDeleteConfirm(photo.id)}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          {/* Upload Placeholder */}
          {canUploadMore && !reorderMode && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingCount > 0}
              className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#E63946] bg-white flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingCount > 0 ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#E63946] border-t-transparent" />
                  <p className="text-xs text-gray-500">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400" />
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">Add Photo</p>
                  <p className="text-xs text-gray-400">{maxPhotos - photos.length} left</p>
                </>
              )}
            </button>
          )}

          {/* Empty state placeholders */}
          {photos.length === 0 && uploadingCount === 0 && (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center"
                >
                  <ImageIcon size={32} className="text-gray-300" />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Upload Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Tips */}
        {photos.length === 0 && (
          <div className="bg-gradient-to-br from-[#E63946]/5 to-[#F4A261]/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#E63946]/20">
            <h3 className="text-base sm:text-lg font-bold text-[#1D3557] mb-3">
              Tips for Great Photos
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <p>✨ Use natural lighting for best results</p>
              <p>📸 Show your genuine smile</p>
              <p>👔 Mix casual and formal photos</p>
              <p>🎯 Include photos doing your hobbies</p>
              <p>💡 Avoid heavily filtered images</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#1D3557] mb-2">
                Delete Photo?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                This action cannot be undone. The photo will be permanently removed from your profile.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Delete Photo
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="w-full text-gray-600 py-3 font-semibold hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

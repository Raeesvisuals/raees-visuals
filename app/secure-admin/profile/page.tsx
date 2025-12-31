"use client";

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MediaLibrary from '@/components/MediaLibrary';
import { FaSave, FaUser, FaUsers, FaCogs, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getAboutContent, updateAboutContent } from '@/data/about';

export default function ProfileAdmin() {
  const [aboutData, setAboutData] = useState(getAboutContent());
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showTeamMediaLibrary, setShowTeamMediaLibrary] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState<'profile' | 'team'>('profile');
  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number>(-1);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      updateAboutContent(aboutData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (file: any) => {
    if (selectedImageType === 'profile') {
      setAboutData(prev => ({
        ...prev,
        profileAvatarUrl: file.url
      }));
    } else if (selectedImageType === 'team' && selectedTeamIndex >= 0) {
      const updatedTeam = [...aboutData.teamMembers];
      updatedTeam[selectedTeamIndex] = {
        ...updatedTeam[selectedTeamIndex],
        image: file.url
      };
      setAboutData(prev => ({
        ...prev,
        teamMembers: updatedTeam
      }));
    }
    setShowMediaLibrary(false);
    setShowTeamMediaLibrary(false);
  };

  const addTeamMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: 'New Team Member',
      role: 'Role',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
    };
    setAboutData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember]
    }));
  };

  const removeTeamMember = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updatedTeam = [...aboutData.teamMembers];
    updatedTeam[index] = {
      ...updatedTeam[index],
      [field]: value
    };
    setAboutData(prev => ({
      ...prev,
      teamMembers: updatedTeam
    }));
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Profile <span className="text-primary">Management</span>
          </h1>
          <p className="text-text-primary/70">
            Manage your profile information, team members, and upload images.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-dark-lighter/30 backdrop-blur-md border border-text-primary/20 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <FaUser className="text-primary" />
              Profile Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={aboutData.profileName}
                  onChange={(e) => setAboutData(prev => ({ ...prev, profileName: e.target.value }))}
                  className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Profile Title
                </label>
                <input
                  type="text"
                  value={aboutData.profileTitle}
                  onChange={(e) => setAboutData(prev => ({ ...prev, profileTitle: e.target.value }))}
                  className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Handle
                </label>
                <input
                  type="text"
                  value={aboutData.profileHandle}
                  onChange={(e) => setAboutData(prev => ({ ...prev, profileHandle: e.target.value }))}
                  className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Status
                </label>
                <input
                  type="text"
                  value={aboutData.profileStatus}
                  onChange={(e) => setAboutData(prev => ({ ...prev, profileStatus: e.target.value }))}
                  className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={aboutData.profileAvatarUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                  />
                  <button
                    onClick={() => {
                      setSelectedImageType('profile');
                      setShowMediaLibrary(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                  >
                    <FaEdit />
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="bg-dark-lighter/30 backdrop-blur-md border border-text-primary/20 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <FaCogs className="text-primary" />
              About Content
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={aboutData.description}
                  onChange={(e) => setAboutData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-text-primary/80 text-sm font-medium mb-2">
                  Description 2
                </label>
                <textarea
                  value={aboutData.description2}
                  onChange={(e) => setAboutData(prev => ({ ...prev, description2: e.target.value }))}
                  rows={3}
                  className="w-full bg-dark/50 border border-text-primary/20 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="mt-8 bg-dark-lighter/30 backdrop-blur-md border border-text-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
              <FaUsers className="text-primary" />
              Team Members
            </h3>
            <button
              onClick={addTeamMember}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded-lg hover:bg-primary/80 transition-colors"
            >
              <FaPlus />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.teamMembers.map((member, index) => (
              <div key={member.id} className="bg-dark/50 backdrop-blur-sm border border-text-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                  />
                  <button
                    onClick={() => {
                      setSelectedImageType('team');
                      setSelectedTeamIndex(index);
                      setShowTeamMediaLibrary(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary text-sm rounded hover:bg-primary/30 transition-colors"
                  >
                    <FaEdit />
                    Change
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-text-primary/80 text-xs font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="w-full bg-dark/50 border border-text-primary/20 rounded px-3 py-2 text-text-primary text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-text-primary/80 text-xs font-medium mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                      className="w-full bg-dark/50 border border-text-primary/20 rounded px-3 py-2 text-text-primary text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => removeTeamMember(index)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 text-sm rounded hover:bg-red-500/30 transition-colors"
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-dark rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            <FaSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Media Library Modals */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter/90 backdrop-blur-md border border-text-primary/20 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-text-primary">Select Profile Image</h3>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  className="text-text-primary/60 hover:text-text-primary transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <MediaLibrary 
                onSelectFile={handleImageSelect}
                showUpload={true}
                title="Choose an Image"
              />
            </div>
          </div>
        </div>
      )}

      {showTeamMediaLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter/90 backdrop-blur-md border border-text-primary/20 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-text-primary">Select Team Member Image</h3>
                <button
                  onClick={() => setShowTeamMediaLibrary(false)}
                  className="text-text-primary/60 hover:text-text-primary transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <MediaLibrary 
                onSelectFile={handleImageSelect}
                showUpload={true}
                title="Choose an Image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

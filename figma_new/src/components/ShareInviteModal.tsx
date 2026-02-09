import { X, Copy, MessageCircle, Mail, Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    username: string;
  };
}

export function ShareInviteModal({ isOpen, onClose, currentUser }: ShareInviteModalProps) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  // Generate personalized invite link
  const inviteLink = `https://quilts.app/invite/${currentUser.username}`;
  const inviteMessage = `Hey! Join me on Quilts - a fun photo-sharing app where friends add photos to each other's boards. Use my invite link: ${inviteLink}`;

  const handleCopyLink = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback method using textarea
        copyToClipboardFallback(inviteLink);
      }
    } catch (err) {
      // Clipboard API blocked - silently use fallback (this is expected behavior)
      copyToClipboardFallback(inviteLink);
    }
  };

  const copyToClipboardFallback = (text: string) => {
    try {
      // Create temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      
      // Select and copy
      textarea.focus();
      textarea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('execCommand failed');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      // Last resort: show the link in an alert so users can copy manually
      alert(`Copy this link:\n\n${text}`);
    }
  };

  const handleShareSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(inviteMessage)}`;
    window.open(smsUrl, '_blank');
  };

  const handleShareEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent('Join me on Quilts!')}&body=${encodeURIComponent(inviteMessage)}`;
    window.open(emailUrl, '_blank');
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Quilts!',
          text: inviteMessage,
          url: inviteLink,
        });
      } catch (err) {
        // Share API blocked or user cancelled - silently fall back to copy
        if (err instanceof Error && err.name !== 'AbortError') {
          // If not user cancellation, fallback to copy
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Invite Friends</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Illustration/Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Share2 size={40} className="text-white" />
          </div>

          <h3 className="text-xl font-bold text-center mb-2">
            Share Your Personalized Link
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Invite your friends to join Quilts and start creating beautiful photo collections together!
          </p>

          {/* Link Display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-2 font-semibold">Your Invite Link</p>
            <div className="flex items-center gap-2">
              <p className="text-blue-600 font-medium flex-1 truncate">{inviteLink}</p>
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                title="Copy link"
              >
                {copied ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} className="text-gray-600" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2 font-semibold">Link copied!</p>
            )}
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <button
              onClick={handleShareSMS}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Share via Text Message</p>
                <p className="text-sm text-green-50">Send an SMS invite</p>
              </div>
            </button>

            <button
              onClick={handleShareEmail}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Share via Email</p>
                <p className="text-sm text-blue-50">Send an email invite</p>
              </div>
            </button>

            <button
              onClick={handleShareNative}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Share2 size={20} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Share via...</p>
                <p className="text-sm text-purple-50">More sharing options</p>
              </div>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-4 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Copy size={20} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Copy Link</p>
                <p className="text-sm text-gray-500">Share it anywhere</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
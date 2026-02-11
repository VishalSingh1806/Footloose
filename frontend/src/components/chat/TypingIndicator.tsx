interface TypingIndicatorProps {
  name: string;
  photo: string;
}

function TypingIndicator({ name, photo }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 px-4 mb-4">
      {/* Profile Photo */}
      <img
        src={photo}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />

      {/* Typing Bubble */}
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;

import React from 'react';

/**
 * - **text** for bold
 * - [link text](url) for links
 * - \n (back slash n) for going to next line
 * 
 * @param {string} text 
 * @returns {React.ReactNode} 
 */
export const parseRichText = (text) => {
  if (!text) return null;

  const parts = [];
  let currentIndex = 0;

  const boldPattern = /\*\*(.*?)\*\*/g;
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  const matches = [];
  
  let match;
  while ((match = boldPattern.exec(text)) !== null) {
    matches.push({
      type: 'bold',
      start: match.index,
      end: match.index + match[0].length,
      content: match[1],
      fullMatch: match[0]
    });
  }

  while ((match = linkPattern.exec(text)) !== null) {
    matches.push({
      type: 'link',
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      url: match[2],
      fullMatch: match[0]
    });
  }

  matches.sort((a, b) => a.start - b.start);

  const filteredMatches = [];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    let overlaps = false;
    
    for (let j = 0; j < filteredMatches.length; j++) {
      const existing = filteredMatches[j];
      if (
        (current.start < existing.end && current.end > existing.start) ||
        (current.end > existing.start && current.start < existing.end)
      ) {
        overlaps = true;
        if (current.type === 'link' && existing.type === 'bold') {
          filteredMatches[j] = current;
        }
        break;
      }
    }
    
    if (!overlaps) {
      filteredMatches.push(current);
    }
  }

  filteredMatches.sort((a, b) => a.start - b.start);
  
  let lastIndex = 0;
  const elements = [];
  let keyCounter = 0;

  const addTextSegment = (segment) => {
    if (!segment) return;
    const lines = segment.split('\n');
    lines.forEach((line, index) => {
      if (line) {
        elements.push(line);
      }
      if (index < lines.length - 1) {
        elements.push(<br key={`br-${keyCounter}-${index}`} />);
      }
    });
    keyCounter += 1;
  };

  if (filteredMatches.length === 0) {
    addTextSegment(text);
    return elements.length === 0 ? null : <>{elements}</>;
  }

  filteredMatches.forEach((match) => {
    if (match.start > lastIndex) {
      const beforeText = text.substring(lastIndex, match.start);
      addTextSegment(beforeText);
    }

    if (match.type === 'bold') {
      elements.push(
        <strong key={`bold-${match.start}`} className="font-bold">
          {match.content}
        </strong>
      );
    } else if (match.type === 'link') {
      elements.push(
        <a
          key={`link-${match.start}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-color)] underline hover:opacity-80 transition-opacity"
        >
          {match.text}
        </a>
      );
    }

    lastIndex = match.end;
  });

  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    addTextSegment(remainingText);
  }

  if (elements.length === 0) {
    return text;
  }

  return <>{elements}</>;
};


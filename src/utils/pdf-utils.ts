export const wrapText = (text: string, maxChars: number, maxLines: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      if ((current + word).length <= maxChars) {
        current += (current ? " " : "") + word;
      } else {
        lines.push(current);
        current = word;
        if (lines.length === maxLines - 1) break;
      }
    }
    if (current) lines.push(current);
    if (lines.length === maxLines && (words.length > 0 && words.join(" ").length > lines.join(" ").length)) {
      lines[lines.length - 1] = lines[lines.length - 1].slice(0, maxChars - 3) + "...";
    }
    
    return lines;
  };
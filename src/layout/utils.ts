export const hexToRgba = (hex: string, alpha: number = 1): string => {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, "");
  
    // Parse r, g, b values
    let r = 0, g = 0, b = 0;
  
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      throw new Error("Invalid hex format");
    }
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
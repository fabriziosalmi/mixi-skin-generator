import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface SkinMetadata {
  id: string;
  name: string;
  author: string;
  version: string;
  description: string;
}

export interface SkinColors {
  bgApp: string;
  srfLow: string;
  srfMid: string;
  srfRaised: string;
  clrA: string;
  clrB: string;
  clrC: string;
  clrD: string;
  txtWhite: string;
  txtMuted: string;
  brdDefault: string;
  waveLow: string;
  waveMid: string;
  waveHigh: string;
  waveBg: string;
  wavePlayhead: string;
}

export function exportSkin(metadata: SkinMetadata, colors: SkinColors) {
  const zip = new JSZip();
  
  // Create folder
  const folderName = metadata.id || 'skin-custom';
  const folder = zip.folder(folderName);
  
  if (!folder) throw new Error("Failed to create zip folder");

  // Create skin.json
  const jsonContent = JSON.stringify(metadata, null, 2);
  folder.file('skin.json', jsonContent);

  // Create skin.css
  const cssContent = `/* skins/${folderName}/skin.css */

:root {
  /* Surfaces & Backgrounds */
  --bg-app: ${colors.bgApp};
  --srf-low: ${colors.srfLow};
  --srf-mid: ${colors.srfMid};
  --srf-raised: ${colors.srfRaised};
  
  /* Deck Colors (Standard Mixi Convention) */
  --clr-a: ${colors.clrA};
  --clr-b: ${colors.clrB};
  --clr-c: ${colors.clrC};
  --clr-d: ${colors.clrD};

  /* Text & Borders */
  --txt-white: ${colors.txtWhite};
  --txt-muted: ${colors.txtMuted};
  --brd-default: ${colors.brdDefault};
  
  /* Waveform Colors (3-Band EQ) */
  --wave-low: ${colors.waveLow};
  --wave-mid: ${colors.waveMid};
  --wave-high: ${colors.waveHigh};
  --wave-bg: ${colors.waveBg};
  --wave-playhead: ${colors.wavePlayhead};
}
`;
  folder.file('skin.css', cssContent);

  // Generate and save
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, `${folderName}.zip`);
  });
}

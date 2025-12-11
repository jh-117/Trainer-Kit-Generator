import PptxGenJS from 'pptxgenjs';
import { Slide } from '../types';

export const stripMarkdown = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
};

export const generatePowerPoint = async (
  slides: Slide[],
  imageSeeds: Record<number, number>
): Promise<Blob> => {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'TrainerKit GenAI';
  pptx.company = 'TrainerKit';
  pptx.title = slides[0]?.title || 'Training Presentation';

  const theme = {
    primaryColor: '2563EB',
    accentColor: '3B82F6',
    darkBg: '1E293B',
    lightBg: '334155',
    textColor: 'FFFFFF',
    subtextColor: 'E2E8F0',
  };

  slides.forEach((s, i) => {
    const slide = pptx.addSlide();

    if (i === 0) {
      slide.background = { fill: theme.darkBg };

      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: {
          type: 'solid',
          color: theme.darkBg
        }
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 3, w: '100%', h: 0.15,
        fill: { color: theme.accentColor }
      });

      slide.addText(stripMarkdown(s.title), {
        x: 0.5, y: 2, w: 9, h: 2,
        fontSize: 48,
        fontFace: 'Calibri',
        bold: true,
        color: theme.textColor,
        align: 'center',
        valign: 'middle'
      });

      slide.addText("Professional Training Module", {
        x: 0.5, y: 4, w: 9, h: 0.5,
        fontSize: 20,
        fontFace: 'Calibri',
        color: theme.subtextColor,
        align: 'center'
      });

      slide.addText("Powered by TrainerKit GenAI", {
        x: 0.5, y: 6.5, w: 9, h: 0.3,
        fontSize: 12,
        fontFace: 'Calibri',
        color: '94A3B8',
        align: 'center',
        italic: true
      });

    } else {
      slide.background = { fill: theme.lightBg };

      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 1.2,
        fill: { color: theme.darkBg }
      });

      slide.addText(stripMarkdown(s.title), {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 32,
        fontFace: 'Calibri',
        bold: true,
        color: theme.textColor,
        valign: 'middle'
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.05, w: 2, h: 0.08,
        fill: { color: theme.accentColor }
      });

      const bulletItems = s.content.map(c => ({
        text: stripMarkdown(c),
        options: {
          fontSize: 20,
          color: theme.textColor,
          breakLine: true,
          bullet: {
            type: 'bullet' as const,
            indent: 18,
            marginPt: 10
          },
          paraSpaceBefore: 10,
          paraSpaceAfter: 10
        }
      }));

      slide.addText(bulletItems, {
        x: 0.7, y: 1.8, w: 8.6, h: 4.5,
        fontFace: 'Calibri',
        valign: 'top',
        lineSpacing: 28
      });

      slide.addText(`${i}`, {
        x: 9.2, y: 6.7, w: 0.5, h: 0.3,
        fontSize: 16,
        color: theme.subtextColor,
        align: 'center',
        valign: 'middle',
        fontFace: 'Calibri'
      });
    }

    if (s.speakerNotes) {
      slide.addNotes(stripMarkdown(s.speakerNotes));
    }
  });

  return await pptx.write({ outputType: 'blob' }) as Blob;
};
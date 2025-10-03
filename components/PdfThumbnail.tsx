import React, { useRef, useEffect, useState } from 'react';

declare const pdfjsLib: any;

interface PdfThumbnailProps {
  pdfUrl: string;
}

const PdfThumbnail: React.FC<PdfThumbnailProps> = ({ pdfUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const renderPdf = async () => {
      setLoading(true);
      setError('');
      if (!pdfUrl) return;

      try {
        // Note: This requires CORS to be configured on the Firebase Storage bucket
        // to allow requests from this web app's domain.
        const response = await fetch(pdfUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        const pdfData = await response.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;
        
        const viewport = page.getViewport({ scale: 1 });
        const scale = parent.clientWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
        setLoading(false);
      } catch (e) {
        console.error('Failed to render PDF thumbnail', e);
        setError('فشل عرض الملف');
        setLoading(false);
      }
    };
    
    if (typeof pdfjsLib !== 'undefined') {
        renderPdf();
    } else {
        setError('PDF library not loaded');
        setLoading(false);
    }

  }, [pdfUrl]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-800">
      {loading && <div className="text-slate-400 text-xs">جاري التحميل...</div>}
      {error && <div className="text-red-400 text-xs p-2 text-center">{error}</div>}
      <canvas
        ref={canvasRef}
        className={`w-full h-full transition-opacity duration-300 ${loading || error ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

export default PdfThumbnail;
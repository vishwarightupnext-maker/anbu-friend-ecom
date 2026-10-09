// Utility helper for opening and downloading PNG assets and PDF E-Books reliably

export const downloadAssetFile = async (product) => {
  if (!product) return;

  const title = product.name || 'digital-asset';
  const isPdf = product.fileType === 'pdf' || (product.pdfUrl && product.pdfUrl.includes('.pdf'));
  const ext = isPdf ? '.pdf' : '.png';
  const cleanFileName = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + ext;

  const targetUrl = product.cloudinaryUrl || product.pdfUrl || product.pngUrl || product.image || '';

  // 1. Base64 Data URI Handling (Converts to Blob URL so Chrome/Edge won't block with about:blank)
  if (targetUrl && targetUrl.startsWith('data:')) {
    try {
      const parts = targetUrl.split(';base64,');
      const contentType = parts[0].replace('data:', '');
      const base64Data = parts[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType || (isPdf ? 'application/pdf' : 'image/png') });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      return;
    } catch (err) {
      console.error('Data URI download error:', err);
    }
  }

  // 2. Local Image Path or Placeholder Cloudinary Link Handling
  // If it's a test/placeholder Cloudinary URL or relative path, fetch via backend API endpoint which serves binary stream
  if (!targetUrl || targetUrl.includes('res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000') || targetUrl.startsWith('images/')) {
    const prodId = product.id || product._id;
    const downloadEndpoint = `/api/products/${prodId}/download`;
    
    // Trigger download anchor
    const link = document.createElement('a');
    link.href = downloadEndpoint;
    link.download = cleanFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 3. Valid HTTP / HTTPS Cloudinary / External Link
  if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
    try {
      // Attempt CORS fetch blob download first
      const response = await fetch(targetUrl);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = cleanFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return;
      }
    } catch (fetchErr) {
      console.warn('Fetch blob download fallback to direct window open/anchor:', fetchErr.message);
    }

    // Direct anchor fallback
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.download = cleanFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 4. Default Fallback to Backend Stream Download Route
  const prodId = product.id || product._id;
  window.location.href = `/api/products/${prodId}/download`;
};

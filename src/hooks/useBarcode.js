import { useState, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
];

/**
 * useBarcode
 * Manages both manual barcode text entry and camera-based scanning.
 *
 * @param {{ onScan: (code: string) => void, containerId?: string }} options
 */
export function useBarcode({ onScan, containerId = 'barcode-reader' }) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  // Camera scanner lifecycle
  useEffect(() => {
    if (!showScanner) return;

    let scanner;

    const start = async () => {
      try {
        scanner = new Html5Qrcode(containerId);
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, formatsToSupport: SUPPORTED_FORMATS },
          (decodedText) => {
            onScan(decodedText);
            setShowScanner(false);
            // Auditory feedback
            new Audio('https://www.soundjay.com/buttons/beep-07a.mp3')
              .play()
              .catch(() => {});
          },
          () => {} // frame error — intentionally ignored
        );
      } catch (err) {
        console.error('[useBarcode] Camera error:', err);
        alert('نەتوانرا کامێراکە بکرێتەوە! تکایە دڵنیابە کە مۆڵەتی کامێرات داوە.');
        setShowScanner(false);
      }
    };

    start();

    return () => {
      if (scanner?.isScanning) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      }
    };
  }, [showScanner, containerId, onScan]);

  // Keyboard enter handler for manual input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = barcodeInput.trim();
      if (code) {
        onScan(code);
        setBarcodeInput('');
      }
    }
  };

  const openScanner = () => setShowScanner(true);
  const closeScanner = () => setShowScanner(false);

  return {
    barcodeInput,
    setBarcodeInput,
    handleKeyDown,
    showScanner,
    openScanner,
    closeScanner,
  };
}

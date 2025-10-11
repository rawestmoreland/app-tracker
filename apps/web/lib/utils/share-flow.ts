interface ShareFlowOptions {
  element: HTMLElement;
  filename?: string;
}

/**
 * Generates a shareable image of the application flow chart with Jobble branding
 */
export async function shareApplicationFlow({
  element,
  filename = `jobble-application-flow-${new Date().toISOString().split('T')[0]}.png`,
}: ShareFlowOptions): Promise<void> {
  try {
    // Find the SVG element within the chart
    const svgElement = element.querySelector('svg');
    if (!svgElement) {
      throw new Error('No SVG found in chart element');
    }

    // Get SVG dimensions
    const svgRect = svgElement.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;

    // Create canvas with extra space for branding
    const padding = 80; // 40px on each side
    const brandingHeight = 100;
    const canvas = document.createElement('canvas');
    const scale = 2; // For retina displays
    canvas.width = (svgWidth + padding) * scale;
    canvas.height = (svgHeight + padding + brandingHeight) * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Scale for retina
    ctx.scale(scale, scale);

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clone the SVG and add inline styles to preserve fonts
    const svgClone = svgElement.cloneNode(true) as SVGElement;

    // Add font-family to all text elements
    const textElements = svgClone.querySelectorAll('text');
    textElements.forEach((text) => {
      const computedStyle = window.getComputedStyle(text);
      text.style.fontFamily =
        computedStyle.fontFamily ||
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      text.style.fontSize = computedStyle.fontSize || '12px';
      text.style.fontWeight = computedStyle.fontWeight || '500';
      text.style.fill = computedStyle.fill || '#374151';
    });

    // Serialize the SVG to a string
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Load and draw SVG
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        try {
          // Draw SVG
          ctx.drawImage(img, padding / 2, padding / 2, svgWidth, svgHeight);

          // Draw branding section border
          const brandingY = svgHeight + padding / 2 + 20;
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(padding / 2, brandingY);
          ctx.lineTo(svgWidth + padding / 2, brandingY);
          ctx.stroke();

          // Draw mascot
          const mascotSvg = createJobbleMascotSVG();
          const mascotData = new XMLSerializer().serializeToString(mascotSvg);
          const mascotBlob = new Blob([mascotData], {
            type: 'image/svg+xml;charset=utf-8',
          });
          const mascotUrl = URL.createObjectURL(mascotBlob);
          const mascotImg = new Image();

          mascotImg.onload = () => {
            const mascotSize = 40;
            const mascotX = (canvas.width / scale - mascotSize - 200) / 2;
            const mascotY = brandingY + 30;
            ctx.drawImage(mascotImg, mascotX, mascotY, mascotSize, mascotSize);

            // Draw branding text
            ctx.font =
              '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = '#1e293b';
            ctx.fillText('Jobble', mascotX + mascotSize + 12, mascotY + 16);

            ctx.font =
              '400 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText(
              'Juggle your job applications at jobble.app',
              mascotX + mascotSize + 12,
              mascotY + 34,
            );

            URL.revokeObjectURL(mascotUrl);
            URL.revokeObjectURL(svgUrl);
            resolve();
          };
          mascotImg.onerror = () => {
            URL.revokeObjectURL(mascotUrl);
            URL.revokeObjectURL(svgUrl);
            reject(new Error('Failed to load mascot image'));
          };
          mascotImg.src = mascotUrl;
        } catch (err) {
          URL.revokeObjectURL(svgUrl);
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        reject(new Error('Failed to load SVG image'));
      };
      img.src = svgUrl;
    });

    // Convert canvas to blob and trigger download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Failed to generate shareable image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
}

/**
 * Creates the Jobble mascot SVG element for branding
 */
function createJobbleMascotSVG(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.setAttribute('fill', 'none');

  // Main body
  const body = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'ellipse',
  );
  body.setAttribute('cx', '100');
  body.setAttribute('cy', '110');
  body.setAttribute('rx', '50');
  body.setAttribute('ry', '55');
  body.setAttribute('fill', '#3B82F6');
  svg.appendChild(body);

  // Left arm juggling
  const leftArm = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  leftArm.setAttribute('d', 'M 60 95 Q 35 85 25 70');
  leftArm.setAttribute('stroke', '#3B82F6');
  leftArm.setAttribute('stroke-width', '12');
  leftArm.setAttribute('stroke-linecap', 'round');
  leftArm.setAttribute('fill', 'none');
  svg.appendChild(leftArm);

  const leftHand = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  leftHand.setAttribute('cx', '25');
  leftHand.setAttribute('cy', '70');
  leftHand.setAttribute('r', '8');
  leftHand.setAttribute('fill', '#3B82F6');
  svg.appendChild(leftHand);

  // Right arm juggling
  const rightArm = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  rightArm.setAttribute('d', 'M 140 95 Q 165 85 175 70');
  rightArm.setAttribute('stroke', '#3B82F6');
  rightArm.setAttribute('stroke-width', '12');
  rightArm.setAttribute('stroke-linecap', 'round');
  rightArm.setAttribute('fill', 'none');
  svg.appendChild(rightArm);

  const rightHand = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  rightHand.setAttribute('cx', '175');
  rightHand.setAttribute('cy', '70');
  rightHand.setAttribute('r', '8');
  rightHand.setAttribute('fill', '#3B82F6');
  svg.appendChild(rightHand);

  // Middle arm juggling
  const middleArm = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  middleArm.setAttribute('d', 'M 100 85 Q 100 50 100 30');
  middleArm.setAttribute('stroke', '#3B82F6');
  middleArm.setAttribute('stroke-width', '12');
  middleArm.setAttribute('stroke-linecap', 'round');
  middleArm.setAttribute('fill', 'none');
  svg.appendChild(middleArm);

  const middleHand = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  middleHand.setAttribute('cx', '100');
  middleHand.setAttribute('cy', '30');
  middleHand.setAttribute('r', '8');
  middleHand.setAttribute('fill', '#3B82F6');
  svg.appendChild(middleHand);

  // Bottom left arm
  const bottomLeftArm = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  bottomLeftArm.setAttribute('d', 'M 70 130 Q 50 140 45 155');
  bottomLeftArm.setAttribute('stroke', '#3B82F6');
  bottomLeftArm.setAttribute('stroke-width', '12');
  bottomLeftArm.setAttribute('stroke-linecap', 'round');
  bottomLeftArm.setAttribute('fill', 'none');
  svg.appendChild(bottomLeftArm);

  const bottomLeftHand = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  bottomLeftHand.setAttribute('cx', '45');
  bottomLeftHand.setAttribute('cy', '155');
  bottomLeftHand.setAttribute('r', '8');
  bottomLeftHand.setAttribute('fill', '#3B82F6');
  svg.appendChild(bottomLeftHand);

  // Bottom right arm
  const bottomRightArm = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  bottomRightArm.setAttribute('d', 'M 130 130 Q 150 140 155 155');
  bottomRightArm.setAttribute('stroke', '#3B82F6');
  bottomRightArm.setAttribute('stroke-width', '12');
  bottomRightArm.setAttribute('stroke-linecap', 'round');
  bottomRightArm.setAttribute('fill', 'none');
  svg.appendChild(bottomRightArm);

  const bottomRightHand = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  bottomRightHand.setAttribute('cx', '155');
  bottomRightHand.setAttribute('cy', '155');
  bottomRightHand.setAttribute('r', '8');
  bottomRightHand.setAttribute('fill', '#3B82F6');
  svg.appendChild(bottomRightHand);

  // Juggled items (job applications)
  const app1Outer = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app1Outer.setAttribute('cx', '20');
  app1Outer.setAttribute('cy', '55');
  app1Outer.setAttribute('r', '12');
  app1Outer.setAttribute('fill', '#10B981');
  app1Outer.setAttribute('opacity', '0.9');
  svg.appendChild(app1Outer);

  const app1Inner = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app1Inner.setAttribute('cx', '20');
  app1Inner.setAttribute('cy', '55');
  app1Inner.setAttribute('r', '8');
  app1Inner.setAttribute('fill', '#34D399');
  app1Inner.setAttribute('opacity', '0.7');
  svg.appendChild(app1Inner);

  const app2Outer = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app2Outer.setAttribute('cx', '100');
  app2Outer.setAttribute('cy', '15');
  app2Outer.setAttribute('r', '12');
  app2Outer.setAttribute('fill', '#8B5CF6');
  app2Outer.setAttribute('opacity', '0.9');
  svg.appendChild(app2Outer);

  const app2Inner = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app2Inner.setAttribute('cx', '100');
  app2Inner.setAttribute('cy', '15');
  app2Inner.setAttribute('r', '8');
  app2Inner.setAttribute('fill', '#A78BFA');
  app2Inner.setAttribute('opacity', '0.7');
  svg.appendChild(app2Inner);

  const app3Outer = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app3Outer.setAttribute('cx', '180');
  app3Outer.setAttribute('cy', '55');
  app3Outer.setAttribute('r', '12');
  app3Outer.setAttribute('fill', '#F59E0B');
  app3Outer.setAttribute('opacity', '0.9');
  svg.appendChild(app3Outer);

  const app3Inner = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app3Inner.setAttribute('cx', '180');
  app3Inner.setAttribute('cy', '55');
  app3Inner.setAttribute('r', '8');
  app3Inner.setAttribute('fill', '#FBBf24');
  app3Inner.setAttribute('opacity', '0.7');
  svg.appendChild(app3Inner);

  const app4Outer = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app4Outer.setAttribute('cx', '40');
  app4Outer.setAttribute('cy', '140');
  app4Outer.setAttribute('r', '12');
  app4Outer.setAttribute('fill', '#EC4899');
  app4Outer.setAttribute('opacity', '0.9');
  svg.appendChild(app4Outer);

  const app4Inner = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app4Inner.setAttribute('cx', '40');
  app4Inner.setAttribute('cy', '140');
  app4Inner.setAttribute('r', '8');
  app4Inner.setAttribute('fill', '#F9A8D4');
  app4Inner.setAttribute('opacity', '0.7');
  svg.appendChild(app4Inner);

  const app5Outer = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app5Outer.setAttribute('cx', '160');
  app5Outer.setAttribute('cy', '140');
  app5Outer.setAttribute('r', '12');
  app5Outer.setAttribute('fill', '#06B6D4');
  app5Outer.setAttribute('opacity', '0.9');
  svg.appendChild(app5Outer);

  const app5Inner = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  app5Inner.setAttribute('cx', '160');
  app5Inner.setAttribute('cy', '140');
  app5Inner.setAttribute('r', '8');
  app5Inner.setAttribute('fill', '#67E8F9');
  app5Inner.setAttribute('opacity', '0.7');
  svg.appendChild(app5Inner);

  // Face - Eyes
  const leftEye = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'ellipse',
  );
  leftEye.setAttribute('cx', '88');
  leftEye.setAttribute('cy', '105');
  leftEye.setAttribute('rx', '4');
  leftEye.setAttribute('ry', '6');
  leftEye.setAttribute('fill', '#1E293B');
  svg.appendChild(leftEye);

  const rightEye = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'ellipse',
  );
  rightEye.setAttribute('cx', '112');
  rightEye.setAttribute('cy', '105');
  rightEye.setAttribute('rx', '4');
  rightEye.setAttribute('ry', '6');
  rightEye.setAttribute('fill', '#1E293B');
  svg.appendChild(rightEye);

  // Eye highlights
  const leftHighlight = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  leftHighlight.setAttribute('cx', '89');
  leftHighlight.setAttribute('cy', '103');
  leftHighlight.setAttribute('r', '1.5');
  leftHighlight.setAttribute('fill', 'white');
  svg.appendChild(leftHighlight);

  const rightHighlight = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle',
  );
  rightHighlight.setAttribute('cx', '113');
  rightHighlight.setAttribute('cy', '103');
  rightHighlight.setAttribute('r', '1.5');
  rightHighlight.setAttribute('fill', 'white');
  svg.appendChild(rightHighlight);

  // Smile
  const smile = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  smile.setAttribute('d', 'M 85 120 Q 100 128 115 120');
  smile.setAttribute('stroke', '#1E293B');
  smile.setAttribute('stroke-width', '3');
  smile.setAttribute('stroke-linecap', 'round');
  smile.setAttribute('fill', 'none');
  svg.appendChild(smile);

  // Rosy cheeks
  const leftCheek = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'ellipse',
  );
  leftCheek.setAttribute('cx', '75');
  leftCheek.setAttribute('cy', '115');
  leftCheek.setAttribute('rx', '6');
  leftCheek.setAttribute('ry', '4');
  leftCheek.setAttribute('fill', '#F472B6');
  leftCheek.setAttribute('opacity', '0.4');
  svg.appendChild(leftCheek);

  const rightCheek = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'ellipse',
  );
  rightCheek.setAttribute('cx', '125');
  rightCheek.setAttribute('cy', '115');
  rightCheek.setAttribute('rx', '6');
  rightCheek.setAttribute('ry', '4');
  rightCheek.setAttribute('fill', '#F472B6');
  rightCheek.setAttribute('opacity', '0.4');
  svg.appendChild(rightCheek);

  return svg;
}

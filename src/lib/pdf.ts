import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

export const exportResumePdf = async (element: HTMLElement, filename: string) => {
  const scale = 2.5;
  const dataUrl = await domtoimage.toPng(element, {
    bgcolor: "#ffffff",
    height: element.scrollHeight,
    width: element.scrollWidth,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${element.scrollWidth}px`,
      height: `${element.scrollHeight}px`
    }
  });

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const img = new Image();
  img.src = dataUrl;

  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  const imgWidth = pageWidth;
  const imgHeight = (img.height * imgWidth) / img.width;
  let position = 0;
  let remainingHeight = imgHeight;

  while (remainingHeight > 0) {
    pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
    if (remainingHeight > 0) {
      pdf.addPage();
      position -= pageHeight;
    }
  }

  pdf.save(filename);
};

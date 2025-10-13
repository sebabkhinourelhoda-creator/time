import { useEffect, useRef } from "react";

const DNAAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.15;
      const helixHeight = canvas.height * 0.6;
      const turns = 3;

      rotation += 0.01;

      // Draw DNA double helix
      for (let i = 0; i < 100; i++) {
        const t = (i / 100) * turns * Math.PI * 2;
        const y = (i / 100) * helixHeight - helixHeight / 2 + centerY;

        // First strand
        const x1 = centerX + Math.cos(t + rotation) * radius;
        const z1 = Math.sin(t + rotation);

        // Second strand (opposite)
        const x2 = centerX + Math.cos(t + rotation + Math.PI) * radius;
        const z2 = Math.sin(t + rotation + Math.PI);

        // Color based on depth
        const opacity1 = (z1 + 1) / 2;
        const opacity2 = (z2 + 1) / 2;

        // Draw base pairs
        if (i % 5 === 0) {
          ctx.strokeStyle = `hsla(180, 65%, 45%, ${opacity1 * 0.4})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        }

        // Draw nucleotides (circles)
        const drawNucleotide = (x: number, opacity: number, color: string) => {
          ctx.fillStyle = color.replace("1)", `${opacity})`);
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        };

        drawNucleotide(x1, opacity1, "hsla(210, 100%, 25%, 1)");
        drawNucleotide(x2, opacity2, "hsla(180, 65%, 45%, 1)");
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
};

export default DNAAnimation;

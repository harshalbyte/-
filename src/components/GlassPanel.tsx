import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from 'motion/react';

export interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function GlassPanel({ children, className, interactive = true, ...props }: GlassPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for mouse coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map coordinate range [-0.5, 0.5] to a degree tilt range (e.g. [-5deg, 5deg])
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformPerspective: 1200,
        ...(props.style as any)
      }}
      className={cn(
        "bg-white/85 backdrop-blur-3xl border border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-[40px] transition-shadow duration-300",
        interactive && "hover:shadow-[0_40px_80px_-20px_rgba(244,143,177,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

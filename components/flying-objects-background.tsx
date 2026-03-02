'use client';

import React, { useEffect, useRef, useState } from 'react';

interface FlyingObject {
    id: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    shape: 'circle' | 'triangle' | 'square' | 'star';
}

export default function FlyingObjectsBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const objectsRef = useRef<FlyingObject[]>([]);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check for dark mode
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        // Watch for dark mode changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize flying objects
        const objectCount = 15;
        const objects: FlyingObject[] = [];

        const shapes: FlyingObject['shape'][] = ['circle', 'triangle', 'square', 'star'];

        for (let i = 0; i < objectCount; i++) {
            objects.push({
                id: i,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 10,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.3 + 0.1,
                shape: shapes[Math.floor(Math.random() * shapes.length)],
            });
        }

        objectsRef.current = objects;

        // Color palettes for light and dark mode
        const colors = isDark
            ? {
                circle: { r: 96, g: 165, b: 250 }, // blue-400
                triangle: { r: 167, g: 139, b: 250 }, // purple-400
                square: { r: 244, g: 114, b: 182 }, // pink-400
                star: { r: 74, g: 222, b: 128 }, // green-400
            }
            : {
                circle: { r: 59, g: 130, b: 246 }, // blue-500
                triangle: { r: 147, g: 51, b: 234 }, // purple-600
                square: { r: 236, g: 72, b: 153 }, // pink-500
                star: { r: 34, g: 197, b: 94 }, // green-500
            };

        // Draw functions for different shapes
        const drawCircle = (x: number, y: number, size: number, opacity: number) => {
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colors.circle.r}, ${colors.circle.g}, ${colors.circle.b}, ${opacity})`;
            ctx.fill();
        };

        const drawTriangle = (x: number, y: number, size: number, rotation: number, opacity: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.lineTo(-size / 2, size / 2);
            ctx.lineTo(size / 2, size / 2);
            ctx.closePath();
            ctx.fillStyle = `rgba(${colors.triangle.r}, ${colors.triangle.g}, ${colors.triangle.b}, ${opacity})`;
            ctx.fill();
            ctx.restore();
        };

        const drawSquare = (x: number, y: number, size: number, rotation: number, opacity: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.fillStyle = `rgba(${colors.square.r}, ${colors.square.g}, ${colors.square.b}, ${opacity})`;
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.restore();
        };

        const drawStar = (x: number, y: number, size: number, rotation: number, opacity: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.beginPath();
            const spikes = 5;
            const outerRadius = size / 2;
            const innerRadius = outerRadius / 2;
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes;
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(${colors.star.r}, ${colors.star.g}, ${colors.star.b}, ${opacity})`;
            ctx.fill();
            ctx.restore();
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            objectsRef.current.forEach((obj) => {
                // Update position
                obj.x += obj.speedX;
                obj.y += obj.speedY;
                obj.rotation += obj.rotationSpeed;

                // Wrap around edges
                if (obj.x < -obj.size) obj.x = canvas.width + obj.size;
                if (obj.x > canvas.width + obj.size) obj.x = -obj.size;
                if (obj.y < -obj.size) obj.y = canvas.height + obj.size;
                if (obj.y > canvas.height + obj.size) obj.y = -obj.size;

                // Draw object based on shape
                switch (obj.shape) {
                    case 'circle':
                        drawCircle(obj.x, obj.y, obj.size, obj.opacity);
                        break;
                    case 'triangle':
                        drawTriangle(obj.x, obj.y, obj.size, obj.rotation, obj.opacity);
                        break;
                    case 'square':
                        drawSquare(obj.x, obj.y, obj.size, obj.rotation, obj.opacity);
                        break;
                    case 'star':
                        drawStar(obj.x, obj.y, obj.size, obj.rotation, obj.opacity);
                        break;
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}


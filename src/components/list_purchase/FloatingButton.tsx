import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save, Printer } from 'lucide-react';

const isMobile = () => window.innerWidth <= 768;

export const FloatingButton = ({
    handleSave,
    handlePrint,
    // index
}: {
    handleSave?: () => void,
    handlePrint?: (id: number) => void
    // index?: number
}) => {
    const [showActions, setShowActions] = useState(false);
    const [position, setPosition] = useState({ x: 320, y: 580 });
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: TouchEvent | MouseEvent) => {
            if (!isDragging.current) return;
            const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const y = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

            setPosition({ x: x - offset.current.x, y: y - offset.current.y });
        };

        const stopDrag = () => {
            isDragging.current = false;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('touchend', stopDrag);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', stopDrag);
        };
    }, []);

    const startDrag = (e: React.TouchEvent | React.MouseEvent) => {
        isDragging.current = true;
        const x = 'touches' in e ? e.touches[0].clientX : (e as unknown as MouseEvent).clientX;
        const y = 'touches' in e ? e.touches[0].clientY : (e as unknown as MouseEvent).clientY;

        const rect = buttonRef.current?.getBoundingClientRect();

        offset.current = {
            x: x - (rect?.left ?? 0),
            y: y - (rect?.top ?? 0),
        };
    };

    if (!isMobile()) return null;

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            ref={buttonRef}
            className="fixed z-50"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
        >
            {/* Main Floating Button */}
            <div className="relative">
                <button
                    className="bg-emerald-500 p-4 rounded-full text-white shadow-xl"
                    onClick={() => setShowActions(!showActions)}
                >
                    <Plus />
                </button>

                {/* Action Buttons */}
                {showActions && (
                    <div className="absolute bottom-16 left-0 flex flex-col gap-2">
                        <button
                            className="bg-blue-500 p-3 rounded-full text-white shadow"
                            onClick={() => {
                                if (handleSave) {
                                    handleSave()
                                }
                            }}>
                            <Save size={18} />
                        </button>
                        <button
                            className="bg-yellow-600 p-3 rounded-full text-white shadow"
                            onClick={() => {

                                if (handlePrint) {
                                    handlePrint(0)
                                }
                            }}
                        >
                            <Printer size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

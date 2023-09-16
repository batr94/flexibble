'use client';

import { useRef, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Modal = ({ children }: { children: ReactNode }) => {
    const overlay = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    const onDismiss = useCallback(() => router.push('/'), [router]);
    const handleClick = useCallback((e: React.MouseEvent) => {
        if (e.target === overlay.current && onDismiss) {
            onDismiss()
        }
    }, [overlay, onDismiss]);

    return (
        <div ref={overlay} className='modal' onClick={handleClick}>
            <button type='button' onClick={onDismiss}>
                <Image
                    src='/close.svg'
                    alt='close button icon'
                    className='absolute top-4 right-8'
                    width={17}
                    height={17}
                />
            </button>
            <div ref={wrapper} className='modal_wrapper'>
                {children}
            </div>
        </div>
    )
}

export default Modal